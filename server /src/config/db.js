// import mongoose from "mongoose";

// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// export default connectDB;




import mongoose from "mongoose";

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

async function connectDB() {
  let retries = MAX_RETRIES;
  let currentDelay = INITIAL_RETRY_DELAY;

  while (retries > 0) {
    try {
      // Attempt connection
      await mongoose.connect(process.env.MONGO_URI);
      
      console.log("MongoDB connected successfully");
      return; // Exit function on success
      
    } catch (err) {
      retries -= 1;
      
      console.error(`MongoDB connection failed. ${retries} retries left.`);
      console.error(`Error: ${err.message}`);

      if (retries === 0) {
        console.error("Max retries reached. Exiting application...");
        process.exit(1);
      }

      console.log(`Waiting ${currentDelay / 1000} seconds before retrying...`);
      
      // Wait for the specified delay
      await new Promise((resolve) => setTimeout(resolve, currentDelay));

      // Double the delay for the next attempt (Exponential Backoff)
      // e.g., 2s -> 4s -> 8s -> 16s
      currentDelay *= 2; 
    }
  }
}

export default connectDB;