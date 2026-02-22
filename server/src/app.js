import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import jobseekerRoutes from "./routes/jobseeker.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import adminRecruiterRoutes from "./routes/adminRecruiter.routes.js";
import adminJobRoutes from "./routes/adminJob.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRouter from "./routes/applications.routes.js";
import saveJobsRouter from "./routes/savedJobs.routes.js";
import skillsRouter from "./routes/skills.routes.js";
import categoriesRouter from "./routes/Jobcategories.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import emailRouter from "./routes/email.routes.js";
import { requestLogger } from "./config/logger.js";
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

app.use("/api", limiter); // limiter

app.use(requestLogger);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); // helmet middleware

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://job-portal-eight-psi-69.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


// health check and root api 
app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Welcome to SmartHire API", 
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is healthy", 
    timestamp: new Date().toISOString() 
  });
});

app.use("/api/v1/auth", authRoutes); // auth routes

app.use("/api/v1/users", userRouter); // user routes
app.use("/api/v1/jobseekers", jobseekerRoutes); // jobseeker routes
app.use("/api/v1/recruiters", recruiterRoutes); // recruiter routes
app.use("/api/v1/admin/recruiters", adminRecruiterRoutes); // adminrecruiter routes
app.use("/api/v1/jobs", jobRoutes); // job routes
app.use("/api/v1/admin/jobs", adminJobRoutes); // admin job routes
app.use("/api/v1/applications", applicationRouter); // applications routes
app.use("/api/v1/saved-jobs", saveJobsRouter); // saved jobs routes
app.use("/api/v1/skills", skillsRouter); // skills jobs routes
app.use("/api/v1/categories", categoriesRouter); // categories jobs routes
app.use("/api/v1/analytics", analyticsRouter); // analytics jobs routes
app.use("/api/v1/emails", emailRouter); // email routes



// 3. Global Error Handler (The Catch-All)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for you to see

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show stack trace in development mode for safety
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;
