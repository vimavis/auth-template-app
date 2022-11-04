import { StatusCodes as HTTP_CODE } from 'http-status-codes';

export default async (req, res, next) => {
  const { user } = req;
  if (!user.isAdmin) {
    return res.status(HTTP_CODE.FORBIDDEN).json({
      message: "Forbidden",
    });
  }
  next();
};