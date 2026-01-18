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

    const systemPrompt = `You are an accessibility-focused text analyzer that helps people understand sarcasm, figurative language, and tone. Your role is to help individuals who may struggle with interpreting tone and non-literal speech, such as those on the autism spectrum.

Analyze the provided text and return a JSON response using the following tool call format. Be thorough and educational in your explanations.

IMPORTANT: You must analyze for ALL types of figurative language, including:
- Sarcasm (saying the opposite of what you mean)
- Metaphors (direct comparisons without "like" or "as")
- Similes (comparisons using "like" or "as")
- Personification (giving human qualities to non-human things)
- Hyperbole (extreme exaggeration for effect)
- Idioms (phrases with non-literal cultural meanings)
- Symbolism (using objects to represent ideas)
- Imagery (vivid descriptive language)

For each piece of sarcasm or figurative language found:
- Identify the TYPE of figurative language (metaphor, simile, personification, hyperbole, idiom, symbolism, imagery)
- Explain WHY it qualifies as that type
- Provide the LITERAL meaning (what the words actually say)
- Provide the INTENDED meaning (what the speaker actually means)
- Give a confidence level (high, medium, low)

Also provide a SIMPLIFIED EXPLANATION of the entire text - rewrite it in simple, clear, accessible language that removes all figurative language and expresses the core meaning directly.

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
          { role: "user", content: `Please analyze this text for sarcasm and all types of figurative language:\n\n"${text}"` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_analysis",
              description: "Provide the analysis of text for sarcasm and figurative language",
              parameters: {
                type: "object",
                properties: {
                  overallTone: {
                    type: "string",
                    description: "A brief, friendly description of the overall tone of the text"
                  },
                  simplifiedExplanation: {
                    type: "string",
                    description: "A simplified, plain-language rewrite of the text that removes all figurative language and expresses the core meaning directly. This should be easy to understand for someone who struggles with non-literal speech."
                  },
                  hasSarcasm: {
                    type: "boolean",
                    description: "Whether the text contains sarcasm"
                  },
                  hasFigurativeLanguage: {
                    type: "boolean",
                    description: "Whether the text contains any figurative language (metaphors, similes, personification, hyperbole, idioms, symbolism, imagery)"
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
                  figurativeLanguageInstances: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        phrase: { type: "string", description: "The figurative phrase" },
                        type: { type: "string", enum: ["metaphor", "simile", "personification", "hyperbole", "idiom", "symbolism", "imagery"], description: "The type of figurative language" },
                        literalMeaning: { type: "string", description: "What the words literally say" },
                        intendedMeaning: { type: "string", description: "What the speaker actually means" },
                        explanation: { type: "string", description: "Why this is figurative language - explain the comparison or mechanism being used" },
                        confidence: { type: "string", enum: ["high", "medium", "low"] }
                      },
                      required: ["phrase", "type", "literalMeaning", "intendedMeaning", "explanation", "confidence"]
                    }
                  },
                  summary: {
                    type: "string",
                    description: "A supportive, encouraging summary of the analysis in 1-2 sentences"
                  }
                },
                required: ["overallTone", "simplifiedExplanation", "hasSarcasm", "hasFigurativeLanguage", "sarcasmInstances", "figurativeLanguageInstances", "summary"]
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
    
    // Map figurativeLanguageInstances to metaphorInstances for backwards compatibility
    // while keeping the new structure available
    analysis.hasMetaphors = analysis.hasFigurativeLanguage;
    analysis.metaphorInstances = analysis.figurativeLanguageInstances || [];
    
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
