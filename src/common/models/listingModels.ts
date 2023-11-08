import { Timestamp } from 'firebase/firestore';

export interface Listing {
  id: string;
  category: string;
  created: Timestamp;
  description: string;
  images: string[];
  last_edit: Timestamp;
  price: number;
  status: string;
  subcategory: string;
  title: string;
  user: string;
}
