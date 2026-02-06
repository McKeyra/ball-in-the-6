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

        const { content, databaseName, columnName } = await req.json();
        const accessToken = Deno.env.get('NOTION_ACCESS_TOKEN');

        if (!accessToken) {
            return Response.json({ error: 'Notion access token not configured' }, { status: 500 });
        }

        // Search for the database by name
        const searchResponse = await fetch('https://api.notion.com/v1/search', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                query: databaseName,
                filter: { property: 'object', value: 'database' }
            })
        });

        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            return Response.json({ error: 'Database not found', searchData }, { status: 404 });
        }

        const database = searchData.results[0];
        const databaseId = database.id;

        // Get database schema to find the correct property type
        const dbResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Notion-Version': '2022-06-28'
            }
        });

        const dbSchema = await dbResponse.json();
        const properties = dbSchema.properties || {};
        const columnType = properties[columnName]?.type;

        // Build properties object based on column type
        let pageProperties = {};

        if (columnType === 'title') {
            pageProperties[columnName] = {
                title: [{ text: { content: content.substring(0, 2000) } }]
            };
        } else if (columnType === 'rich_text') {
            pageProperties[columnName] = {
                rich_text: [{ text: { content: content.substring(0, 2000) } }]
            };
        } else {
            // Default to rich_text
            pageProperties[columnName] = {
                rich_text: [{ text: { content: content.substring(0, 2000) } }]
            };
        }

        // Create a new row in the database
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
            return Response.json({ error: createData.message, details: createData }, { status: 400 });
        }

        return Response.json({ success: true, pageId: createData.id });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});
