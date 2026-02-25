export interface Profile {
  id: string;
  email: string;
  username?: string;
  created_at?: string;
  picture?: string | null;
  is_admin: boolean;
}