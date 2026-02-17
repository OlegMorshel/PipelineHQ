import type {
  ThreadsUserProfile,
  ThreadsPost,
  ThreadsApiResponse,
} from "./types";

const THREADS_API_BASE = "https://graph.threads.net/v1.0";

/**
 * Типизированная обёртка над Threads API
 */
export class ThreadsClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${THREADS_API_BASE}${endpoint}`);
    url.searchParams.set("access_token", this.accessToken);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `Threads API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Получить профиль пользователя
   */
  async getProfile(): Promise<ThreadsUserProfile> {
    return this.fetch<ThreadsUserProfile>("/me", {
      fields: "id,username,name,threads_profile_picture_url,threads_biography",
    });
  }

  /**
   * Получить посты пользователя
   */
  async getPosts(limit = 25): Promise<ThreadsApiResponse<ThreadsPost>> {
    return this.fetch<ThreadsApiResponse<ThreadsPost>>("/me/threads", {
      fields: "id,media_product_type,media_type,text,permalink,timestamp,shortcode,is_quote_post",
      limit: limit.toString(),
    });
  }
}
