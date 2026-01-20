export interface Profile {
  id: string;
  email: string;
  created_at?: string;
  picture?: string | null;
  is_admin: boolean;
}