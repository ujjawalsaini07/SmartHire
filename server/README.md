# SmartHire Job Portal - API Documentation

## Overview

SmartHire is a comprehensive job portal backend built with Node.js, Express, and MongoDB. It provides RESTful APIs for job seekers, recruiters, and administrators to manage job postings, applications, and user profiles.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:5000` by default.

## 📋 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Response Format

All API responses follow this format:

**Success Response:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

## 🔐 Authentication Routes

### Register User

- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Description:** Register a new user account

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker" // optional: admin, recruiter, jobseeker
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "jobseeker",
      "isVerified": false
    },
    "token": "jwt_access_token"
  }
}
```

### Login

- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Description:** Authenticate user and return tokens

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "jobseeker"
    },
    "accessToken": "jwt_access_token"
  }
}
```

### Logout

- **Endpoint:** `POST /auth/logout`
- **Access:** Private
- **Description:** Logout user and clear refresh token cookie
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Not authorized"
}
```

### Refresh Token

- **Endpoint:** `POST /auth/refresh-token`
- **Access:** Public (requires refresh token cookie)
- **Description:** Refresh access token using refresh token

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Refresh token not found"
}
```

```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

### Verify Email

- **Endpoint:** `POST /auth/verify-email`
- **Access:** Public
- **Description:** Verify user email address

**Request Body:**

```json
{
  "token": "verification_token"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

```json
{
  "success": false,
  "message": "Verification token is required"
}
```

### Forgot Password

- **Endpoint:** `POST /auth/forgot-password`
- **Access:** Public
- **Description:** Send password reset email

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Email is required"
}
```

```json
{
  "success": false,
  "message": "User not found"
}
```

### Reset Password

- **Endpoint:** `POST /auth/reset-password`
- **Access:** Public
- **Description:** Reset password using reset token

**Request Body:**

```json
{
  "token": "reset_token",
  "password": "new_password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Token and new password are required"
}
```

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Get Current User

- **Endpoint:** `GET /auth/me`
- **Access:** Private
- **Description:** Get current authenticated user information
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker",
    "isVerified": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 👥 User Management Routes

### Get All Users

- **Endpoint:** `GET /users`
- **Access:** Admin only
- **Description:** Get all users with pagination and filtering
- **Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `role` (string, optional filter)
- `isActive` (boolean, optional filter)
- `search` (string, optional search by name/email)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "jobseeker",
        "isActive": true,
        "isVerified": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "lastLogin": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Admin access required"
}
```

### Get User by ID

- **Endpoint:** `GET /users/:id`
- **Access:** Admin or Recruiter
- **Description:** Get specific user by ID
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker",
    "isActive": true,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "User not found"
}
```

### Activate User

- **Endpoint:** `PATCH /users/:id/activate`
- **Access:** Admin only
- **Description:** Activate a user account
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "id": "user_id",
    "isActive": true
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "User not found"
}
```

### Deactivate User

- **Endpoint:** `PATCH /users/:id/deactivate`
- **Access:** Admin only
- **Description:** Deactivate a user account
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "id": "user_id",
    "isActive": false
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "User not found"
}
```

### Delete User

- **Endpoint:** `DELETE /users/:id`
- **Access:** Admin only
- **Description:** Delete a user account permanently
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## 💼 Job Routes

### Public Routes

#### Get All Jobs

- **Endpoint:** `GET /jobs`
- **Access:** Public
- **Description:** Get all active jobs with pagination and filters

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `category` (string, optional)
- `location` (string, optional)
- `experienceLevel` (string, optional)
- `employmentType` (string, optional)
- `salaryMin` (number, optional)
- `salaryMax` (number, optional)
- `isRemote` (boolean, optional)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_id",
        "title": "Senior Frontend Developer",
        "description": "Job description...",
        "company": {
          "id": "company_id",
          "name": "Tech Company",
          "logo": "logo_url"
        },
        "location": {
          "city": "New York",
          "state": "NY",
          "country": "USA",
          "isRemote": true
        },
        "salary": {
          "min": 80000,
          "max": 120000,
          "currency": "USD",
          "isVisible": true
        },
        "experienceLevel": "senior",
        "employmentType": "full-time",
        "requiredSkills": [
          {
            "id": "skill_id",
            "name": "JavaScript",
            "category": "Programming"
          }
        ],
        "status": "active",
        "isFeatured": false,
        "views": 150,
        "applicationCount": 25,
        "postedAt": "2024-01-01T00:00:00.000Z",
        "applicationDeadline": "2024-12-31T23:59:59Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

