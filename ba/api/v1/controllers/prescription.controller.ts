import { Request, Response } from "express";
import Prescription from "../models/prescription.model";
import MedicalRecord from "../models/medical-record.model";
import Medicine from "../models/medicine.model";

// Post /api/v1/prescriptions/create
export const createPrescription = async (req: Request, res: Response): Promise<any> => {
  try {
    const { record_id, medicines } = req.body;

    const record = await MedicalRecord.findById(record_id);
    if (!record) {
      return res.status(404).json({ code: 404, message: "Medical record not found" });
    }

    const existing = await Prescription.findOne({ record_id });
    if (existing) {
      return res.status(409).json({ code: 409, message: "Prescription already exists" });
    }

    for (const item of medicines) {
      const med = await Medicine.findById(item.medicine_id);

      if (!med) {
        return res.status(404).json({ code: 404, message: `Medicine not found` });
      }

      if (med.stock < item.quantity) {
        return res.status(400).json({
          code: 400,
          message: `Medicine ${med.name} has only ${med.stock} in stock`,
        });
      }

      await Medicine.findByIdAndUpdate(item.medicine_id, {
        $inc: { stock: -item.quantity },
      });
    }

    const newPrescription = await Prescription.create({ record_id, medicines });

    res.status(201).json({
      code: 201,
      message: "Prescription created successfully",
      result: newPrescription,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Get /api/v1/prescriptions/medical-record/:recordId
export const getPrescriptionByRecord = async (req: Request, res: Response): Promise<any> => {
  try {
    const { recordId } = req.params;

    const prescription = await Prescription.findOne({ record_id: recordId, deleted: false }).populate({
      path: "medicines.medicine_id",
      select: "name description",
    });

    if (!prescription) {
      return res.status(404).json({ code: 404, message: "Prescription not found" });
    }

    res.status(200).json({
      code: 200,
      message: "Prescription found",
      result: prescription,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Patch /api/v1/prescriptions/update/:prescriptionId
export const updatePrescription = async (req: Request, res: Response): Promise<any> => {
  try {
    const { prescriptionId } = req.params;
    const { medicines } = req.body;

    const updated = await Prescription.findByIdAndUpdate(prescriptionId, { medicines }, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ code: 404, message: "Prescription not found" });
    }

    res.status(200).json({
      code: 200,
      message: "Prescription updated successfully",
      result: updated,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Delete /api/v1/prescriptions/delete/:prescriptionId
export const deletePrescription = async (req: Request, res: Response): Promise<any> => {
  try {
    const { prescriptionId } = req.params;

    const deleted = await Prescription.findByIdAndUpdate(prescriptionId, { deleted: true, deletedAt: new Date() });

    if (!deleted) {
      return res.status(404).json({ code: 404, message: "Prescription not found" });
    }

    res.status(201).json({
      code: 201,
      message: "Delete prescription successfully",
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
