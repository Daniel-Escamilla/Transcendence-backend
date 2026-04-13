export interface PublicUser {
  id: number;
  username: string;
  email: string;
  fortytwoId: string | null;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: PublicUser;
}

export interface VerifyTokenPayload {
  token: string;
}

export interface VerifyTokenResponse {
  user: {
    userId: number;
    email: string;
  };
}

export interface HealthResponse {
  status: 'ok';
  service: string;
}
