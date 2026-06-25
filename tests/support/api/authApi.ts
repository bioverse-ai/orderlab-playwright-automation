import { requiredEnv } from '../env';

type PasswordGrantResponse = {
  access_token: string;
};

export class AuthApi {
  private readonly supabaseUrl = requiredEnv('SUPABASE_URL');
  private readonly supabaseAnonKey = requiredEnv('SUPABASE_ANON_KEY');

  async signInWithPassword(email: string, password: string): Promise<string> {
    const response = await fetch(
      `${this.supabaseUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          apikey: this.supabaseAnonKey,
          Authorization: `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(
        `Password grant failed with ${response.status}: ${responseBody}`,
      );
    }

    const body = JSON.parse(responseBody) as PasswordGrantResponse;

    if (!body.access_token) {
      throw new Error('Password grant response did not include access_token');
    }

    return body.access_token;
  }
}
