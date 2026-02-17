/**
 * Типы ответов Threads API (Meta)
 */

export interface ThreadsUserProfile {
  id: string;
  username: string;
  name?: string;
  threads_profile_picture_url?: string;
  threads_biography?: string;
}

export interface ThreadsPost {
  id: string;
  media_product_type: "THREADS";
  media_type: "TEXT_POST" | "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  text?: string;
  permalink?: string;
  timestamp: string;
  shortcode?: string;
  is_quote_post?: boolean;
}

export interface ThreadsPostInsights {
  id: string;
  views?: number;
  likes?: number;
  replies?: number;
  reposts?: number;
  quotes?: number;
}

export interface ThreadsApiResponse<T> {
  data: T[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}
