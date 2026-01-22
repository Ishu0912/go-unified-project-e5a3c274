import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  type: "booking_confirmation" | "trip_reminder" | "sos_alert" | "review_thanks";
  data: Record<string, unknown>;
}

const getEmailContent = (type: string, data: Record<string, unknown>) => {
  switch (type) {
    case "booking_confirmation":
      return {
        subject: `🎫 Booking Confirmed - ${data.bookingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
              <p style="font-size: 16px; color: #334155;">Hello ${data.userName || "Traveler"},</p>
              <p style="font-size: 16px; color: #334155;">Your ${data.bookingType} booking has been confirmed!</p>
              
              <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b;">📋 Booking Details</h3>
                <p style="margin: 8px 0; color: #475569;"><strong>Booking ID:</strong> ${data.bookingId}</p>
                <p style="margin: 8px 0; color: #475569;"><strong>Route:</strong> ${data.from} → ${data.to}</p>
                <p style="margin: 8px 0; color: #475569;"><strong>Date:</strong> ${data.travelDate}</p>
                ${data.seatNumbers ? `<p style="margin: 8px 0; color: #475569;"><strong>Seats:</strong> ${data.seatNumbers}</p>` : ""}
                <p style="margin: 8px 0; color: #475569;"><strong>Amount Paid:</strong> ₹${data.finalPrice}</p>
              </div>

              <p style="font-size: 14px; color: #64748b; text-align: center;">
                Show your QR code at boarding for verification.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 12px; color: #94a3b8;">
                  GO UNIFIED - Tamil Nadu's Smart Travel Platform
                </p>
              </div>
            </div>
          </div>
        `,
      };

    case "trip_reminder":
      return {
        subject: `⏰ Trip Reminder - Tomorrow's Journey`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Trip Reminder</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
              <p style="font-size: 16px; color: #334155;">Hello ${data.userName || "Traveler"},</p>
              <p style="font-size: 16px; color: #334155;">This is a reminder for your upcoming trip tomorrow!</p>
              
              <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 8px 0; color: #475569;"><strong>Route:</strong> ${data.from} → ${data.to}</p>
                <p style="margin: 8px 0; color: #475569;"><strong>Date:</strong> ${data.travelDate}</p>
                <p style="margin: 8px 0; color: #475569;"><strong>Booking ID:</strong> ${data.bookingId}</p>
              </div>

              <p style="font-size: 14px; color: #64748b;">
                Have a safe journey! 🚌
              </p>
            </div>
          </div>
        `,
      };

    case "sos_alert":
      return {
        subject: `🚨 EMERGENCY SOS ALERT - Immediate Action Required`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🚨 EMERGENCY SOS ALERT</h1>
            </div>
            <div style="background: #fef2f2; padding: 30px; border-radius: 0 0 16px 16px;">
              <p style="font-size: 18px; color: #991b1b; font-weight: bold;">${data.userName || "Someone"} has triggered an SOS alert!</p>
              
              <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #dc2626;">
                <h3 style="margin: 0 0 15px 0; color: #dc2626;">📍 Location Details</h3>
                <p style="margin: 8px 0; color: #475569;"><strong>Coordinates:</strong> ${data.latitude}, ${data.longitude}</p>
                <p style="margin: 8px 0; color: #475569;"><strong>Time:</strong> ${data.time}</p>
                <a href="https://www.google.com/maps?q=${data.latitude},${data.longitude}" 
                   style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
                  View on Google Maps
                </a>
              </div>

              <p style="font-size: 14px; color: #991b1b; font-weight: bold;">
                Please respond immediately or contact emergency services!
              </p>
              
              <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">
                Emergency Numbers: Police 100 | Women Helpline 181 | Emergency 112
              </p>
            </div>
          </div>
        `,
      };

    case "review_thanks":
      return {
        subject: `⭐ Thanks for Your Review!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⭐ Thanks for Your Feedback!</h1>
            </div>
            <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
              <p style="font-size: 16px; color: #334155;">Hello ${data.userName || "Traveler"},</p>
              <p style="font-size: 16px; color: #334155;">Thank you for rating your recent trip with ${data.rating} stars!</p>
              <p style="font-size: 14px; color: #64748b;">Your feedback helps us improve our services for everyone.</p>
            </div>
          </div>
        `,
      };

    default:
      return {
        subject: "GO UNIFIED Notification",
        html: `<p>You have a new notification from GO UNIFIED.</p>`,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: EmailRequest = await req.json();

    if (!to || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { subject, html } = getEmailContent(type, data);

    const emailResponse = await resend.emails.send({
      from: "GO UNIFIED <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
