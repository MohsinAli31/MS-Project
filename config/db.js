import mongoose from "mongoose";

const connectDB = () => {
  return mongoose
    .connect(process.env.MONGO_URI, {
            dbName: 'management_system' // Specify the database name
        })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    });
};

export default connectDB;
