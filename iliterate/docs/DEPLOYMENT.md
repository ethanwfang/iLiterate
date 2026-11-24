# Deploying your own copy

This guide puts a full copy of iLiterate on your own accounts:

| Service | What it runs | Cost for personal testing |
| --- | --- | --- |
| [Supabase](https://supabase.com) | Database, auth, file storage | Free plan |
| [Render](https://render.com) | Python NLP sidecar (`iliterate/python-api`) | Free plan |
| [Vercel](https://vercel.com) | The Next.js app | Free (Hobby) plan |

OpenAI and ElevenLabs bill by usage. Gemini has a free tier.

Do the steps in order: each one produces values the next one needs.

## 1. Supabase

1. Create a project at supabase.com.
2. In **SQL Editor**, run each file in `iliterate/supabase/migrations/` one at a time, in filename order, starting with `001_initial_schema.sql`.
   - Do not use `supabase db push`. Several files share a number prefix (`010_*`, `023_*`, `024_*`), and the CLI treats the prefix as a unique version.
3. Optional: run `iliterate/supabase/seed_sample_content.sql` for sample reading content.
4. From **Project Settings → API**, copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret)

## 2. AI API keys

| Key | Where | Used for |
| --- | --- | --- |
| `OPENAI_API_KEY` | platform.openai.com | Lesson passages and quizzes |
| `GOOGLE_AI_API_KEY` | aistudio.google.com | Translation and OCR |
| `ELEVENLABS_API_KEY` | elevenlabs.io | Reader and flashcard audio (optional; audio is off without it) |

## 3. Python sidecar on Render

The sidecar handles word difficulty, Japanese/Chinese/Korean word splitting, and EPUB/PDF upload processing (`/process-upload`).

1. Sign in to render.com with GitHub and create a **Web Service** from this repo.
2. Set **Root Directory** to `iliterate/python-api` and **Runtime** to Docker (the `Dockerfile` is already there).
3. Add the environment variable `PYTHON_API_SHARED_SECRET` with a long random value:

   ```bash
   openssl rand -hex 32
   ```

4. Deploy and copy the service URL. Check that `<service-url>/healthz` responds.

The free plan stops the service after about 15 minutes without traffic. The next request then takes 30–60 seconds while it starts again.

## 4. App on Vercel

1. Sign in to vercel.com with GitHub, choose **Add New → Project**, and import this repo.
2. Set **Root Directory** to `iliterate`. Vercel detects Next.js.
3. Add these environment variables:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (step 1) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon` key (step 1) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` key (step 1) |
   | `OPENAI_API_KEY` | Step 2 |
   | `GOOGLE_AI_API_KEY` | Step 2 |
   | `ELEVENLABS_API_KEY` | Step 2 (optional) |
   | `PYTHON_API_BASE_URL` | Render service URL (step 3) |
   | `PYTHON_API_SHARED_SECRET` | Same value as on Render (step 3) |

   The karaoke variables in `.env.example` are not needed while karaoke is hidden (`src/lib/features.ts`).

4. Deploy. Vercel gives the app a `<project>.vercel.app` URL.
5. Add `NEXT_PUBLIC_APP_URL` set to that URL, then **Redeploy**.

## 5. Point Supabase auth at the app

In Supabase, open **Authentication → URL Configuration**:

- **Site URL**: `https://<project>.vercel.app`
- **Redirect URLs**: add `https://<project>.vercel.app/**`

Without this, links in sign-up emails go to `localhost`.

## 6. Try it

Open the `.vercel.app` URL (it works on a phone), sign up, and finish onboarding.

Vercel redeploys on every push to `main`. Render does the same for the sidecar.
