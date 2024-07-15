export type CreateQuoteDTO = {
  quote: string;
  personQuoted: string;
  contextOfQuote?: string | null;
};

export type CreateCalendarEventDTO = {
  title: string;
  description: string | null;
  date: string;
  category: string;
  visibility: string;
};
