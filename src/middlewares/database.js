import mongoose from "mongoose";
import { StatusCodes as HTTP_CODE } from 'http-status-codes';

export default async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    return res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
      message: "Database connection error",
    });
  }
  next();
};