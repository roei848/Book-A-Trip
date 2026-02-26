import { apiClient } from './client';
import type { AdminUser } from '../types/models';
import { UserRole } from '../types/auth';

export const getUsers = async (): Promise<AdminUser[]> => {
  const res = await apiClient.get<AdminUser[]>('/users');
  return res.data;
};

export const updateUserRole = async (id: string, role: UserRole): Promise<void> => {
  await apiClient.patch(`/users/${id}/role`, { role });
};
