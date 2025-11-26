import z from 'zod/v4';
export declare const MioOauth2TokenResponseSchema: z.ZodPipe<z.ZodObject<{
    access_token: z.ZodString;
    id_token: z.ZodOptional<z.ZodString>;
    expires_in: z.ZodNumber;
    scope: z.ZodString;
    token_type: z.ZodString;
    refresh_token: z.ZodString;
}, z.core.$strip>, z.ZodTransform<{
    accessToken: string;
    idToken: string | undefined;
    expiresIn: number;
    scope: string;
    tokenType: string;
    refreshToken: string;
}, {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    refresh_token: string;
    id_token?: string | undefined;
}>>;
export type MioOauth2TokenResponse = z.infer<typeof MioOauth2TokenResponseSchema>;
export declare const MioChatResponseSchema: z.ZodPipe<z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>, z.ZodTransform<string, {
    content: string;
}>>;
export type MioChatResponse = z.infer<typeof MioChatResponseSchema>;
//# sourceMappingURL=validation.d.ts.map