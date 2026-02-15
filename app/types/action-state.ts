export interface ActionState {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
}