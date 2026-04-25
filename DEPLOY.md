# Deploy URC

This repository is set up best as:

- frontend: Vercel (`project`)
- backend: Render web service (`urc-backend`)
- database: PostgreSQL

## 1. Backend on Render

Create a new `Web Service` from this repo and use:

- Root Directory: `urc-backend`
- Build Command: `npm install && npx prisma generate && npm run db:deploy`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set these environment variables from [urc-backend/.env.example](/d:/Users/Lenovo/Downloads/URC/urc-backend/.env.example):

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `RESET_TOKEN_EXPIRES_MINS`

After the first successful deploy, seed the admin user once:

```bash
npm run db:seed
```

Default seeded admin:

- email: `admin@urc.in`
- password: `admin123`

Change that password immediately after first login.

## 2. Frontend on Vercel

Import the same repo into Vercel and configure:

- Root Directory: `project`
- Build Command: `npm run build`
- Output Directory: `dist`

Set:

- `VITE_API_URL=https://your-backend-domain.onrender.com/api`

The frontend already includes [project/vercel.json](/d:/Users/Lenovo/Downloads/URC/project/vercel.json) for SPA routing.

## 3. Database

The Prisma schema is in [urc-backend/prisma/schema.prisma](/d:/Users/Lenovo/Downloads/URC/urc-backend/prisma/schema.prisma) and the initial migration is in [urc-backend/prisma/migrations/20260425_init/migration.sql](/d:/Users/Lenovo/Downloads/URC/urc-backend/prisma/migrations/20260425_init/migration.sql).

Use a PostgreSQL database and provide both:

- `DATABASE_URL`
- `DIRECT_URL`

If your provider gives you only one connection string, use the same value for both to start with.

## 4. Deploy Order

1. Create the PostgreSQL database.
2. Deploy the backend on Render.
3. Run the seed once.
4. Deploy the frontend on Vercel with the backend URL.
5. Update `FRONTEND_URL` in Render to the final Vercel domain if needed.

## 5. Smoke Test

Check these after deployment:

- backend root: `https://your-backend-domain.onrender.com/`
- backend health: `https://your-backend-domain.onrender.com/api/health`
- frontend app loads
- login works
- admin login works
- forgot password works after SMTP is configured
