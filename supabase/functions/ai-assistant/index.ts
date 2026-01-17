import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are the GO UNIFIED AI Travel Assistant for Tamil Nadu, India. You help users:
- Book buses, cabs, car rentals, and flights within Tamil Nadu
- Provide travel recommendations and route suggestions
- Answer questions about Tamil Nadu destinations, temples, beaches, and attractions
- Assist with ticket tracking and travel queries
- Support multiple languages including Tamil and English

Be friendly, helpful, and concise. Use Tamil greetings occasionally. Focus only on Tamil Nadu travel services.
Popular destinations: Chennai, Madurai, Coimbatore, Trichy, Thanjavur, Kanyakumari, Ooty, Kodaikanal, Mahabalipuram, Rameswaram.`
          },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI gateway error:", error);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I apologize, I couldn't process your request.";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
