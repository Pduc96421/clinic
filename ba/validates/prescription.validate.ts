import { Request, Response, NextFunction } from "express";

export const createPrescription = (req: Request, res: Response, next: NextFunction): any => {
  const { record_id, medicines } = req.body;

  if (!record_id || !medicines) {
    return res.status(400).json({ code: 400, message: "Missing record_id or medicines" });
  }

  if (!Array.isArray(medicines)) {
    return res.status(400).json({ code: 400, message: "medicines must be an array" });
  }

  for (const med of medicines) {
    if (!med.medicine_id || !med.quantity || !med.dosage) {
      return res.status(400).json({ code: 400, message: "Each medicine must have medicine_id, quantity, and dosage" });
    }
  }

  next();
};

export const updatePrescription = (req: Request, res: Response, next: NextFunction): any => {
  const { medicines } = req.body;

  if (!medicines || !Array.isArray(medicines)) {
    return res.status(400).json({ code: 400, message: "medicines must be an array" });
  }

  for (const med of medicines) {
    if (!med.medicine_id || !med.quantity || !med.dosage) {
      return res.status(400).json({ code: 400, message: "Each medicine must have medicine_id, quantity, and dosage" });
    }
  }

  next();
};
