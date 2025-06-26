import { Request, Response } from "express";

export const createMedicalRecord = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;

  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
