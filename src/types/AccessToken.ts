export interface AccessToken {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: 'public universum';
}

export interface CachedAccessToken extends AccessToken {
  expires_at: number; // Unix timestamp when token expires
}
