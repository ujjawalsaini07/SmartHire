# Smart Job Portal - Server

Backend API for Smart Job Portal, built with Node.js, Express, and MongoDB.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Setup Guide](#setup-guide)
7. [Environment Variables](#environment-variables)
8. [Run Commands](#run-commands)
9. [Authentication Model](#authentication-model)
10. [File Upload Rules](#file-upload-rules)
11. [API Overview](#api-overview)
12. [Operational Notes](#operational-notes)
13. [Troubleshooting](#troubleshooting)
14. [Related Documentation](#related-documentation)

## Overview

This service powers all server-side functionality for the job portal:

- user registration, login, refresh-token auth, and role-based authorization
- recruiter and job seeker profile management
- job posting, approval moderation, and analytics
- application lifecycle management
- saved jobs, notifications, categories, and skills
- admin settings and maintenance mode controls

Base API prefix: `http://localhost:5000/api/v1`

Health check endpoint: `GET /health`

## Features

- Role-based access control for `admin`, `recruiter`, `jobseeker`
- Access token + refresh token authentication flow
- Refresh token in secure `httpOnly` cookie
- Cloudinary-backed media/file uploads
- System-wide maintenance mode gate
- Automatic admin seeding on server startup
- Request logging using Winston (`combined.log`)
- Rate limiting, CORS, Helmet, and central error handling

## Tech Stack

- Node.js (ES Modules)
- Express 5
- MongoDB with Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `multer` for upload parsing
- Cloudinary SDK
- Winston logging

## Project Structure

```text
server/
|-- index.js
|-- package.json
|-- .env.example
`-- src/
    |-- app.js
    |-- config/
    |   |-- db.js
    |   |-- cloudinary.js
    |   `-- logger.js
    |-- controllers/
    |-- middlewares/
    |   |-- auth/
    |   |-- system/
    |   `-- upload/
    |-- models/
    |-- routes/
    `-- utils/
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)
- External email endpoint for transactional mails (`EMAIL_API_URL`)
- Cloudinary account (`CLOUDINARY_URL`) for upload features

## Setup Guide

1. Move into server directory.

```bash
cd server
```

2. Install dependencies.

```bash
npm install
```

3. Create environment file.

```bash
cp .env.example .env
```

4. Fill all required environment variables.

5. Run in development mode.

```bash
npm run dev
```

On startup, the server:

- validates required env variables
- connects to MongoDB with retry logic
- seeds default admin user if missing
- starts listening on `PORT` (default fallback is `10000`, but `.env.example` uses `5000`)

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartHire
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
EMAIL_API_URL=https://your-email-service-endpoint
NODE_ENV=development
ADMIN_NAME=Admin
ADMIN_PASSWORD=StrongPassword123!
ADMIN_EMAIL=admin@example.com
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Required at startup by `index.js` env check:

- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `ADMIN_NAME`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `EMAIL_API_URL`

`CLOUDINARY_URL` is also needed for media upload flows.

## Run Commands

- `npm run dev` - run with nodemon
- `npm start` - run with node
- `npm test` - placeholder script (not implemented)

## Authentication Model

- `POST /api/v1/auth/login` returns access token and sets refresh token cookie.
- Access token is expected as `Authorization: Bearer <token>`.
- `POST /api/v1/auth/refresh-token` rotates refresh token and issues a new access token.
- Protected routes use `protect` middleware.
- Role restrictions use `authorize(...roles)` middleware.

Token lifetimes from current implementation:

- access token: `15m`
- refresh token: `7d`

## File Upload Rules

Uploads are handled in-memory with `multer` and pushed to Cloudinary.

| Upload Type | Field Name | Allowed MIME Types | Max Size |
| --- | --- | --- | --- |
| Resume | `resume` | PDF, DOC, DOCX | 5 MB |
| Video Resume | `video` | MP4, AVI, MOV, WebM | 50 MB |
| Portfolio File | `portfolioFile` | image, PDF, MP4, WebM | 10 MB |
| Company/Profile Image | `image` | JPG, PNG, GIF, WEBP | 5 MB (company), 2 MB (profile picture) |

## API Overview

Base prefix: `/api/v1`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh-token`
- `POST /auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`
- `GET /auth/me`

### User/Admin Core

- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id/activate`
- `PATCH /users/:id/deactivate`
- `DELETE /users/:id`

### Recruiter + Admin Recruiter Verification

- `GET /recruiters/:id/profile` (public)
- `GET /recruiters/profile`
- `POST /recruiters/profile`
- `PUT /recruiters/profile`
- `POST /recruiters/profile/logo`
- `POST /recruiters/profile/banner`
- `GET /recruiters/verification-status`
- `GET /admin/recruiters`
- `GET /admin/recruiters/pending`
- `PATCH /admin/recruiters/:id/verify`
- `PATCH /admin/recruiters/:id/reject`

### Job Seeker

- `GET /jobseekers/profile`
- `POST /jobseekers/profile`
- `PUT /jobseekers/profile`
- `POST /jobseekers/profile/profile-picture`
- `DELETE /jobseekers/profile/profile-picture`
- `POST /jobseekers/profile/resume`
- `DELETE /jobseekers/profile/resume`
- `POST /jobseekers/profile/video-resume`
- `DELETE /jobseekers/profile/video-resume`
- `POST /jobseekers/profile/portfolio`
- `DELETE /jobseekers/profile/portfolio/:itemId`
- `GET /jobseekers/search` (recruiter)
- `GET /jobseekers/:id/profile` (recruiter)

### Jobs and Moderation

- `GET /jobs`
- `GET /jobs/search`
- `GET /jobs/recommended` (jobseeker)
- `GET /jobs/:id`
- `POST /jobs/:id/view`
- `GET /jobs/my-jobs`
- `POST /jobs`
- `PUT /jobs/:id`
- `DELETE /jobs/:id`
- `PATCH /jobs/:id/close`
- `PATCH /jobs/:id/reopen`
- `PATCH /jobs/:id/featured` (admin)
- `GET /admin/jobs`
- `GET /admin/jobs/pending`
- `GET /admin/jobs/statistics`
- `PATCH /admin/jobs/:id/approve`
- `PATCH /admin/jobs/:id/reject`
- `PATCH /admin/jobs/:id/feature`
- `PATCH /admin/jobs/bulk/approve`
- `DELETE /admin/jobs/:id`

### Applications, Saved Jobs, Notifications

- `POST /applications`
- `GET /applications/applied-jobs`
- `GET /applications/my-applications`
- `GET /applications/job/:jobId`
- `GET /applications/:id`
- `PATCH /applications/:id/withdraw`
- `PATCH /applications/:id/status`
- `POST /applications/:id/notes`
- `PATCH /applications/:id/rating`
- `POST /applications/:id/schedule-interview`
- `DELETE /applications/:id`
- `GET /saved-jobs`
- `POST /saved-jobs`
- `DELETE /saved-jobs/:jobId`
- `GET /notifications`
- `PUT /notifications/:id/read`
- `PUT /notifications/read-all`
- `DELETE /notifications/:id`
- `DELETE /notifications`

### Skills, Categories, Analytics, Emails, Settings

- `GET /skills`
- `GET /skills/search`
- `POST /skills` (admin)
- `PUT /skills/:id` (admin)
- `DELETE /skills/:id` (admin)
- `GET /categories`
- `POST /categories` (admin)
- `PUT /categories/:id` (admin)
- `DELETE /categories/:id` (admin)
- `GET /analytics/recruiter/dashboard`
- `GET /analytics/recruiter/job/:jobId`
- `GET /analytics/admin/dashboard`
- `GET /analytics/admin/users`
- `GET /analytics/admin/jobs`
- `POST /emails/contact-candidate` (recruiter)
- `POST /emails/admin/broadcast` (admin)
- `POST /emails/admin/contact-recruiter` (admin)
- `GET /admin/settings` (admin)
- `PATCH /admin/settings` (admin)

## Operational Notes

- `maintenanceMode` can block non-admin API usage via middleware.
- Request logs are written to `server/combined.log`.
- CORS allows origin from `FRONTEND_URL` and supports credentials.
- API limiter is mounted on `/api` and currently set to 1000 requests per 15 minutes per IP.

## Troubleshooting

- Startup fails with missing env vars:
  check `server/.env` for required keys listed above.
- Login works but requests fail with `401`:
  ensure frontend sends `Authorization` bearer token and credentials.
- Refresh token flow fails:
  confirm browser allows cookies and frontend/backend origins match CORS setup.
- Upload failures:
  verify file type/size and `CLOUDINARY_URL` validity.
- MongoDB connection retries then exits:
  verify `MONGO_URI` and database reachability.

## Related Documentation

- Root project setup: `../README.md`
- Frontend documentation: `../client/README.md`
