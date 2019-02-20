import { EventTicketType } from './eventTicket';

export interface EventType {
  createdAt: string;
  id: number;
  name: string;
  location: string;
  url: string;
  date: string;
  description: string;
  bannerImageUrl: string;
  eventTicketTypes: [EventTicketType];
  updatedAt: string;
}
