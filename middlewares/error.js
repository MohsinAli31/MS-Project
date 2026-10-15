export default class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;  

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";   
  if(err.code == 110001) {
    err.message = "Duplicate field value entered";
    err.statusCode = 400;
  }

  if(err.name == "jsonWebTokenError") {
    err.message = "Invalid token. Please log in again!";
    err.statusCode = 401;
  }
  if (err.name == "TokenExpiredError") {
    err.message = "Your token has expired! Please log in again.";
    err.statusCode = 401;
  }
  if (err.name== "TokenExpiredError") {
    err.message = "Your token has expired! Please log in again.";
    err.statusCode = 401;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    err.message = `Invalid input data. ${errors.join(". ")}`;
    err.statusCode = 400;
  }
  if (err.name== "CastError") {
    err.message = `Resource not found. Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }
  const errorMessage = err.errors ? Object.values(err.errors).map((el) => el.message).join(". ") : err.message;
  res.status(err.statusCode).json({
    status: err.status,
    message: errorMessage,
  });

}
