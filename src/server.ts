import { BaseMioSDK } from './base.js';
import {
  DEFAULT_MIO_API_URL,
  type MioServerSDKConfig,
  type MioServerSDKInitConfig
} from './config.js';
import { MioOauth2TokenResponseSchema, type MioOauth2TokenResponse } from './validation.js';

/**
 * Backend SDK for Mio authentication and API access
 * Handles token exchange using client secret and authenticated requests
 */
export class MioServerSDK extends BaseMioSDK {
  private clientSecret: string;
  private static instance: MioServerSDK;
  protected override config: MioServerSDKConfig;

  constructor(config: MioServerSDKInitConfig) {
    const finalConfig = {
      ...config,
      scope: 'openid profile email offline_access',
      mioApiUrl: process.env.MIO_API_URL || DEFAULT_MIO_API_URL
    } as MioServerSDKConfig;
    super(finalConfig);
    this.config = finalConfig;
    this.clientSecret = config.clientSecret;
  }

  // Initialize the MioServerSDK or return the existing instance
  // This is mandatory as the server doesn't run like the client and the init can be called multiple times
  static init(config: MioServerSDKInitConfig): MioServerSDK {
    if (MioServerSDK.instance) {
      return MioServerSDK.instance;
    }
    MioServerSDK.instance = new MioServerSDK(config);
    return MioServerSDK.instance;
  }

  static getInstance(): MioServerSDK {
    if (!MioServerSDK.instance) {
      throw new Error('MioServerSDK not initialized. Call MioServerSDK.init() first.');
    }
    return MioServerSDK.instance;
  }

  // Exchange code for tokens using clientSecret (server-only)
  async exchangeCodeForTokens(code: string): Promise<MioOauth2TokenResponse> {
    try {
      const config = this.config as MioServerSDKConfig;
      const response = await fetch(`${config.mioApiUrl}/v1/auth/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUrl,
          client_id: this.config.clientId,
          client_secret: this.clientSecret
        })
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      const tokens = MioOauth2TokenResponseSchema.parse(data);
      return tokens;
    } catch (err) {
      throw new Error(
        `Token exchange failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Refresh an expired access and refresh tokens using a refresh token
   *
   * @param refreshToken - The refresh token
   * @returns New token response with fresh accessToken and refreshToken
   * @throws {Error} If token refresh fails
   *
   * @example
   * ```typescript
   * const newTokens = await refreshTokens(
   *   user.refreshToken,
   * );
   * // Store new tokens in database
   * ```
   */
  async refreshTokens(refreshToken: string): Promise<MioOauth2TokenResponse> {
    try {
      const config = this.config as MioServerSDKConfig;
      const response = await fetch(`${config.mioApiUrl}/v1/auth/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
          client_secret: this.clientSecret
        })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newTokens = MioOauth2TokenResponseSchema.parse(data);

      if (!newTokens.accessToken || !newTokens.refreshToken) {
        throw new Error('Invalid token response: missing required tokens');
      }

      return newTokens;
    } catch (error: unknown) {
      throw new Error(
        `Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
