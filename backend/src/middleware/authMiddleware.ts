import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  // verify token
  jwt.verify(token, process.env.JWT_SECRET ?? "", (err: any, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
