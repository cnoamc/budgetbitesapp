import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate URL to prevent SSRF attacks
function isValidRecipeUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(urlString);
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Only HTTP/HTTPS URLs are allowed' };
    }
    
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost and loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return { valid: false, error: 'Local addresses are not allowed' };
    }
    
    // Block private IP ranges
    const privateIPPatterns = [
      /^10\./,                          // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
      /^192\.168\./,                     // 192.168.0.0/16
      /^169\.254\./,                     // Link-local
      /^0\./,                            // 0.0.0.0/8
    ];
    
    for (const pattern of privateIPPatterns) {
      if (pattern.test(hostname)) {
        return { valid: false, error: 'Private IP addresses are not allowed' };
      }
    }
    
    // Block cloud metadata endpoints
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      return { valid: false, error: 'Metadata endpoints are not allowed' };
    }
    
    // Block internal Supabase domains
    if (hostname.includes('supabase') && !hostname.includes('supabase.co')) {
      return { valid: false, error: 'Internal domains are not allowed' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ success: false, error: 'יש להתחבר כדי לייבא מתכונים' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Invalid token:', claimsError);
      return new Response(
        JSON.stringify({ success: false, error: 'יש להתחבר מחדש' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL to prevent SSRF
    const urlValidation = isValidRecipeUrl(url);
    if (!urlValidation.valid) {
      console.error('Invalid URL rejected:', url, urlValidation.error);
      return new Response(
        JSON.stringify({ success: false, error: 'כתובת לא תקינה' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Importing recipe from:', url);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Fetch the page content
    let pageContent = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BudgetBites/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }
      
      // Limit response size to 1MB
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 1024 * 1024) {
        throw new Error('Response too large');
      }
      
      pageContent = await response.text();
      
      // Double-check size after reading
      if (pageContent.length > 1024 * 1024) {
        pageContent = pageContent.substring(0, 1024 * 1024);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      const errorMessage = fetchError instanceof Error && fetchError.name === 'AbortError' 
        ? 'הזמן הקצוב לבקשה פג' 
        : 'לא הצלחנו לגשת לכתובת';
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract recipe data using AI
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Truncate content to avoid token limits
    const truncatedContent = pageContent.substring(0, 15000);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: `You are a recipe extraction assistant. Extract recipe information from HTML/text content and return ONLY valid JSON in Hebrew.

Return this exact JSON structure:
{
  "name": "שם המתכון בעברית",
  "emoji": "🍽️",
  "ingredients": ["מרכיב 1", "מרכיב 2"],
  "steps": ["שלב 1", "שלב 2"],
  "prepTime": 30,
  "servings": 4,
  "category": "easy"
}

If you can't find a recipe, return: {"error": "לא נמצא מתכון בדף"}

Translate to Hebrew if the content is in another language.`
          },
          {
            role: 'user',
            content: `Extract the recipe from this page content:\n\n${truncatedContent}`
          }
        ],
        max_completion_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      throw new Error('Failed to parse recipe');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    // Parse the JSON response
    let recipe;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipe = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Content:', aiContent);
      return new Response(
        JSON.stringify({ success: false, error: 'לא הצלחנו לחלץ את המתכון' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (recipe.error) {
      return new Response(
        JSON.stringify({ success: false, error: recipe.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!recipe.name || !recipe.ingredients || !recipe.steps) {
      return new Response(
        JSON.stringify({ success: false, error: 'מתכון חלקי - חסרים פרטים חשובים' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully extracted recipe:', recipe.name);

    return new Response(
      JSON.stringify({ success: true, recipe }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error importing recipe:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'שגיאה בייבוא המתכון' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
