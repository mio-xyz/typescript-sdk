// Configuration types for Mio SDK
// Base configuration (shared)

export interface MioBaseSDKInitConfig {
  clientId: string;
  redirectUrl: string;
}

export interface MioBaseSDKConfig extends MioBaseSDKInitConfig {
  scope: string;
  mioApiUrl: string;
}

export interface MioClientSDKInitConfig extends MioBaseSDKInitConfig {
  exchangeTokenUrl: string;
  mioDashboardUrl?: string;
}

export interface MioClientSDKConfig extends MioBaseSDKConfig, MioClientSDKInitConfig {
}

export interface MioServerSDKInitConfig extends MioBaseSDKInitConfig {
  clientSecret: string;
}

// Server SDK config (with client secret)
export interface MioServerSDKConfig extends MioServerSDKInitConfig, MioBaseSDKConfig {
}

export const DEFAULT_MIO_API_URL = 'https://api.mio.xyz';
export const DEFAULT_MIO_DASHBOARD_URL = 'https://app.mio.xyz';