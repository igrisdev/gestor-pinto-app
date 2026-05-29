const NOTION_TOKEN = process.env.EXPO_PUBLIC_NOTION_TOKEN;
const NOTION_VERSION = '2022-06-28';
const NOTION_API_BASE = 'https://api.notion.com/v1';

export async function notionRequest<T>(
  endpoint: string,
  body?: object
): Promise<T> {
  const url = `${NOTION_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Notion API error: ${response.status} ${errorText}`);
  }

  return response.json();
}
