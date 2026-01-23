import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
import { authorize } from "./middlewares/role.middleware.js";
import morgan from "morgan";
import winston from "winston";

// 1. Create a Better Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), // Adds a timestamp property
    winston.format.json()       // keeps the log in JSON format
  ),
  transports: [
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

// 2. Create a Custom Morgan Format that outputs JSON objects
const morganFormat = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number.parseFloat(tokens.status(req, res)),
    content_length: tokens.res(req, res, 'content-length'),
    response_time: Number.parseFloat(tokens['response-time'](req, res)),
  });
};

const app = express();

// 3. Apply the Middleware
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = JSON.parse(message);
      logger.info('Access Log', logObject);
    }
  }
}));



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());


app.use("/api/v1/auth", authRoutes);

app.use(protect); // ROUTES BELOW ARE PROTECTED 

app.use("/api/v1/admin",authorize('ADMIN'),adminRoutes);  

app.use("/api/v1/recruiter" ,authorize('RECRUITER'),recruiterRoutes)



export default app;