#### Search Jobs

- **Endpoint:** `GET /jobs/search`
- **Access:** Public
- **Description:** Search jobs with advanced filters

**Query Parameters:**

- `q` (string, required) - Search term
- All parameters from Get All Jobs

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_id",
        "title": "Senior Frontend Developer",
        "description": "Job description...",
        "relevanceScore": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Search query is required"
}
```

#### Get Job by ID

- **Endpoint:** `GET /jobs/:id`
- **Access:** Public
- **Description:** Get job details by ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "job_id",
    "title": "Senior Frontend Developer",
    "description": "Detailed job description...",
    "company": {
      "id": "company_id",
      "name": "Tech Company",
      "logo": "logo_url",
      "website": "https://techcompany.com"
    },
    "location": {
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "isRemote": true,
      "remoteType": "fully-remote"
    },
    "salary": {
      "min": 80000,
      "max": 120000,
      "currency": "USD",
      "isVisible": true
    },
    "experienceLevel": "senior",
    "employmentType": "full-time",
    "requiredSkills": [
      {
        "id": "skill_id",
        "name": "JavaScript",
        "category": "Programming"
      }
    ],
    "qualifications": ["Bachelor's degree", "5+ years experience"],
    "benefits": ["Health insurance", "401k", "Remote work"],
    "status": "active",
    "isFeatured": false,
    "views": 150,
    "applicationCount": 25,
    "postedAt": "2024-01-01T00:00:00.000Z",
    "applicationDeadline": "2024-12-31T23:59:59Z",
    "screeningQuestions": [
      {
        "question": "What is your experience with React?",
        "isRequired": true
      }
    ]
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Job not found"
}
```

#### Track Job View

- **Endpoint:** `POST /jobs/:id/view`
- **Access:** Public
- **Description:** Track job view (can be authenticated or anonymous)

**Request Body (Optional):**

```json
{
  "userId": "user_id"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Job view tracked",
  "data": {
    "jobId": "job_id",
    "views": 151
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Job not found"
}
```

### Job Seeker Routes

#### Get Recommended Jobs

- **Endpoint:** `GET /jobs/recommended`
- **Access:** Job Seeker only
- **Description:** Get recommended jobs based on job seeker profile
- **Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_id",
        "title": "Senior Frontend Developer",
        "matchScore": 0.85,
        "matchReasons": ["Skills match", "Experience level match"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Job seeker access required"
}
```

### Recruiter Routes

#### Get My Jobs

- **Endpoint:** `GET /jobs/my-jobs`
- **Access:** Recruiter only
- **Description:** Get all jobs posted by the recruiter
- **Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional filter)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_id",
        "title": "Senior Frontend Developer",
        "status": "active",
        "views": 150,
        "applicationCount": 25,
        "postedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Recruiter access required"
}
```

#### Create Job

- **Endpoint:** `POST /jobs`
- **Access:** Recruiter (Verified)
- **Description:** Create a new job posting
- **Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

### Delete User

- **Endpoint:** `DELETE /users/:id`
- **Access:** Admin only
- **Description:** Delete a user account permanently

---

## 💼 Job Routes

### Public Routes

#### Get All Jobs

- **Endpoint:** `GET /jobs`
- **Access:** Public
- **Description:** Get all active jobs with pagination and filters

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `category` (string, optional)
- `location` (string, optional)
- `experienceLevel` (string, optional)
- `employmentType` (string, optional)
- `salaryMin` (number, optional)
- `salaryMax` (number, optional)
- `isRemote` (boolean, optional)

#### Search Jobs

- **Endpoint:** `GET /jobs/search`
- **Access:** Public
- **Description:** Search jobs with advanced filters

**Query Parameters:**

- `q` (string, required) - Search term
- All parameters from Get All Jobs

#### Get Job by ID

- **Endpoint:** `GET /jobs/:id`
- **Access:** Public
- **Description:** Get job details by ID

#### Track Job View

- **Endpoint:** `POST /jobs/:id/view`
- **Access:** Public
- **Description:** Track job view (can be authenticated or anonymous)

### Job Seeker Routes

#### Get Recommended Jobs

