import {
  AttractionCategory,
  BudgetLevel,
  FoodPreference,
  TransportType,
  TravelPace,
} from './enums';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: Location;
  durationInMinutes: number;
  category: AttractionCategory;
}

export interface TripDay {
  dayNumber: number;
  date: string | null;
  attractions: Attraction[];
  startLocation: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
  budget: BudgetLevel;
  transport: TransportType;
  pace: TravelPace;
  food: FoodPreference;
  pointsOfInterest: AttractionCategory[];
  travelersCount: number;
  note: string;
}

export interface TripSummary {
  id: string;
  title: string;
  destination: string;
}

export interface GenerateTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: BudgetLevel;
  transport: TransportType;
  pace: TravelPace;
  food: FoodPreference;
  pointsOfInterest: AttractionCategory[];
  travelersCount: number;
  note: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}
