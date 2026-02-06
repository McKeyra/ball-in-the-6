import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const token = authHeader?.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const { action, messages, text, targetLanguage, userRole } = await req.json();

        const invokeLLM = async (prompt: string, schema: object) => {
            const { data, error } = await supabase.functions.invoke('invoke-llm', {
                body: { prompt, response_json_schema: schema }
            });
            if (error) throw error;
            return data;
        };

        // 1. Analyze Conversation (Suggestions & Categorization)
        if (action === 'analyze') {
            const prompt = `
                Analyze the following conversation context for a user with role: ${userRole}.

                Recent Messages:
                ${JSON.stringify(messages.slice(-5))}

                Task:
                1. Determine the primary category of the latest message (general, scheduling, payment, urgent, inquiry).
                2. Generate 3 short, context-aware reply suggestions for the user.
                3. If there's a conflict or action item (like a payment due), note it.

                Return JSON:
                {
                    "category": "string",
                    "suggestions": ["string", "string", "string"],
                    "action_item": "string or null"
                }
            `;

            const result = await invokeLLM(prompt, {
                type: "object",
                properties: {
                    category: { type: "string" },
                    suggestions: { type: "array", items: { type: "string" } },
                    action_item: { type: "string" }
                }
            });

            return Response.json(result);
        }

        // 2. Real-time Translation
        if (action === 'translate') {
            const prompt = `Translate the following text to ${targetLanguage || 'English'}: "${text}"`;
            const result = await invokeLLM(prompt, {
                type: "object",
                properties: {
                    translated_text: { type: "string" }
                }
            });
            return Response.json(result);
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});