- **Endpoint:** `GET /jobs/recommended`
- **Access:** Job Seeker only
- **Description:** Get recommended jobs based on job seeker profile

### Recruiter Routes

#### Get My Jobs

- **Endpoint:** `GET /jobs/my-jobs`
- **Access:** Recruiter only
- **Description:** Get all jobs posted by the recruiter

#### Create Job

- **Endpoint:** `POST /jobs`
- **Access:** Recruiter (Verified)
- **Description:** Create a new job posting

**Request Body:**

```json
{
  "title": "Senior Frontend Developer",
  "description": "Job description...",
  "requiredSkills": ["skill_id_1", "skill_id_2"],
  "qualifications": ["Bachelor's degree", "5+ years experience"],
  "experienceLevel": "senior",
  "experienceYears": {
    "min": 5,
    "max": 10
  },
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD",
    "isVisible": true
  },
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "isRemote": true,
    "remoteType": "fully-remote"
  },
  "employmentType": "full-time",
  "numberOfOpenings": 1,
  "applicationDeadline": "2024-12-31T23:59:59Z",
  "screeningQuestions": [
    {
      "question": "What is your experience with React?",
      "isRequired": true
    }
  ],
  "category": "category_id"
}
```

#### Update Job

- **Endpoint:** `PUT /jobs/:id`
- **Access:** Recruiter (Owner)
- **Description:** Update job posting

#### Delete Job

- **Endpoint:** `DELETE /jobs/:id`
- **Access:** Recruiter (Owner)
- **Description:** Delete job posting

#### Close Job

- **Endpoint:** `PATCH /jobs/:id/close`
- **Access:** Recruiter (Owner)
- **Description:** Close or mark job as filled

---

## 📄 Application Routes

### Job Seeker Routes

#### Apply to Job

- **Endpoint:** `POST /applications`
- **Access:** Job Seeker only
- **Description:** Apply to a job

**Request Body:**

```json
{
  "jobId": "job_id",
  "coverLetter": "Your cover letter...",
  "screeningAnswers": [
    {
      "question": "What is your experience with React?",
      "answer": "I have 5 years of experience..."
    }
  ]
}
```

#### Get My Applications

- **Endpoint:** `GET /applications/my-applications`
- **Access:** Job Seeker only
- **Description:** Get current user's job applications

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional filter)

#### Withdraw Application

- **Endpoint:** `PATCH /applications/:id/withdraw`
- **Access:** Job Seeker (Owner)
- **Description:** Withdraw a job application

### Recruiter Routes

#### Get Applications for Job

- **Endpoint:** `GET /applications/job/:jobId`
- **Access:** Recruiter (Job Owner)
- **Description:** Get all applications for a specific job

#### Update Application Status

- **Endpoint:** `PATCH /applications/:id/status`
- **Access:** Recruiter only
- **Description:** Update application status

**Request Body:**

```json
{
  "status": "shortlisted", // reviewed, shortlisted, interviewing, rejected, offered
  "notes": "Candidate looks promising"
}
```

#### Add Recruiter Note

- **Endpoint:** `POST /applications/:id/notes`
- **Access:** Recruiter only
- **Description:** Add private notes to an application

**Request Body:**

```json
{
  "note": "Strong technical skills, good cultural fit"
}
```

#### Rate Candidate

- **Endpoint:** `PATCH /applications/:id/rating`
- **Access:** Recruiter only
- **Description:** Rate a candidate (1-5 stars)

**Request Body:**

```json
{
  "rating": 4
}
```

#### Schedule Interview

- **Endpoint:** `POST /applications/:id/schedule-interview`
- **Access:** Recruiter only
- **Description:** Schedule an interview for a candidate

**Request Body:**

```json
{
  "scheduledAt": "2024-01-15T14:00:00Z",
  "meetingLink": "https://zoom.us/j/123456789",
  "notes": "Technical interview round"
}
```

### Shared Routes

#### Get Application by ID

- **Endpoint:** `GET /applications/:id`
- **Access:** Recruiter or Job Seeker (Own application)
- **Description:** Get specific application details

---

## 🔖 Saved Jobs Routes

### Get Saved Jobs

- **Endpoint:** `GET /saved-jobs`
- **Access:** Job Seeker only
- **Description:** Get all saved jobs for the current user

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string, optional: datePosted, salary, title)
- `sortOrder` (string, optional: asc, desc)

### Save Job

