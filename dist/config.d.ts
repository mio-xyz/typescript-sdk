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
export interface MioServerSDKConfig extends MioServerSDKInitConfig, MioBaseSDKConfig {
}
export declare const DEFAULT_MIO_API_URL = "https://api.mio.xyz";
export declare const DEFAULT_MIO_DASHBOARD_URL = "https://dashboard.mio.xyz";
//# sourceMappingURL=config.d.ts.map