import { AuthApi } from './api/authApi';
import { optionalEnv, requiredEnv } from './env';

export async function getCustomerAccessToken(): Promise<string> {
  const email = requiredEnv('CUSTOMER_EMAIL');
  const password = requiredEnv('CUSTOMER_PASSWORD');
  const authApi = new AuthApi();

  return authApi.signInWithPassword(email, password);
}

export async function getAdminAccessToken(): Promise<string> {
  const email = requiredEnv('ADMIN_EMAIL');
  const password = requiredEnv('ADMIN_PASSWORD');
  const authApi = new AuthApi();

  return authApi.signInWithPassword(email, password);
}

export function hasSecondCustomerCredentials(): boolean {
  return Boolean(
    optionalEnv('SECOND_CUSTOMER_EMAIL') &&
      optionalEnv('SECOND_CUSTOMER_PASSWORD'),
  );
}

export async function getSecondCustomerAccessToken(): Promise<string> {
  const email = requiredEnv('SECOND_CUSTOMER_EMAIL');
  const password = requiredEnv('SECOND_CUSTOMER_PASSWORD');
  const authApi = new AuthApi();

  return authApi.signInWithPassword(email, password);
}
