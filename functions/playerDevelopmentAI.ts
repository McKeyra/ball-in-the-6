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

        const body = await req.json();
        const { action, player_id, recent_stats, video_context } = body;

        const invokeLLM = async (prompt: string, schema: object) => {
            const { data, error } = await supabase.functions.invoke('invoke-llm', {
                body: { prompt, response_json_schema: schema }
            });
            if (error) throw error;
            return data;
        };

        if (action === 'generate_plan') {
            const prompt = `
                Create a personalized basketball training plan for a player with the following recent stats/context:
                ${JSON.stringify(recent_stats)}

                The plan should focus on improving their weak areas based on the stats.
                Return a JSON object with:
                - title (string)
                - focus_areas (array of strings)
                - exercises (array of objects with name, description, duration, reps)
                - ai_notes (string explaining why this plan was chosen)
            `;

            const result = await invokeLLM(prompt, {
                type: "object",
                properties: {
                    title: { type: "string" },
                    focus_areas: { type: "array", items: { type: "string" } },
                    exercises: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                description: { type: "string" },
                                duration: { type: "string" },
                                reps: { type: "string" }
                            }
                        }
                    },
                    ai_notes: { type: "string" }
                }
            });
            return Response.json(result);
        }

        if (action === 'analyze_video') {
             const prompt = `
                Analyze the basketball technique described here (simulating video analysis):
                ${video_context.description}

                Provide constructive feedback on form, technique, and suggestions for improvement.
                Keep it concise and encouraging.
            `;
             const result = await invokeLLM(prompt, {
                type: "object",
                properties: {
                    feedback: { type: "string" }
                }
            });
            return Response.json(result);
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});
