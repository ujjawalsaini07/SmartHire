import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import authRoutes from "./routes/auth.routes.js";
import {requestLogger} from "./config/logger.js";


const app = express();


app.use(requestLogger);

app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());
// app.use("/api/v1/auth", authRoutes);



// app.use(protect); // ROUTES BELOW ARE PROTECTED BY MIDDLEWARE

// app.use("/api/v1/admin",authorize('ADMIN'),adminRoutes);  

// app.use("/api/v1/recruiter" ,authorize('RECRUITER'),recruiterRoutes)



export default app;