- **Endpoint:** `POST /saved-jobs`
- **Access:** Job Seeker only
- **Description:** Save a job to user's saved jobs list

**Request Body:**

```json
{
  "jobId": "job_id"
}
```

### Unsave Job

- **Endpoint:** `DELETE /saved-jobs/:jobId`
- **Access:** Job Seeker only
- **Description:** Remove a job from user's saved jobs list

---

## 🛠️ Skills Routes

### Public Routes

#### Get All Skills

- **Endpoint:** `GET /skills`
- **Access:** Public
- **Description:** Get all available skills with pagination

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional)
- `category` (string, optional)

#### Search Skills

- **Endpoint:** `GET /skills/search`
- **Access:** Public
- **Description:** Search skills by name or partial match

**Query Parameters:**

- `q` (string, required) - Search term
- `limit` (number, default: 10, max: 50)

### Admin Routes

#### Create Skill

- **Endpoint:** `POST /skills`
- **Access:** Admin only
- **Description:** Create a new skill

**Request Body:**

```json
{
  "name": "JavaScript",
  "category": "Programming",
  "description": "Programming language for web development"
}
```

#### Update Skill

- **Endpoint:** `PUT /skills/:id`
- **Access:** Admin only
- **Description:** Update an existing skill

#### Delete Skill

- **Endpoint:** `DELETE /skills/:id`
- **Access:** Admin only
- **Description:** Delete a skill

---

## 📂 Job Categories Routes

### Public Routes

#### Get All Categories

- **Endpoint:** `GET /categories`
- **Access:** Public
- **Description:** Get all job categories with hierarchical structure

**Query Parameters:**

- `view` (string, optional: tree, flat, default: flat)
- `parentId` (string, optional)
- `q` (string, optional search)
- `page` (number, default: 1)
- `limit` (number, default: 50)

### Admin Routes

#### Create Category

- **Endpoint:** `POST /categories`
- **Access:** Admin only
- **Description:** Create a new job category

**Request Body:**

```json
{
  "name": "Software Development",
  "description": "Jobs related to software development",
  "parentId": null, // for subcategories
  "icon": "code-icon"
}
```

#### Update Category

- **Endpoint:** `PUT /categories/:id`
- **Access:** Admin only
- **Description:** Update an existing job category

#### Delete Category

- **Endpoint:** `DELETE /categories/:id`
- **Access:** Admin only
- **Description:** Delete a job category

---

## 📊 Analytics Routes

### Recruiter Routes

#### Get Recruiter Dashboard

- **Endpoint:** `GET /analytics/recruiter/dashboard`
- **Access:** Recruiter only
- **Description:** Get recruiter overview analytics and dashboard metrics

**Query Parameters:**

- `period` (string, optional: 7d, 30d, 90d, 1y, default: 30d)

#### Get Job Performance Metrics

- **Endpoint:** `GET /analytics/recruiter/job/:jobId`
- **Access:** Recruiter (Job Owner)
- **Description:** Get specific job performance metrics and analytics

**Query Parameters:**

- `period` (string, optional: 7d, 30d, 90d, default: 30d)

### Admin Routes

#### Get Admin Dashboard

- **Endpoint:** `GET /analytics/admin/dashboard`
- **Access:** Admin only
- **Description:** Get platform-wide dashboard analytics for administrators

**Query Parameters:**

- `period` (string, optional: 7d, 30d, 90d, 1y, default: 30d)

#### Get User Analytics

- **Endpoint:** `GET /analytics/admin/users`
- **Access:** Admin only
- **Description:** Get user growth statistics and demographics analytics

**Query Parameters:**

- `period` (string, optional: 7d, 30d, 90d, 1y, default: 30d)
- `groupBy` (string, optional: day, week, month, default: day)

#### Get Job Analytics

- **Endpoint:** `GET /analytics/admin/jobs`
- **Access:** Admin only
- **Description:** Get job statistics and marketplace health analytics

**Query Parameters:**

- `period` (string, optional: 7d, 30d, 90d, 1y, default: 30d)
- `status` (string, optional filter by job status)

---

## 📧 Email Routes

### Recruiter Routes

#### Contact Candidate

- **Endpoint:** `POST /emails/contact-candidate`
- **Access:** Recruiter only
- **Description:** Send email directly to a job candidate

**Request Body:**

