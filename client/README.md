# Smart Job Portal - Client

Frontend application for Smart Job Portal, built with React and Vite.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Setup Guide](#setup-guide)
7. [Environment Variables](#environment-variables)
8. [Run Commands](#run-commands)
9. [Routing and Access Control](#routing-and-access-control)
10. [State Management](#state-management)
11. [API Layer](#api-layer)
12. [UI and Theming](#ui-and-theming)
13. [Build and Deployment](#build-and-deployment)
14. [Troubleshooting](#troubleshooting)
15. [Related Documentation](#related-documentation)

## Overview

This app is the user-facing web client for Smart Job Portal. It supports three role-specific experiences:

- `jobseeker`: discover jobs, build profile, apply, and manage applications
- `recruiter`: manage company profile, post jobs, review applicants, and track analytics
- `admin`: moderate jobs/recruiters, manage platform settings, and view platform analytics

## Features

- Public landing and job discovery pages
- Auth workflows (register, login, forgot/reset password, verify email)
- Role-based protected routing
- Dedicated dashboard layouts for job seeker, recruiter, and admin
- Axios interceptors with automatic token refresh and request queueing
- Zustand auth persistence with remember-me behavior
- Tailwind v4-based design system with light/dark mode support

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Axios
- Zustand
- React Hook Form + Zod resolver
- Tailwind CSS v4
- Framer Motion
- Recharts

## Project Structure

```text
client/
|-- public/
|-- src/
|   |-- api/
|   |-- components/
|   |-- pages/
|   |-- routes/
|   |-- store/
|   |-- services/
|   |-- utils/
|   |-- App.jsx
|   |-- main.jsx
|   `-- index.css
|-- package.json
|-- vite.config.js
|-- eslint.config.js
`-- .env.example
```

Key source folders:

- `src/pages`: route-level views by domain and role
- `src/components`: reusable UI and layout pieces
- `src/api`: typed API wrappers around Axios
- `src/store`: global state (`authStore`, `themeStore`)
- `src/routes`: route map and role guard (`ProtectedRoute`)

## Prerequisites

- Node.js 18+
- npm 9+
- Running backend API (see `../server/README.md`)

## Setup Guide

1. Move into client directory.

```bash
cd client
```

2. Install dependencies.

```bash
npm install
```

3. Create environment file.

```bash
cp .env.example .env
```

4. Configure `VITE_BACKEND_URL`.

5. Start development server.

```bash
npm run dev
```

Default local app URL: `http://localhost:5173`

## Environment Variables

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

Notes:

- `VITE_BACKEND_URL` should include `/api/v1`.
- Reset/verify flows currently read token from query params:
  - `/verify-email?token=...`
  - `/reset-password?token=...`

## Run Commands

- `npm run dev` - start local dev server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Routing and Access Control

Routes are defined in `src/routes/AppRoutes.jsx`.

### Public Routes

- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password/:token` and `/reset-password` (query token supported by page)
- `/verify-email/:token` and `/verify-email` (query token supported by page)
- `/about`
- `/contact`
- `/terms`
- `/privacy`
- `/jobs`
- `/jobs/:id`
- `/companies/:id`

### Protected Areas

Role-gated by `src/routes/ProtectedRoute.jsx`:

- `jobseeker`: `/jobseeker/*`
- `recruiter`: `/recruiter/*`
- `admin`: `/admin/*`

Unauthorized access redirects to `/unauthorized`.

## State Management

### `authStore` (`src/store/authStore.js`)

- persists auth state via custom storage wrapper
- supports remember-me behavior:
  - `rememberMe=true` -> localStorage
  - `rememberMe=false` -> sessionStorage
- stores user object, access token, applied job IDs
- includes `checkAuth()` bootstrap call at app load

### `themeStore` (`src/store/themeStore.js`)

- persists display mode (`light`/`dark`)
- applies body/document classes on toggle/init

## API Layer

Primary API modules live in `src/api/`:

- `axios.js`: shared Axios instance + interceptors
- `authApi.js`: login/register/password/email verification
- `publicApi.js`: public jobs/skills/categories/company profile
- `jobSeekerApi.js`: job seeker profile, applications, saved jobs
- `recruiterApi.js`: recruiter profile/jobs/applications/analytics/email
- `adminApi.js`: moderation, users, settings, analytics, broadcast email
- `notificationApi.js`: notification CRUD

### Axios/Auth Behavior

- Adds bearer token from `authStore` on each request.
- Sends `withCredentials: true` for refresh-token cookie support.
- On `401`, attempts refresh (`/auth/refresh-token`) once and replays queued requests.
- If refresh fails, clears auth state via `logout()`.

## UI and Theming

- Tailwind CSS v4 with custom design tokens in `src/index.css`.
- Font families include `Manrope` and `Plus Jakarta Sans`.
- Shared components in `src/components/common` (`Button`, `Input`, `Card`, `Modal`, etc.).
- Separate layout shells for role dashboards:
  - `AdminLayout`
  - `RecruiterLayout`
  - `JobSeekerLayout`

## Build and Deployment

Production build:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

`vercel.json` includes SPA rewrite to route all paths to `/`.

## Troubleshooting

- App loads but API calls fail:
  verify `VITE_BACKEND_URL` and backend availability.
- Login succeeds but protected pages bounce to login:
  ensure backend CORS `FRONTEND_URL` matches client origin and cookies are allowed.
- Frequent `401` loops:
  check refresh token cookie behavior and backend `/auth/refresh-token` response.
- Reset/verify links show missing token:
  ensure email links include `?token=...` query parameter.

## Related Documentation

- Root setup guide: `../README.md`
- Backend API and architecture: `../server/README.md`
