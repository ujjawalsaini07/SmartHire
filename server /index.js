import 'dotenv/config';
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import seedAdmin from "./src/utils/seedAdmin.js";

// 1. ADD THIS FUNCTION
const checkEnv = () => {
  const required = [
  "PORT",
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "FRONTEND_URL",
  "NODE_ENV",
  "ADMIN_NAME",
  "ADMIN_PASSWORD",
  "ADMIN_EMAIL",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS"
];

  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error("CRITICAL ERROR: Missing environment variables:");
    console.error(missing.join(", "));
    process.exit(1); // Kill the server
  }
};

const startServer = async () => {
  checkEnv(); 
  await connectDB();
  await seedAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();