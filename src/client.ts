import { BaseMioSDK } from './base.js';
import {
  DEFAULT_MIO_API_URL,
  DEFAULT_MIO_DASHBOARD_URL,
  type MioClientSDKConfig,
  type MioClientSDKInitConfig
} from './config.js';
import { type MioOauth2TokenResponse } from './validation.js';

/**
 * Frontend SDK for Mio authentication and API access
 * Handles OAuth flow, token exchange via backend, and authenticated requests
 */
export class MioClientSDK extends BaseMioSDK {
  private static instance: MioClientSDK;
  protected override config: MioClientSDKConfig;

  constructor(config: MioClientSDKInitConfig) {
    const finalConfig = {
      ...config,
      scope: 'openid profile email offline_access',
      mioApiUrl: process.env.MIO_API_URL || process.env.NEXT_PUBLIC_MIO_API_URL || DEFAULT_MIO_API_URL,
      mioDashboardUrl: process.env.MIO_DASHBOARD_URL || process.env.NEXT_PUBLIC_MIO_DASHBOARD_URL || DEFAULT_MIO_DASHBOARD_URL
    } as MioClientSDKConfig;
    super(finalConfig);
    this.config = finalConfig;
  }

  static init(config: MioClientSDKInitConfig): MioClientSDK {
    if (MioClientSDK.instance) {
      throw new Error('MioClientSDK already initialized');
    }
    MioClientSDK.instance = new MioClientSDK(config);
    return MioClientSDK.instance;
  }

  static getInstance(): MioClientSDK {
    if (!MioClientSDK.instance) {
      throw new Error('MioClientSDK not initialized. Call MioClientSDK.init() first.');
    }
    return MioClientSDK.instance;
  }

  // OAuth Flow Management (client-only)
  async connect(): Promise<void> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl,
      scope: this.config.scope ?? 'openid profile email offline_access'
    });
    window.location.href = `${this.config.mioDashboardUrl}/connect?${params.toString()}`;
  }

  // Extract code from URL (client-only)
  _extractCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      return code;
    }
    return null;
  }

  // Exchange code via backend tokenExchangeUrl (only takes code)
  async exchangeCode(code: string): Promise<MioOauth2TokenResponse> {
    if (!this.config.exchangeTokenUrl) {
      throw new Error('Token exchange URL not set');
    }
    const response = await fetch(this.config.exchangeTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error('Token exchange failed');
    }

    const data = await response.json();

    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Invalid token response: missing required tokens');
    }

    return data;
  }
}
