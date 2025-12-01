export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  posterUrl: string; // Vertical poster for mobile/app feel
  coverUrl: string;
  videoUrl?: string; // URL for the video player (iframe)
  genre: string[];
  duration: string;
  rating: string;
  matchScore: number;
  year: number;
}

export interface Genre {
  id: string;
  name: string;
}

export interface AppConfig {
  appName: string;
  logoUrl: string; // If empty, uses text
  primaryColor: string; // Replaces Red
  backgroundColor: string; // Replaces Black
  secondaryColor: string; // Replaces Dark Gray
  textColor: string;
  showBillboard: boolean;
  categoryOrder: string[]; // Array of category IDs to determine render order
}

export interface CategoryDef {
  id: string;
  title: string;
  filter: (movies: Movie[]) => Movie[];
}

export enum ViewState {
  HOME,
  SEARCH,
  MY_LIST,
  NEW_HOT,
  ADMIN
}