import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Importing recipe from:', url);

    // Fetch the page content
    let pageContent = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BudgetBites/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }
      
      pageContent = await response.text();
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'לא הצלחנו לגשת לכתובת' }),
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

    const aiResponse = await fetch('https://api.lovable.dev/v1/chat/completions', {
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
        temperature: 0.3,
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
