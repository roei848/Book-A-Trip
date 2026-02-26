import { apiClient } from './client';
import type { GenerateTripRequest, Trip, TripSummary } from '../types/models';

export const getTrips = async (): Promise<TripSummary[]> => {
  const res = await apiClient.get<TripSummary[]>('/itinerary');
  return res.data;
};

export const getTripById = async (id: string): Promise<Trip> => {
  const res = await apiClient.get<Trip>(`/itinerary/${id}`);
  return res.data;
};

export const generateTrip = async (request: GenerateTripRequest): Promise<Trip> => {
  const res = await apiClient.post<Trip>('/itinerary/generate', request);
  return res.data;
};

export const updateTripImage = async (id: string, imageUrl: string): Promise<void> => {
  await apiClient.patch(`/itinerary/${id}/image`, { imageUrl });
};
