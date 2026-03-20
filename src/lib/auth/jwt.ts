import { createRemoteJWKSet, jwtVerify, errors } from 'jose';
import type { TokenPayload } from './types';

const AUTH_JWKS_URL = 'https://auth.226.wtf/.well-known/jwks.json';

let jwksClient: ReturnType<typeof createRemoteJWKSet> | null = null;

export const createJWKS = (): ReturnType<typeof createRemoteJWKSet> => {
  if (!jwksClient) {
    jwksClient = createRemoteJWKSet(new URL(AUTH_JWKS_URL));
  }
  return jwksClient;
};

export const verifyToken = async (token: string): Promise<TokenPayload> => {
  const jwks = createJWKS();

  try {
    const { payload } = await jwtVerify(token, jwks, {
      algorithms: ['RS256'],
    });

    return payload as unknown as TokenPayload;
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      throw new AuthTokenError('Token has expired', 'TOKEN_EXPIRED');
    }
    if (error instanceof errors.JWTClaimValidationFailed) {
      throw new AuthTokenError('Token claims validation failed', 'INVALID_CLAIMS');
    }
    if (error instanceof errors.JWSSignatureVerificationFailed) {
      throw new AuthTokenError('Token signature verification failed', 'INVALID_SIGNATURE');
    }
    throw new AuthTokenError('Token verification failed', 'VERIFICATION_FAILED');
  }
};

export type AuthTokenErrorCode =
  | 'TOKEN_EXPIRED'
  | 'INVALID_CLAIMS'
  | 'INVALID_SIGNATURE'
  | 'VERIFICATION_FAILED';

export class AuthTokenError extends Error {
  public readonly code: AuthTokenErrorCode;

  constructor(message: string, code: AuthTokenErrorCode) {
    super(message);
    this.name = 'AuthTokenError';
    this.code = code;
  }
}
