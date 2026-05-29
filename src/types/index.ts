export interface User {
  nombre: string;
  clase: string;
  estado?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  clase?: string;
}

export type LoginResponse =
  | { success: true; user: User }
  | { success: false; error: string };

export interface ResourcesResponse {
  resources: Resource[];
}