```json
{
  "candidateId": "user_id",
  "subject": "Interview Invitation",
  "message": "We would like to invite you for an interview...",
  "applicationId": "application_id", // optional
  "ccEmails": ["manager@company.com"] // optional
}
```

### Admin Routes

#### Send Broadcast Email

- **Endpoint:** `POST /emails/admin/broadcast`
- **Access:** Admin only
- **Description:** Send broadcast email to multiple users

**Request Body:**

```json
{
  "subject": "Platform Update",
  "message": "We are excited to announce new features...",
  "targetAudience": "all", // all, recruiters, jobseekers, active, inactive
  "filters": {
    "role": ["jobseeker"],
    "location": ["USA", "Canada"],
    "registrationDate": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    }
  },
  "scheduleAt": "2024-01-15T10:00:00Z", // optional
  "testMode": false // optional
}
```

---

## 👤 Job Seeker Profile Routes

### Profile Management

#### Get My Profile

- **Endpoint:** `GET /jobseekers/profile`
- **Access:** Job Seeker only
- **Description:** Get current job seeker's profile

#### Create Profile

- **Endpoint:** `POST /jobseekers/profile`
- **Access:** Job Seeker only
- **Description:** Create job seeker profile

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": {
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "headline": "Senior Frontend Developer",
  "summary": "Experienced frontend developer with 5+ years...",
  "workExperience": [
    {
      "company": "Tech Company",
      "title": "Senior Frontend Developer",
      "startDate": "2020-01-01",
      "endDate": null,
      "isCurrentRole": true,
      "description": "Developed responsive web applications..."
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2016-01-01",
      "endDate": "2020-01-01"
    }
  ],
  "skills": ["skill_id_1", "skill_id_2"],
  "preferences": {
    "jobType": ["full-time"],
    "desiredSalaryMin": 80000,
    "desiredSalaryMax": 120000,
    "willingToRelocate": true,
    "remoteWorkPreference": "remote"
  }
}
```

#### Update Profile

- **Endpoint:** `PUT /jobseekers/profile`
- **Access:** Job Seeker only
- **Description:** Update job seeker profile

### Resume Management

#### Upload Resume

- **Endpoint:** `POST /jobseekers/profile/resume`
- **Access:** Job Seeker only
- **Description:** Upload resume file
- **Content-Type:** `multipart/form-data`
- **Body:** `resume` (file)

#### Delete Resume

- **Endpoint:** `DELETE /jobseekers/profile/resume`
- **Access:** Job Seeker only
- **Description:** Delete resume file

### Video Resume Management

#### Upload Video Resume

- **Endpoint:** `POST /jobseekers/profile/video-resume`
- **Access:** Job Seeker only
- **Description:** Upload video resume file
- **Content-Type:** `multipart/form-data`
- **Body:** `video` (file)

#### Delete Video Resume

- **Endpoint:** `DELETE /jobseekers/profile/video-resume`
- **Access:** Job Seeker only
- **Description:** Delete video resume file

### Portfolio Management

#### Add Portfolio Item

- **Endpoint:** `POST /jobseekers/profile/portfolio`
- **Access:** Job Seeker only
- **Description:** Add portfolio item
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `portfolioFile` (file, optional)
  - `title` (string, required)
  - `description` (string, optional)
  - `projectUrl` (string, optional)

#### Delete Portfolio Item

- **Endpoint:** `DELETE /jobseekers/profile/portfolio/:itemId`
- **Access:** Job Seeker only
- **Description:** Delete portfolio item
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "message": "Portfolio item deleted successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Portfolio item not found"
}
```

### Recruiter Routes

#### Search Job Seekers

- **Endpoint:** `GET /jobseekers/search`
- **Access:** Recruiter only
- **Description:** Search job seekers by skills, location, etc.
- **Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**

