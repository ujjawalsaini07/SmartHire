# Unimplemented Features & Future Enhancements

Based on a comprehensive review of the `server` implementation (controllers, routes, models, middleware, and documentation), the following features and architectural components are currently **not implemented** or lack complete integration:

## 1. Automated Testing Suite
- **Current State:** No testing frameworks (e.g., Jest, Mocha, Chai) or test files exist in the repository.
- **Missing Implementations:** 
  - Unit tests for core logic (e.g., recommendation algorithms, JWT token generation).
  - Integration tests for API routes.
  - Mocking for external services like MongoDB and Cloudinary.

## 2. API Documentation (Interactive)
- **Current State:** APIs are thoroughly documented in a static `README.md`.
- **Missing Implementations:** 
  - Implementation of tools like `swagger-ui-express` or `redoc` to auto-generate and test interactive API documentation for frontend developers.

## 3. Advanced Security Validation
- **Current State:** Basic validations exist (CORS, Helmet, express-validator for Auth).
- **Missing Implementations:**
  - **Strict File Inspection:** `upload.middleware.js` trusts MIME types instead of inspecting binary magic numbers (e.g., via `file-type` library), risking malicious file uploads.
  - **Malware/Virus Scanning:** No integration with ClamAV or similar tools to scan uploaded resumes/images.
  - **Universal Validation:** Missing strict `express-validator` schemas on non-Auth POST/PUT routes (such as Job creation and Job Seeker profile updates).

## 4. Fine-Grained Rate Limiting
- **Current State:** The application utilizes a global API rate limiter (e.g., 100 requests per 15 min).
- **Missing Implementations:**
  - Dedicated rate limiting blocks for sensitive endpoints like "Forgot Password", "Contact Candidate", and "Verification Email" to prevent active spam and abuse.

## 5. Audit Logging Mechanism
- **Current State:** Uses Morgan and Winston for basic system logging.
- **Missing Implementations:**
  - A definitive `AuditLog` MongoDB model/collection to trace administrative actions (e.g., "Admin approved recruiter X", "Recruiter deleted Job Y").

## 6. Internal Asynchronous Task Queuing
- **Current State:** External email microservice is integrated via HTTP fetch calls (`emailService.js`), but internal massive tasks are handled linearly.
- **Missing Implementations:**
  - A message-broker system (like BullMQ + Redis) for heavy operations. For example, `sendBroadcastEmail` inside `email.controller.js` fires up `Promise.allSettled()`, which can freeze the main Node.js event loop on thousands of emails. 

## 7. Versioned Folder Architecture
- **Current State:** Routes are prefixed with `/api/v1/...` in `app.js`.
- **Missing Implementations:**
  - Controllers and Routes are not grouped in physical `v1/` directories, making future transitions to a `v2` API difficult without breaking current paths.

## 8. Graceful Fallbacks for External Services
- **Current State:** Cloudinary handles image/pdf storage. If it fails, operations immediately fail via standard error bubbling.
- **Missing Implementations:**
  - Retry queues or fallback localized storage options for uploaded content if external cloud providers experience downtime.
