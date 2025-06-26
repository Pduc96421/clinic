import { Request, Response } from "express";
import Appointment from "../models/appointment.model";
import MedicalRecord from "../models/medical-record.model";

// Post /api/v1/medical-records/create
export const createMedicalRecord = async (req: Request, res: Response): Promise<any> => {
  try {
    const { appointment_id } = req.body;
    const userId = req.user.id;

    const appointment = await Appointment.findById(appointment_id).populate("doctor_id");

    if (!appointment) {
      return res.status(404).json({ code: 404, message: "Appointment not found" });
    }

    if (appointment.doctor_id.id.toString() !== userId) {
      return res.status(403).json({ code: 403, message: "Access denied, You are not assigned to this appointment." });
    }

    const existsRecord = await MedicalRecord.findOne({ appointment_id: appointment_id });
    if (existsRecord) {
      return res.status(409).json({ code: 409, message: "Medical record already exists" });
    }

    const newRecord = await MedicalRecord.create(req.body);

    res.status(201).json({
      code: 201,
      message: "Medical record created successfully",
      result: newRecord,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Get /api/v1/medical-records/appointment/:appointmentId
export const getRecordByAppointment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { appointmentId } = req.params;

    const record = await MedicalRecord.findOne({ appointment_id: appointmentId }).populate({
      path: "appointment_id",
      select: "appointment_time",
      populate: [
        { path: "patient_id", select: "_id full_name dob phone email" },
        { path: "doctor_id", select: "_id specialization bio" },
      ],
    });

    if (!record) {
      return res.status(404).json({ code: 404, message: "Medical record not found" });
    }

    res.status(200).json({
      code: 200,
      message: "Medical record fetched successfully",
      result: record,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Patch /api/v1/medical-records/update/:medicalRecordId
export const updateMedicalRecord = async (req: Request, res: Response): Promise<any> => {
  try {
    const { medicalRecordId } = req.params;
    const { symptoms, diagnosis, note } = req.body;

    const updated = await MedicalRecord.findByIdAndUpdate(
      medicalRecordId,
      { symptoms, diagnosis, note },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ code: 404, message: "Medical record not found" });
    }
    res.status(200).json({
      code: 200,
      message: "Medical record updated successfully",
      result: updated,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};
