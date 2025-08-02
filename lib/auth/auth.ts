import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db/client';
import { users, sessions, accounts, verifications } from '@/lib/db/schema/auth';
import { env } from '@/config/env';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET!,
  baseURL: env.BETTER_AUTH_URL!,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [env.BETTER_AUTH_URL!],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