- `q` (string, optional search)
- `skills` (string, optional, comma-separated skill IDs)
- `location` (string, optional)
- `experienceLevel` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "jobSeekers": [
      {
        "id": "user_id",
        "name": "John Doe",
        "headline": "Senior Frontend Developer",
        "location": "New York, NY",
        "experience": "5+ years",
        "skills": [
          {
            "id": "skill_id",
            "name": "JavaScript",
            "category": "Programming"
          }
        ],
        "profileCompleteness": 85,
        "lastActive": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### Get Job Seeker Profile

- **Endpoint:** `GET /jobseekers/:id/profile`
- **Access:** Recruiter only
- **Description:** Get job seeker profile by ID
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "profile_id",
    "userId": "user_id",
    "name": "John Doe",
    "headline": "Senior Frontend Developer",
    "location": {
      "city": "New York",
      "state": "NY",
      "country": "USA"
    },
    "summary": "Experienced frontend developer with 5+ years...",
    "skills": [
      {
        "id": "skill_id",
        "name": "JavaScript",
        "category": "Programming"
      }
    ],
    "workExperience": [
      {
        "company": "Tech Company",
        "title": "Senior Frontend Developer",
        "startDate": "2020-01-01",
        "endDate": null,
        "isCurrentRole": true,
        "description": "Developed responsive web applications..."
      }
    ],
    "education": [
      {
        "institution": "University Name",
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "startDate": "2016-01-01",
        "endDate": "2020-01-01"
      }
    ],
    "resumeUrl": "resume_url",
    "profileCompleteness": 85
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Job seeker profile not found"
}
```

---

## 🏢 Recruiter Profile Routes

### Public Routes

#### Get Public Company Profile

- **Endpoint:** `GET /recruiters/:id/profile`
- **Access:** Public
- **Description:** Get public company profile

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "profile_id",
    "companyName": "Tech Company Inc.",
    "industry": "Technology",
    "companySize": "51-200",
    "companyDescription": "Leading technology company...",
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    },
    "website": "https://techcompany.com",
    "companyLogo": "logo_url",
    "companyBanner": "banner_url",
    "isVerified": true,
    "verificationStatus": "approved",
    "profileCompleteness": 90
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Company profile not found"
}
```

### Private Routes

#### Get My Company Profile

- **Endpoint:** `GET /recruiters/profile`
- **Access:** Recruiter only
- **Description:** Get current recruiter's company profile
- **Headers:** `Authorization: Bearer <access_token>`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "profile_id",
    "userId": "user_id",
    "companyName": "Tech Company Inc.",
    "industry": "Technology",
    "companySize": "51-200",
    "companyDescription": "Leading technology company...",
    "companyCulture": "Innovative and collaborative environment...",
    "location": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "address": "123 Tech Street"
    },
    "contactPerson": {
      "firstName": "Jane",
      "lastName": "Smith",
      "designation": "HR Manager",
      "email": "hr@techcompany.com",
      "phone": "+1234567890"
    },
    "website": "https://techcompany.com",
    "socialLinks": {
      "linkedin": "https://linkedin.com/company/techcompany",
      "twitter": "https://twitter.com/techcompany"
    },
    "companyLogo": "logo_url",
    "companyBanner": "banner_url",
    "isVerified": true,
    "verificationStatus": "approved",
    "verificationNotes": null,
    "profileCompleteness": 90,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Company profile not found"
}
```

#### Create Company Profile

- **Endpoint:** `POST /recruiters/profile`
- **Access:** Recruiter only
- **Description:** Create company profile
- **Headers:** `Authorization: Bearer <access_token>`

**Request Body:**

```json
{
  "companyName": "Tech Company Inc.",
  "industry": "Technology",
  "companySize": "51-200",
  "companyDescription": "Leading technology company...",
  "companyCulture": "Innovative and collaborative environment...",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "address": "123 Tech Street"
  },
  "contactPerson": {
    "firstName": "Jane",
    "lastName": "Smith",
    "designation": "HR Manager",
    "email": "hr@techcompany.com",
    "phone": "+1234567890"
  },
  "website": "https://techcompany.com",
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/techcompany",
    "twitter": "https://twitter.com/techcompany"
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Company profile created successfully",
  "data": {
    "id": "profile_id",
    "userId": "user_id",
    "companyName": "Tech Company Inc.",
    "isVerified": false,
    "verificationStatus": "pending",
    "profileCompleteness": 85,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Company profile already exists"
}
```

```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

#### Update Company Profile

- **Endpoint:** `PUT /recruiters/profile`
- **Access:** Recruiter only
- **Description:** Update company profile
- **Headers:** `Authorization: Bearer <access_token>`

**Request Body:** Same as Create Company Profile (all fields optional)

**Response (200):**

```json
{
  "success": true,
  "message": "Company profile updated successfully",
  "data": {
    "id": "profile_id",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Company profile not found"
}
```

### Media Upload Routes

#### Upload Company Logo

