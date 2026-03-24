# Brevio Lumio

Brevio Lumio is an AI-powered productivity software suite that includes an Admin Dashboard, YouTube Summarizer, AI-powered Smart Notes, and an intelligent Job Search tracker.

## Features

- **Google Authentication:** Secure login using NextAuth and Supabase OAuth.
- **YouTube Summarizer:** Automatically extract and summarize YouTube videos using AI.
- **Admin Dashboard:** Role-based access control to view all users and monitor system analytics.
- **Smart Notes:** Full CRUD operations on personal notes, securely gated by Supabase Row-Level Security.
- **Dark/Light Mode:** Full theme support for a visually pleasing experience.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database / Auth:** Supabase
- **Styling:** Tailwind CSS + Lucide React Icons
- **AI Core:** Gemini 1.5 API (via Google / OpenRouter)

## Local Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone <repo-url>
   cd aio-tool-suite
    \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables:**
   Create a `.env.local` file at the root:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   \`\`\`

4. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:** Navigate to \`http://localhost:3000\`

## Security Rules

- **Strict Access:** Features inside `/dashboard`, `/admin`, and `/notes` are explicitly protected by `middleware.ts`. Unauthorized access will redirect visitors to `/`.
- **Role Verification:** The `/admin` route requires a user metadata flag \`is_admin: true\` in Supabase.
