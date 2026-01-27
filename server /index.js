import 'dotenv/config';
import  app from "./src/app.js";
import connectDB from "./src/config/db.js";
import seedAdmin from "./src/utils/seedAdmin.js";

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();