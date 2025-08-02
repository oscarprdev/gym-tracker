# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in the project details:
   - **Name**: `gym-tracker` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** > **API**
2. You'll find these important values:
   - **Project URL**: Copy this value
   - **anon public key**: Copy this value
   - **service_role secret key**: Copy this value (keep this secure!)

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Authentication Configuration
BETTER_AUTH_SECRET=your_32_character_random_string_here
BETTER_AUTH_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the placeholder values with your actual Supabase credentials.

## Step 4: Verify the Setup

Once you've configured the environment variables, the Supabase client will be ready to use.

## Next Steps

After setting up Supabase:

1. We'll configure Drizzle ORM to connect to your Supabase database
2. Set up database schemas and migrations
3. Configure authentication with BetterAuth
4. Test the connection

## Important Notes

- Keep your `service_role` key secure and never expose it in client-side code
- The `anon` key is safe to use in client-side code
- Make sure to add `.env.local` to your `.gitignore` file (it should already be there)
