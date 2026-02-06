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
        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const accessToken = Deno.env.get('NOTION_ACCESS_TOKEN');

        if (!accessToken) {
            return Response.json({ error: 'Notion access token not configured' }, { status: 500 });
        }

        const content = `Section 1: App Overview & Architecture

What is this app? What problem does it solve?
"Ball in the 6" is a comprehensive youth sports platform designed to be an all-in-one solution for various stakeholders within the sports ecosystem. It aims to streamline operations and enhance engagement for players, fans, teams, coaches, and organizations.

Core problems it solves:
- Fragmented Management: Centralizes team and league management, scheduling, and communication
- Team Management: Organize rosters, collect uniform sizes, manage schedules effortlessly
- Live Stats Tracking: Real-time game stats, player performance, instant updates
- Social Network: Share highlights, build your brand, connect with the community
- Merchandise Store: Create and sell custom team gear, build your brand
- Analytics Dashboard: Track revenue, engagement, player development insights
- Automated Workflows: Payment reminders, schedules, communication—all automated

Key Features:
1. Team Creation Wizard with document upload for automatic player data extraction
2. Player Registration System with shareable registration links
3. League Management with divisions and automated round-robin scheduling
4. Live Game Tracker with real-time stats and play-by-play
5. Social Feed for sharing highlights and team updates
6. Player Profiles with stats and merchandise

Entities:
- Team, Player, Game, League, Organization, Post, Product, Payment, GameEvent

The platform supports multiple organizations managing multiple leagues, with a modern responsive UI built with React, Tailwind CSS, and shadcn/ui components.`;

        // Search for the database
        const searchResponse = await fetch('https://api.notion.com/v1/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                query: "B6 APPS Review",
                filter: { property: 'object', value: 'database' }
            })
        });

        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            return Response.json({ error: 'Database "B6 APPS Review" not found', searchData }, { status: 404 });
        }

        const database = searchData.results[0];
        const databaseId = database.id;

        // Get database schema
        const dbResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28'
            }
        });

        const dbSchema = await dbResponse.json();
        const properties = dbSchema.properties || {};

        // Build properties - find the b61 column and any title column
        let pageProperties = {};

        for (const [propName, propConfig] of Object.entries(properties)) {
            if ((propConfig as any).type === 'title') {
                pageProperties[propName] = {
                    title: [{ text: { content: "Ball in the 6 - App Review" } }]
                };
            }
            if (propName.toLowerCase() === 'b61' || propName === 'b61') {
                if ((propConfig as any).type === 'rich_text') {
                    pageProperties[propName] = {
                        rich_text: [{ text: { content: content.substring(0, 2000) } }]
                    };
                }
            }
        }

        // Create page with content in the body
        const createResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: databaseId },
                properties: pageProperties,
                children: [
                    {
                        object: 'block',
                        type: 'heading_2',
                        heading_2: {
                            rich_text: [{ text: { content: "App Overview & Architecture" } }]
                        }
                    },
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [{ text: { content: content } }]
                        }
                    }
                ]
            })
        });

        const createData = await createResponse.json();

        if (createData.object === 'error') {
            return Response.json({
                error: createData.message,
                details: createData,
                dbSchema: properties
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            pageId: createData.id,
            message: "Content added to B6 APPS Review database in b61 column"
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});