- **Endpoint:** `POST /recruiters/profile/logo`
- **Access:** Recruiter only
- **Description:** Upload company logo
- **Headers:** `Authorization: Bearer <access_token>`
- **Content-Type:** `multipart/form-data`
- **Body:** `image` (file)

**Response (200):**

```json
{
  "success": true,
  "message": "Company logo uploaded successfully",
  "data": {
    "companyLogo": "uploads/logos/user_id_logo.jpg",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Please upload an image file"
}
```

#### Upload Company Banner

- **Endpoint:** `POST /recruiters/profile/banner`
- **Access:** Recruiter only
- **Description:** Upload company banner
- **Content-Type:** `multipart/form-data`
- **Body:** `image` (file)

#### Get Verification Status

- **Endpoint:** `GET /recruiters/verification-status`
- **Access:** Recruiter only
- **Description:** Get company verification status

---

## 🛡️ Admin Job Management Routes

All admin job routes require admin authentication.

### Get Pending Job Approvals

- **Endpoint:** `GET /admin/jobs/pending`
- **Access:** Admin only
- **Description:** Get all pending job approvals with pagination

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

### Get Job Statistics

- **Endpoint:** `GET /admin/jobs/statistics`
- **Access:** Admin only
- **Description:** Get job statistics for admin dashboard

### Get All Jobs (Admin)

- **Endpoint:** `GET /admin/jobs`
- **Access:** Admin only
- **Description:** Get all jobs with filters (for admin dashboard)

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, optional filter)
- `recruiterId` (string, optional filter)

### Approve Job

- **Endpoint:** `PATCH /admin/jobs/:id/approve`
- **Access:** Admin only
- **Description:** Approve a job posting

### Reject Job

- **Endpoint:** `PATCH /admin/jobs/:id/reject`
- **Access:** Admin only
- **Description:** Reject a job posting with notes

**Request Body:**

```json
{
  "notes": "Job posting needs more details about responsibilities"
}
```

### Feature Job

- **Endpoint:** `PATCH /admin/jobs/:id/feature`
- **Access:** Admin only
- **Description:** Toggle or set featured status of a job

**Request Body:**

```json
{
  "isFeatured": true
}
```

### Delete Job (Admin)

- **Endpoint:** `DELETE /admin/jobs/:id`
- **Access:** Admin only
- **Description:** Delete or close a job posting

**Query Parameters:**

- `permanent` (boolean, optional) - Set to 'true' for permanent deletion

### Bulk Approve Jobs

- **Endpoint:** `PATCH /admin/jobs/bulk/approve`
- **Access:** Admin only
- **Description:** Bulk approve multiple jobs

**Request Body:**

```json
{
  "jobIds": ["job_id_1", "job_id_2", "job_id_3"]
}
```

---

## 🏅 Admin Recruiter Management Routes

All admin recruiter routes require admin authentication.

### Get Pending Verifications

- **Endpoint:** `GET /admin/recruiters/pending`
- **Access:** Admin only
- **Description:** Get all pending recruiter verifications

### Verify Recruiter

- **Endpoint:** `PATCH /admin/recruiters/:id/verify`
- **Access:** Admin only
- **Description:** Approve/verify a recruiter

### Reject Recruiter

- **Endpoint:** `PATCH /admin/recruiters/:id/reject`
- **Access:** Admin only
- **Description:** Reject a recruiter verification with notes

**Request Body:**

```json
{
  "notes": "Company information could not be verified"
}
```

---

## 🔧 Error Codes

| Status Code | Description                              |
| ----------- | ---------------------------------------- |
| 200         | Success                                  |
| 201         | Created                                  |
| 400         | Bad Request - Validation error           |
| 401         | Unauthorized - Authentication required   |
| 403         | Forbidden - Insufficient permissions     |
| 404         | Not Found                                |
| 409         | Conflict - Resource already exists       |
| 422         | Unprocessable Entity - Validation failed |
| 429         | Too Many Requests - Rate limit exceeded  |
| 500         | Internal Server Error                    |

---

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGO_URI=mongodb://127.0.0.1:27017/smartHire

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🐛 Known Issues

Please refer to the `bugs.txt` file for a comprehensive list of known issues categorized by severity:

- **Critical Bugs:** Issues that will make the program fail
- **Intermediate Bugs:** Issues that can be fixed but can be left for now
- **Feature Improvements:** Essential enhancements for the platform

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

_Last updated: January 2026_
