import { notionRequest } from '../lib/notion';
import type { User } from '../types';

export async function login(
  email: string,
  password: string
): Promise<{ success: true; user: User } | { success: false; error: string }> {
  if (!/^\d+$/.test(password)) {
    return {
      success: false,
      error: "La contrasena debe ser numerica",
    };
  }

  try {
    const databaseId = process.env.EXPO_PUBLIC_DATABASE_USUARIOS_ID!;
    const response = await notionRequest<any>(
      `/databases/${databaseId}/query`,
      {
        filter: {
          and: [
            {
              property: "Correo",
              email: {
                equals: email.trim().toLowerCase()
              }
            },
            {
              property: "Contraseña",
              number: {
                equals: parseInt(password, 10)
              }
            }
          ]
        }
      }
    );

    if (response.results.length === 0) {
      return { success: false, error: "Credenciales incorrectas" };
    }

    // Map Notion page to our User type
    const page = response.results[0];
    const user: User = {
      nombre: page.properties.Nombre.title[0]?.plain_text || '',
      clase: page.properties.Clase.select?.name || '',
      estado: page.properties.Estado.status?.name
    };

    return { success: true, user };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: "Error de conexion" };
  }
}
