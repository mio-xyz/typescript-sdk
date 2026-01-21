import { MioChatResponseSchema } from './validation.js';
/**
 * Base SDK class with shared functionality for both client and server SDKs
 */
export class BaseMioSDK {
    config;
    constructor(config) {
        this.config = config;
    }
    // Authenticated fetch helper
    async authenticatedFetch(url, options = {}, accessToken) {
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
    async getContext(options) {
        const response = await this.authenticatedFetch(`${this.config.mioApiUrl}/v1/context`, {
            method: 'POST',
            body: JSON.stringify({
                query: options.query,
                k: 3
            })
        }, options.accessToken);
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
    async getContextSummary(options) {
        const response = await this.authenticatedFetch(`${this.config.mioApiUrl}/v1/context/summary`, {
            method: 'GET'
        }, options.accessToken);
        if (!response.ok) {
            throw new Error('Failed to get user summary');
        }
        const data = await response.json();
        return data?.summary ?? null;
    }
}
//# sourceMappingURL=base.js.map