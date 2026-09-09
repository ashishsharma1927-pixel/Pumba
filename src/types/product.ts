export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified?: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Tech' | 'Fashion' | 'Accessories' | 'Gaming' | 'Lifestyle' | string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  imageUrl: string;
  gallery?: string[];
  colors?: ProductColor[];
  variants?: string[];
  has3D?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  featured?: boolean;
  createdAt?: string;
  description?: string;
  specs?: ProductSpec[];
  reviews?: ProductReview[];
}
