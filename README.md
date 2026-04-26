# Smart Job Portal

A full-stack job marketplace platform that connects job seekers, recruiters, and admins in one workflow-driven system.

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Quick Start](#quick-start)
6. [Environment Configuration](#environment-configuration)
7. [Run the Project](#run-the-project)
8. [Available Scripts](#available-scripts)
9. [First-Time Verification](#first-time-verification)
10. [Troubleshooting](#troubleshooting)
11. [Architecture and Module Details](#architecture-and-module-details)

## Overview

Smart Job Portal includes:

- Role-based authentication and authorization (`admin`, `recruiter`, `jobseeker`)
- Job posting, search, filtering, and recommendation-ready flows
- Application tracking and recruiter analytics
- Notification and email workflows
- Admin moderation and platform settings

This repository is split into:

- `client` - React + Vite frontend
- `server` - Node.js + Express + MongoDB backend API

## Repository Structure

```text
smart-job-portal/
|-- client/
|-- server/
|-- .gitignore
`-- README.md
```

## Tech Stack

### Frontend (`client`)

- React 19
- Vite
- React Router
- Axios
- Zustand
- Tailwind CSS

### Backend (`server`)

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT authentication
- Cookie-based refresh token flow
- Cloudinary integration for uploads

## Prerequisites

Install these before setup:

- Node.js 18+ (recommended LTS)
- npm 9+
- MongoDB (local instance or Atlas URI)

## Quick Start

1. Clone the repository and enter it.
2. Install dependencies for both apps.
3. Configure environment variables for `server` and `client`.
4. Start backend and frontend in separate terminals.

## Environment Configuration

### 1) Backend env (`server/.env`)

Copy the example file:

```bash
cp server/.env.example server/.env
```

Required values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartHire
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:5173
EMAIL_API_URL=https://your-email-service-endpoint
NODE_ENV=development
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123!
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Notes:

- `EMAIL_API_URL` is required at server startup by the environment validation logic.
- `ADMIN_*` values are used to seed the admin user automatically on startup.
- Keep `.env` private and never commit it.

### 2) Frontend env (`client/.env`)

Create `client/.env` (or copy from template if present):

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
VITE_APP_NAME=SmartHire
VITE_APP_VERSION=1.0.0
```

## Run the Project

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### 2) Start backend (Terminal 1)

```bash
cd server
npm run dev
```

Backend default URL:

- `http://localhost:5000`
- Health check: `http://localhost:5000/health`

### 3) Start frontend (Terminal 2)

```bash
cd client
npm run dev
```

Frontend default URL:

- `http://localhost:5173`

## Available Scripts

### `server`

- `npm run dev` - start backend with nodemon
- `npm start` - start backend in normal mode

### `client`

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## First-Time Verification

After both services are running:

1. Open `http://localhost:5173`.
2. Confirm backend health responds at `http://localhost:5000/health`.
3. Register a user from the UI.
4. Verify API calls are going to `VITE_BACKEND_URL`.

## Troubleshooting

- Server exits on startup with missing env vars:
  Ensure all required values in `server/.env` are filled, especially `EMAIL_API_URL`.
- CORS issues in browser:
  Ensure `FRONTEND_URL` in `server/.env` matches your frontend origin exactly (for local: `http://localhost:5173`).
- API 404 from frontend:
  Ensure `VITE_BACKEND_URL` includes `/api/v1`.
- Mongo connection failures:
  Verify `MONGO_URI` and database availability.

## Architecture and Module Details

For detailed project architecture, module breakdown, and deeper implementation details, refer to:

- [client/README.md](./client/README.md)
- [server/README.md](./server/README.md)
