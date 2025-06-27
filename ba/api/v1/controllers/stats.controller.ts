import { Request, Response } from "express";
import mongoose from "mongoose";
import Appointment from "../models/appointment.model";
import Feedback from "../models/feedback.model";

// Get /api/v1/stats/doctor/:doctorId/overview
export const getDoctorOverview = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;

    const totalAppointments = await Appointment.countDocuments({ doctor_id: doctorId });
    const cancelledAppointments = await Appointment.countDocuments({ doctor_id: doctorId, status: "cancelled" });
    const doneAppointments = await Appointment.countDocuments({ doctor_id: doctorId, status: "done" });

    const completedRate = totalAppointments > 0 ? ((doneAppointments / totalAppointments) * 100).toFixed(2) : "0";

    res.status(200).json({
      code: 200,
      message: "Doctor overview statistics",
      result: {
        total: totalAppointments,
        cancelled: cancelledAppointments,
        done: doneAppointments,
        completionRate: `${completedRate}%`,
      },
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Get /api/v1/stats/doctor/:doctorId/monthly
export const getDoctorMonthlyAppointments = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;

    const stats = await Appointment.aggregate([
      { $match: { doctor_id: new mongoose.Types.ObjectId(doctorId) } },
      {
        $group: {
          _id: { year: { $year: "$appointment_time" }, month: { $month: "$appointment_time" } },
          totalAppointments: { $sum: 1 },
          doneAppointments: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
          cancelledAppointments: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      code: 200,
      message: "Monthly appointment statistics",
      result: stats,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Get /api/v1/stats/doctor/:doctorId/ratings
export const getDoctorAverageRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;

    const appointmentIds = await Appointment.find({ doctor_id: doctorId }).select("_id");
    const ids = appointmentIds.map((a) => a._id);

    const result = await Feedback.aggregate([
      { $match: { appointment_id: { $in: ids } } },
      { $group: { _id: null, averageRating: { $avg: "$rating" }, totalFeedback: { $sum: 1 } } },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        code: 200,
        message: "No feedback yet",
        result: {
          averageRating: 0,
          totalFeedback: 0,
        },
      });
    }

    res.status(200).json({
      code: 200,
      message: "Average rating",
      result: {
        averageRating: result[0].averageRating.toFixed(2),
        totalFeedback: result[0].totalFeedback,
      },
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};
