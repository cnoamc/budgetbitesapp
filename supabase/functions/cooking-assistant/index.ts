import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        JSON.stringify({ error: 'יש להתחבר כדי להשתמש בעוזר הבישול' }),
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
        JSON.stringify({ error: 'יש להתחבר מחדש' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    const { messages, recipeName, currentStep, totalSteps, ingredients, stepInstruction, isLastStep } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Check if this is general chat (no recipe) or cooking assistant mode
    const isGeneralChat = !recipeName;

    let systemPrompt: string;
    
    if (isGeneralChat) {
      systemPrompt = `אתה עוזר בישול ידידותי ומעודד בשם "שפי". אתה עוזר למשתמשים צעירים (גילאי 16-29) עם כל נושא שקשור לאוכל ובישול.

הנחיות חשובות:
- דבר בעברית בלבד
- תן תשובות קצרות וממוקדות (2-4 משפטים)
- השתמש בשפה חמה, מעודדת וידידותית
- השתמש באימוג'י אחד או שניים
- עזור עם שאלות על מתכונים, טיפים לבישול, חיסכון בקניות, אכילה בריאה
- המלץ על מתכונים פשוטים למתחילים
- עודד את המשתמש לבשל ולחסוך כסף
- היה אופטימי ותומך

אתה יכול לעזור עם:
🍳 רעיונות למתכונים ומה לבשל היום
💰 טיפים לחיסכון בקניות ובישול
🥗 המלצות לאכילה בריאה
⏱️ מתכונים מהירים וקלים
🔧 פתרון בעיות בבישול`;
    } else {
      systemPrompt = `אתה עוזר בישול ידידותי ומעודד בשם "שפי". אתה מלווה משתמשים צעירים (גילאי 16-29) שלומדים לבשל.

המתכון הנוכחי: ${recipeName}
שלב נוכחי: ${currentStep} מתוך ${totalSteps}
מרכיבים: ${ingredients?.join(', ') || 'לא צוינו'}
${stepInstruction ? `הוראת השלב הנוכחי: ${stepInstruction}` : ''}
${isLastStep ? 'זה השלב האחרון - המשתמש סיים!' : ''}

הנחיות חשובות:
- דבר בעברית בלבד
- תן תשובה אחת בלבד, קצרה וממוקדת (2-3 משפטים מקסימום)
- אל תחזור על עצמך ואל תשלח הודעות כפולות
- אם יש הוראת שלב, שלב אותה בתשובתך בצורה טבעית
- השתמש בשפה חמה, מעודדת וידידותית
- השתמש באימוג'י אחד או שניים בלבד
- אם המשתמש שואל שאלה, תן תשובה ישירה וקצרה
- אם זה השלב האחרון, בשר לו שהוא סיים ותן לו כל הכבוד

דוגמאות לתגובות טובות:
- "מעולה! עכשיו נטגן 3 דקות על אש בינונית 🍳"
- "יופי! הוסף את הבצל וערבב עד שהוא משחים 👨‍🍳"
- "סיימת! נראה מדהים, תהנה מהאוכל! 🎉"`;
    }

    console.log('Calling Lovable AI with messages:', messages.length, 'mode:', isGeneralChat ? 'general' : 'cooking');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'יותר מדי בקשות, נסה שוב בעוד כמה שניות' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'נגמרו הקרדיטים, צריך להוסיף עוד' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'אופס, משהו השתבש. נסה שוב!';

    console.log('AI response received successfully');

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cooking assistant error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'שגיאה לא צפויה' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
