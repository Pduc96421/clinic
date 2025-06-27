import { Request, Response, NextFunction } from "express";

export const createFeedback = (req: Request, res: Response, next: NextFunction): any => {
  const { appointment_id, rating, comment } = req.body;

  if (!appointment_id || !rating) {
    return res.status(400).json({ code: 400, message: "appointment_id and rating are required" });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({ code: 400, message: "rating must be a number from 1 to 5" });
  }

  if (comment && typeof comment !== "string") {
    return res.status(400).json({ code: 400, message: "comment must be a string" });
  }

  next();
};
