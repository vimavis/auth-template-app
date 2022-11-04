import jwt from 'jsonwebtoken';
import { findUserById } from '../controllers/user.controller.js';
import { JWT_SECRET } from "../config.js";
import { StatusCodes as HTTP_CODE } from 'http-status-codes';

export default async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(HTTP_CODE.FORBIDDEN).json({
      message: "Forbidden",
    });
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await findUserById(decoded._id);
      req.user = user;
      next();
    } catch (error) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
  }
};
