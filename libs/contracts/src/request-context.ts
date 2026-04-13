export interface AuthenticatedRequestContext {
  userId: number;
  email: string;
}

export interface AuthenticatedRequestEnvelope<TData> {
  context: AuthenticatedRequestContext;
  data: TData;
}
