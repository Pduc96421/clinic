import { Request, Response, NextFunction } from "express";

export const createAppointment = (req: Request, res: Response, next: NextFunction): any => {
  const { doctor_id, appointment_time } = req.body;

  if (!doctor_id || !appointment_time) {
    return res.status(400).json({ code: 400, message: "Missing doctor_id or appointment_time" });
  }

  next();
};

export const updateStatusAppointment = (req: Request, res: Response, next: NextFunction): any => {
  const { status } = req.body;

  if (req.user.role === "patient") {
    if (status !== "pending" && status !== "cancelled") {
      return res.status(403).json({
        code: 403,
        message: "Patient can only change status to 'pending' or 'cancelled'",
      });
    }
  }

  next();
};
