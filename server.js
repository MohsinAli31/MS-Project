import app from "./app.js";
import  connectDB  from "./config/db.js";

// Connect to the database
connectDB();
const port = process.env.PORT || 3000;

// Start the server
const Server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// error handling middleware
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
    Server.close(() => {
      process.exit(1); // Exit the process to avoid undefined behavior
    });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1); // Exit the process to avoid undefined behavior
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});



export default Server;