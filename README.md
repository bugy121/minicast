# Minicast

Expo Router app with a Supabase-backed onboarding flow and authenticated app shell.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure Supabase env vars:

   ```bash
   cp .env.example .env
   ```

3. Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.

4. Start the app:

   ```bash
   npx expo start
   ```

## Auth/navigation architecture

- `app/(onboarding)` is the unauthenticated route group (currently `sign-in`, ready for more onboarding screens).
- `app/(app)` is the authenticated route group (currently tabs + home/explore, ready for more product screens).
- `providers/auth-provider.tsx` owns Supabase session state and auth actions.
- `app/_layout.tsx` gates navigation and redirects:
  - signed-in users go straight to `/(app)/(tabs)`
  - signed-out users go to `/(onboarding)/sign-in`
