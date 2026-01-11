import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

// No CORS headers needed - this is a server-to-server cron function
const jsonHeaders = { "Content-Type": "application/json" };

serve(async (req) => {
  // This function should only be called by scheduled cron jobs, not browsers
  // Block OPTIONS/CORS preflight - this is not a browser-callable endpoint
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 405 });
  }

  try {
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Authenticate: Require service role key in Authorization header
    // This ensures only authorized cron jobs can invoke this function
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${supabaseServiceKey}`) {
      console.error("Unauthorized access attempt to trial-reminder function");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
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

    const trialCount = expiringTrials?.length || 0;
    console.log(`Found ${trialCount} trials expiring tomorrow`);

    // For each user, we would send a notification
    // In a real app, this would integrate with push notifications or email
    let notificationCount = 0;
    
    for (const trial of expiringTrials || []) {
      const trialEndDate = new Date(trial.trial_end);
      const formattedDate = trialEndDate.toLocaleDateString("he-IL", {
        day: "numeric",
        month: "long",
      });

      // Log notification preparation (user_id is intentionally not exposed in response)
      console.log(`Prepared reminder for trial ending ${formattedDate}`);
      notificationCount++;
    }

    console.log(`Prepared ${notificationCount} trial ending reminders`);

    // Return minimal response - don't expose user data
    return new Response(
      JSON.stringify({
        success: true,
        reminders_prepared: notificationCount,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in trial-reminder function:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
