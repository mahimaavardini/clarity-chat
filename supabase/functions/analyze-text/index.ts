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
    const { text } = await req.json();
    
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide text to analyze" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log("Analyzing text:", text.substring(0, 100) + "...");

    const systemPrompt = `You are an accessibility-focused text analyzer that helps people understand sarcasm, metaphors, and figurative language. Your role is to help individuals who may struggle with interpreting tone and non-literal speech, such as those on the autism spectrum.

Analyze the provided text and return a JSON response using the following tool call format. Be thorough and educational in your explanations.

For each piece of sarcasm or metaphor found:
- Explain WHY it is sarcasm or a metaphor (the underlying mechanism)
- Provide the LITERAL meaning (what the words actually say)
- Provide the INTENDED meaning (what the speaker actually means)
- Give a confidence level (high, medium, low)

Be encouraging and supportive in tone. If the text is straightforward with no figurative language, celebrate that clarity.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this text for sarcasm and metaphors:\n\n"${text}"` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_analysis",
              description: "Provide the analysis of text for sarcasm and metaphors",
              parameters: {
                type: "object",
                properties: {
                  overallTone: {
                    type: "string",
                    description: "A brief, friendly description of the overall tone of the text"
                  },
                  hasSarcasm: {
                    type: "boolean",
                    description: "Whether the text contains sarcasm"
                  },
                  hasMetaphors: {
                    type: "boolean",
                    description: "Whether the text contains metaphors or figurative language"
                  },
                  sarcasmInstances: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phrase: { type: "string", description: "The sarcastic phrase or sentence" },
                        literalMeaning: { type: "string", description: "What the words literally say" },
                        intendedMeaning: { type: "string", description: "What the speaker actually means" },
                        explanation: { type: "string", description: "Why this is sarcastic - explain the mechanism" },
                        confidence: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["phrase", "literalMeaning", "intendedMeaning", "explanation", "confidence"]
                    }
                  },
                  metaphorInstances: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phrase: { type: "string", description: "The metaphorical phrase" },
                        literalMeaning: { type: "string", description: "What the words literally say" },
                        intendedMeaning: { type: "string", description: "What the speaker actually means" },
                        explanation: { type: "string", description: "Why this is a metaphor - explain the comparison being made" },
                        confidence: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["phrase", "literalMeaning", "intendedMeaning", "explanation", "confidence"]
                    }
                  },
                  summary: {
                    type: "string",
                    description: "A supportive, encouraging summary of the analysis in 1-2 sentences"
                  }
                },
                required: ["overallTone", "hasSarcasm", "hasMetaphors", "sarcasmInstances", "metaphorInstances", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_analysis" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze text");
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the tool call arguments
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("Unexpected response format:", JSON.stringify(data));
      throw new Error("Invalid response from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log("Analysis complete:", analysis.summary);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-text function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
