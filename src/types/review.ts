import { User } from './auth';

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  user: Pick<User, 'id' | 'firstName' | 'lastName'>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  rating: number;
  title?: string;
  comment?: string;
}
