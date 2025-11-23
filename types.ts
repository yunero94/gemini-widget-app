export enum QuoteCategory {
  BIBLE = 'BIBLE',
  PRAYER = 'PRAYER',
  STOIC = 'STOIC',
  ATHLETE = 'ATHLETE'
}

export interface QuoteData {
  text: string;
  reference: string; // Author or Book/Verse
  category: QuoteCategory;
}

export interface FavoriteItem extends QuoteData {
  id: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type FontStyle = 'serif' | 'sans';