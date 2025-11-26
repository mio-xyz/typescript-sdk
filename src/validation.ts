import z, { number, object, string } from 'zod/v4';

export const MioOauth2TokenResponseSchema = object({
  access_token: string(),
  id_token: string().optional(),
  expires_in: number(),
  scope: string(),
  token_type: string(),
  refresh_token: string()
}).transform(payload => ({
  accessToken: payload.access_token,
  idToken: payload.id_token,
  expiresIn: payload.expires_in,
  scope: payload.scope,
  tokenType: payload.token_type,
  refreshToken: payload.refresh_token
}));

export type MioOauth2TokenResponse = z.infer<typeof MioOauth2TokenResponseSchema>;

export const MioChatResponseSchema = object({
  content: string()
}).transform(payload => payload.content);
export type MioChatResponse = z.infer<typeof MioChatResponseSchema>;
