// Shared type definitions for Date Planner

export type Mood = "romantic" | "adventurous" | "low-key" | "foodie" | "active";

export type BudgetRange = {
  min: number;
  max: number;
};

export type Location = {
  lat: number;
  lng: number;
  label: string;
};

export type Interest = {
  id: string;
  name: string;
  category: string;
};

export type UserProfile = {
  id: string;
  email: string;
  interests: Interest[];
  budgetRange: BudgetRange;
  homeLocation: Location | null;
};

export type DateIdeaActivity = {
  name: string;
  venueName: string;
  venueUrl: string | null;
  mapsUrl: string | null;
  order: number;
};

export type DateIdea = {
  id: string;
  title: string;
  description: string;
  mood: Mood;
  estimatedCost: number;
  activities: DateIdeaActivity[];
  surprise: string | null;
  imageUrl: string | null;
};

export type Bookmark = {
  userId: string;
  dateIdeaId: string;
  createdAt: Date;
};
