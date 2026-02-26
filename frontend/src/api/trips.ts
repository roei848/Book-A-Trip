import { apiClient } from './client';
import type { EquipmentList, GenerateTripRequest, Trip, TripSummary } from '../types/models';

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

export const generateEquipmentList = async (tripId: string): Promise<EquipmentList> => {
  const res = await apiClient.post<EquipmentList>(`/itinerary/${tripId}/equipment`);
  return res.data;
};

export const updateTripImage = async (id: string, imageUrl: string): Promise<void> => {
  await apiClient.patch(`/itinerary/${id}/image`, { imageUrl });
};
