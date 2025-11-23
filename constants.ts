import { QuoteCategory } from './types';

export const INITIAL_CATEGORY = QuoteCategory.ATHLETE;

export const CATEGORY_LABELS: Record<QuoteCategory, string> = {
  [QuoteCategory.ATHLETE]: 'Sport',
  [QuoteCategory.STOIC]: 'Stoic',
  [QuoteCategory.BIBLE]: 'Bible',
  [QuoteCategory.PRAYER]: 'Prayer'
};

export const CATEGORY_ORDER = [
  QuoteCategory.ATHLETE,
  QuoteCategory.STOIC,
  QuoteCategory.BIBLE,
  QuoteCategory.PRAYER
];

export const FALLBACK_QUOTES = {
  [QuoteCategory.BIBLE]: {
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13"
  },
  [QuoteCategory.PRAYER]: {
    text: "Lord, grant me the strength to endure what I cannot change, and the courage to change what I can.",
    reference: "Serenity Prayer"
  },
  [QuoteCategory.STOIC]: {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    reference: "Marcus Aurelius"
  },
  [QuoteCategory.ATHLETE]: {
    text: "It's not about how hard you hit. It's about how hard you can get hit and keep moving forward.",
    reference: "Rocky Balboa"
  }
};