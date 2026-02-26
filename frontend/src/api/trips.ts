import { apiClient } from './client';
import type { Trip, TripSummary } from '../types/models';

export const getTrips = async (): Promise<TripSummary[]> => {
  const res = await apiClient.get<TripSummary[]>('/itinerary');
  return res.data;
};

export const getTripById = async (id: string): Promise<Trip> => {
  const res = await apiClient.get<Trip>(`/itinerary/${id}`);
  return res.data;
};
