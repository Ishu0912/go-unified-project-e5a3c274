import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SOSRequest {
  phoneNumbers: string[];
  latitude: number;
  longitude: number;
  accuracy?: number;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("Missing Twilio credentials");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { phoneNumbers, latitude, longitude, accuracy, userName }: SOSRequest = await req.json();

    if (!phoneNumbers || phoneNumbers.length === 0) {
      return new Response(
        JSON.stringify({ error: "No phone numbers provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    const message = `🚨 SOS EMERGENCY ALERT 🚨

${userName ? `From: ${userName}` : "Someone needs help!"}

📍 LIVE LOCATION:
${mapLink}

Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
${accuracy ? `Accuracy: ~${accuracy.toFixed(0)}m` : ""}

⏰ Time: ${time}

📞 Emergency Numbers:
• Police: 100
• Women Helpline: 181
• Emergency: 112

Please respond immediately!

- GO UNIFIED Safety Alert`;

    const results = [];
    
    for (const phoneNumber of phoneNumbers) {
      try {
        // Format phone number (add +91 if not present)
        let formattedPhone = phoneNumber.replace(/\s/g, "");
        if (!formattedPhone.startsWith("+")) {
          formattedPhone = "+91" + formattedPhone.replace(/^0/, "");
        }

        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        
        const response = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
          },
          body: new URLSearchParams({
            To: formattedPhone,
            From: twilioPhone,
            Body: message,
          }),
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log(`SMS sent successfully to ${formattedPhone}:`, result.sid);
          results.push({ phone: formattedPhone, success: true, sid: result.sid });
        } else {
          console.error(`Failed to send SMS to ${formattedPhone}:`, result);
          results.push({ phone: formattedPhone, success: false, error: result.message });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error sending SMS to ${phoneNumber}:`, error);
        results.push({ phone: phoneNumber, success: false, error: errorMessage });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return new Response(
      JSON.stringify({ 
        message: `SOS alerts sent to ${successCount}/${phoneNumbers.length} contacts`,
        results 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error("Error in send-sos-sms function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
