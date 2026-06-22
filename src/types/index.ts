export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  categoryLabel: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
  breaking?: boolean;
  likes?: number;
  dislikes?: number;
  status?: string;
  subheading?: string;
  cover_image_url?: string;
  seo_title?: string;
  seo_description?: string;
  word_count?: number;
}

export interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  caption: string;
}
