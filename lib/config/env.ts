import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    // Database Configuration
    DATABASE_URL: z.url(),

    // Supabase Server Configuration
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Authentication Configuration
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),

    // Node Environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },

  /*
   * Environment variables available on the client (and server).
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    // Supabase Client Configuration
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // App Configuration
    NEXT_PUBLIC_APP_URL: z.url(),
  },

  /*
   * You can't destructure `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destructure manually.
   */
  runtimeEnv: {
    // Server variables
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NODE_ENV: process.env.NODE_ENV,

    // Client variables
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /*
   * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
