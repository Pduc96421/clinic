import { Request, Response, NextFunction } from "express";

export const createMedicalRecord = (req: Request, res: Response, next: NextFunction): any => {
  if (req.user.role === "patient") {
    return res.status(403).json({ code: 403, message: "Patient can not create medical record" });
  }

  const { appointment_id, diagnosis, treatment } = req.body;
  if (!appointment_id) {
    return res.status(400).json({ code: 400, message: "Appointment_id is required" });
  }

  if (!diagnosis || !treatment) {
    return res.status(400).json({ code: 400, message: "Missing diagnosis or treatment" });
  }

  next();
};
