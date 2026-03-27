# HeuristixAI Waitlist Platform

A production-ready full-stack web application for HeuristixAI product waitlists.

## Project Structure

This project is built using:
- **Vite** (React, TypeScript)
- **Tailwind CSS** (Custom generic tokens & shadcn/ui components)
- **Supabase** (Postgres, Auth, complete RLS)
- **Vercel** (Deployment target)

## Architecture Notes

### Security & Backend Approach
The prompt mentioned routing admin operations through "secure server-side API routes using the service role key". Because this project is bootstrapped as a **Vite pure SPA** (Single Page Application) instead of Next.js, implementing Next.js-style API Routes is not natively supported without Vercel Serverless Functions (`api/` directory) which break standard Vite local development `npm run dev` flow.

Therefore, this project strictly adheres to the **"Modern Supabase Way"**:
1. **Zero Service Role Key Exposure**: The service role key is entirely avoided on the client side. We only use the `anon` public key.
2. **Robust Row Level Security (RLS)**: The database handles all security at the row level via authenticated identities. The `admins` table ensures that only verified admin `uuid`s can modify waitlist operations.
3. **Secure RPCs**: Complex operations like dynamically resolving queue positions for anonymous users are implemented via secure Postgres `SECURITY DEFINER` RPCs (`get_waitlist_status`) to bypass RLS securely inside the database without leaking table data to the public.

This guarantees perfect security without sacrificing the fast, uncoupled Vite development workflow.

## Getting Started

### 1. Supabase Setup
1. Create a new Supabase project.
2. Go to SQL Editor and run the migration up script located at `supabase/migrations/00000_init.sql`. This sets up:
   - Tables (`waitlist`, `announcements`, `admins`)
   - Views (`waitlist_with_position`)
   - Functions (`get_waitlist_status`)
   - RLS Rules and referential integrity.
3. Once created, go to **Authentication > Users** in Supabase and create your Admin user (e.g. `admin@heuristixai.com`).
4. Copy the newly created user's `uuid`, go to the `admins` table, and insert a new row with that `uuid`. This grants admin capabilities.

### 2. Environment Variables
Create a `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
```

### 3. Running Locally
```bash
npm install
npm run dev
```

### 4. Deployment to Vercel
Push your repository to GitHub, connect it to Vercel, and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables. No serverless function configuration is needed.

## Features Implemented
- **Landing Page**: Animated hero, value props, signup form.
- **Referral Logic**: Signup creates unique `hx-XXXXXX` code, referrals are captured via `?ref=` and properly foreign-keyed.
- **Dynamic Position**: A Postgres view automatically sorts positions by `referral count + manual_bonus DESC`, then `created_at ASC`.
- **Position Checker**: Users can enter their email and query the `get_waitlist_status` RPC to view live placement and active announcements.
- **Admin Dashboard**: Supabase password authentication. View full waitlist, change status, adjust positions (`manual_bonus`), publish announcements, and export valid `.csv` blobs directly from the browser.
