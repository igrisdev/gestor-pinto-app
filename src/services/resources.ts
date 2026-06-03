import { notionRequest } from '../lib/notion';
import type { Resource } from '../types';

export async function getByClass(clase: string) {
  try {
    const databaseId = process.env.EXPO_PUBLIC_DATABASE_RECURSOS_ID!;
    const response = await notionRequest<any>(
      `/databases/${databaseId}/query`,
      {
        filter: {
          and: [
            {
              property: "Clase",
              select: {
                equals: clase
              }
            },
            {
              property: "Estado",
              status: {
                equals: "Listo"
              }
            }
          ]
        }
      }
    );

    return response.results.map((page: any) => {
      const props = page.properties || {};
      return {
        id: page.id || '',
        title: Array.isArray(props.Titulo?.title) && props.Titulo.title.length > 0 
          ? props.Titulo.title[0]?.plain_text || '' 
          : '',
        description: Array.isArray(props.Comentarios?.rich_text) 
          ? props.Comentarios.rich_text.map((t: any) => t.plain_text).join(' ') 
          : '',
        link: props.URL?.url || '',
        clase: props.Clase?.select?.name || ''
      };
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    // For now, return empty array to avoid breaking the UI
    // In a production app, we might want to surface this error to the user
    return [];
  }
}
