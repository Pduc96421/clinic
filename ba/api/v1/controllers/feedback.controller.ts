import { Request, Response } from "express";
import Feedback from "../models/feedback.model";
import Appointment from "../models/appointment.model";

// Post /api/v1/feedbacks/create
export const createFeedback = async (req: Request, res: Response): Promise<any> => {
  try {
    const { appointment_id, rating, comment } = req.body;
    const userId = req.user.id;

    const appointment = await Appointment.findById(appointment_id);
    if (!appointment) {
      return res.status(403).json({ code: 403, message: "Appointment not found." });
    }

    const existing = await Feedback.findOne({ appointment_id });
    if (existing) {
      return res.status(409).json({ code: 409, message: "Feedback already submitted." });
    }

    const newFeedback = await Feedback.create({ appointment_id, rating, comment, user_id: userId });

    res.status(201).json({
      code: 201,
      message: "Feedback submitted successfully",
      result: newFeedback,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Get /api/v1/feedbacks/doctor/:doctorId
export const getFeedbackByDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctor_id: doctorId });
    const appointmentIds = appointments.map((a) => a._id);

    const feedbacks = await Feedback.find({ appointment_id: { $in: appointmentIds } })
      .populate("appointment_id")
      .populate({
        path: "user_id",
        select: "fullName",
      });

    res.status(200).json({
      code: 200,
      message: "Feedbacks fetched successfully",
      result: feedbacks,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Get /api/v1/feedbacks/appointment/:appointmentId
export const getFeedbackByAppointment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { appointmentId } = req.params;

    const feedback = await Feedback.findOne({ appointment_id: appointmentId })
      .populate({
        path: "appointment_id",
      })
      .populate({
        path: "user_id",
        select: "fullName email avatar role"
      });

    if (!feedback) {
      return res.status(404).json({ code: 404, message: "Feedback not found" });
    }

    res.status(200).json({
      code: 200,
      message: "Feedback found",
      result: feedback,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};
