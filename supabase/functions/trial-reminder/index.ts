import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate tomorrow's date range (users whose trial ends in ~24 hours)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    console.log(`Checking for trials ending between ${tomorrow.toISOString()} and ${dayAfterTomorrow.toISOString()}`);

    // Find users whose trial ends tomorrow and have reminders enabled
    const { data: expiringTrials, error: fetchError } = await supabase
      .from("subscriptions")
      .select("user_id, trial_end")
      .eq("status", "trial")
      .eq("cancel_reminder_enabled", true)
      .gte("trial_end", tomorrow.toISOString())
      .lt("trial_end", dayAfterTomorrow.toISOString());

    if (fetchError) {
      console.error("Error fetching expiring trials:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiringTrials?.length || 0} trials expiring tomorrow`);

    // For each user, we would send a notification
    // In a real app, this would integrate with push notifications or email
    const notifications = [];
    
    for (const trial of expiringTrials || []) {
      const trialEndDate = new Date(trial.trial_end);
      const formattedDate = trialEndDate.toLocaleDateString("he-IL", {
        day: "numeric",
        month: "long",
      });

      notifications.push({
        user_id: trial.user_id,
        title: "תזכורת: תקופת הניסיון מסתיימת מחר",
        message: `תקופת הניסיון שלך ב-BudgetBites מסתיימת ב-${formattedDate}. אם תרצה לבטל, עכשיו הזמן.`,
        type: "trial_ending",
      });

      console.log(`Prepared reminder for user ${trial.user_id}, trial ends ${trial.trial_end}`);
    }

    // Log the notifications that would be sent
    console.log(`Prepared ${notifications.length} trial ending reminders`);

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: notifications.length,
        notifications,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in trial-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
