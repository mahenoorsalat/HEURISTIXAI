# HeuristixAI Waitlist & Early Access Platform

A production-ready, full-stack waitlist application built for HeuristixAI. It features dynamic queue positioning, a robust referral loop, active broadcast announcements, and a fully secured internal Admin Dashboard.

## Features & Architecture
- **Dynamic Referral Queue:** Users are assigned positions dynamically based on timestamp and total successful referrals.
- **Admin Dashboard (Protected by Supabase Auth):** Admins can manage users, adjust positions natively (manual bonus), and broadcast live announcements to the public position checker.
- **Micro-animations & Fluid UI:** Fully responsive light-mode interface built with Tailwind CSS, Lucide icons, and Framer Motion layout animations.
- **Secure Backend:** Implements strict Postgres Row Level Security (RLS) and custom Data Views to ensure the `service_role` credential is never exposed client-side.
- **1-Click CSV Export:** Natively parse waitlist metrics to structured CSV files securely within the admin panel.

## Tech Stack
- Frontend: React / Vite
- Styling: Tailwind CSS + Shadcn design patterns
- Animation: Framer Motion
- Backend: Supabase (PostgreSQL, Auth, RLS)
- Deployment: Vercel

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahenoorsalat/HEURISTIXAI.git
   cd HEURISTIXAI
   npm install
   ```

2. **Supabase Configuration:**
   - Create a new project in your Supabase dashboard.
   - Go to the **SQL Editor** and paste the entire contents of `/supabase/migrations/00000_init.sql` to generate the schemas, relationships, views, and RLS policies.
   - Go to Authentication > Users, and create your Admin user (e.g. `admin@heuristixai.com`).
   - Copy their `User UID`, go to the Table Editor, and insert their UID into the `admins` table.

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your absolute keys securely:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   *(Note: Never place the Service Role key in this file).*

4. **Run Locally:**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel:**
   Connect your GitHub repository to Vercel. Ensure you add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel Environment Variables before the initial build.

## Database Schema Highlights
- `waitlist`: Primary user table with an explicit self-referencing foreign key on `referral_code` to `referred_by`.
- `announcements`: Tracks admin broadcast messages with `active` boolean toggles.
- `admins`: Access list for privileged accounts; relies wholly on user mapping from `auth.users`.
- `waitlist_with_position (VIEW)`: Calculates live accurate rankings instantly relying on native Postgres Row_Number() partitioned windows.

## Live Demo
[Insert Complete Vercel Link Here]
