import type {
  MioClientSDKConfig,
  MioClientSDKInitConfig,
  MioServerSDKConfig,
  MioServerSDKInitConfig
} from './config.js';
import { MioChatResponseSchema, type MioChatResponse } from './validation.js';

export interface MioSDKOptions {
  accessToken: string;
}

export interface ChatRequestOptions extends MioSDKOptions {
  query: string;
}

/**
 * Base SDK class with shared functionality for both client and server SDKs
 */
export abstract class BaseMioSDK {
  protected config: MioClientSDKConfig | MioServerSDKConfig;

  constructor(config: MioClientSDKInitConfig | MioServerSDKInitConfig) {
    this.config = config as never;
  }

  // Authenticated fetch helper
  private async authenticatedFetch(
    url: string,
    options: RequestInit = {},
    accessToken: string
  ): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
      ...options,
      headers
    });
  }

  // LLM Integration using authenticated fetch
  async chat(options: ChatRequestOptions): Promise<MioChatResponse> {
    const response = await this.authenticatedFetch(
      `${this.config.mioApiUrl}/v1/context`,
      {
        method: 'POST',
        body: JSON.stringify({
          query: options.query,
          k: 3
        })
      },
      options.accessToken
    );

    if (!response.ok) {
      throw new Error('Failed to get LLM response');
    }

    const data = await response.json();
    const chatResponse = MioChatResponseSchema.parse(data);
    if (!chatResponse) {
      throw new Error('Invalid chat response');
    }
    return chatResponse;
  }

  async getUserSummary(options: MioSDKOptions): Promise<string | null> {
    const response = await this.authenticatedFetch(
      `${this.config.mioApiUrl}/v1/context/summary`,
      {
        method: 'GET'
      },
      options.accessToken
    );

    if (!response.ok) {
      throw new Error('Failed to get user summary');
    }

    const data = await response.json();
    if (!data || !data.summary) {
      throw new Error('Invalid summary response');
    }
    return data.summary;
  }
}
