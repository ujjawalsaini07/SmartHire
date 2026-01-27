import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from uploads directory

app.use(requestLogger);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

export default app;
