export enum UserRole {
  Free = 'Free',
  Premium = 'Premium',
  Admin = 'Admin',
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}
