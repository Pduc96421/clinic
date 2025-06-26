import { Request, Response } from "express";
import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";
import Schedule from "../models/schedule.model";

// Get api/v1/appointments/doctor/:doctorId
export const getDoctorAppointments = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;
    const { date_start, date_end, status } = req.body;

    const filter: any = { doctor_id: doctorId };

    if (status) {
      filter.status = status;
    }

    if (date_start && date_end) {
      const start = new Date(date_start as string);
      const end = new Date(date_end as string);

      filter.appointment_time = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: "patient_id",
        select: "_id full_name dob phone email",
      })
      .populate({
        path: "doctor_id",
        select: "_id specialization bio",
      });

    res.status(200).json({
      code: 200,
      message: "Get doctor appointments successfully",
      result: appointments,
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Post /api/v1/appointments/:doctorId/create
export const createAppointment = async (req: Request, res: Response): Promise<any> => {
  try {
    const patientId = req.user.id;
    const { doctor_id, appointment_time } = req.body;
    const appointmentDate = new Date(appointment_time);

    const doctorExists = await Doctor.findById(doctor_id);
    if (!doctorExists) {
      return res.status(404).json({ code: 404, message: "Doctor not found" });
    }

    const daysEnum = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const appointmentDay = daysEnum[appointmentDate.getDay()];
    const schedule = await Schedule.findOne({ doctor_id: doctor_id, day_of_week: appointmentDay });
    if (!schedule) {
      return res.status(400).json({ code: 400, message: "Doctor does not work on this day." });
    }

    const appointmentHour = appointmentDate.getHours();
    const appointmentMinute = appointmentDate.getMinutes();

    const [startHour, startMinute] = schedule.start_time.split(":").map(Number);
    const [endHour, endMinute] = schedule.end_time.split(":").map(Number);

    const appointmentMinutes = appointmentHour * 60 + appointmentMinute;
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (appointmentMinutes < startMinutes || appointmentMinutes > endMinutes) {
      return res.status(400).json({ code: 400, message: "Doctor does not work at this time." });
    }

    const start = new Date(appointmentDate.getTime() - 15 * 60 * 1000); // trừ 15 phút
    const end = new Date(appointmentDate.getTime() + 15 * 60 * 1000); // cộng 15 phút
    const patientConflict = await Appointment.findOne({
      patient_id: patientId,
      appointment_time: { $gte: start, $lt: end },
      status: { $ne: "cancelled" }, // chưa bị hủy
    });
    if (patientConflict) {
      return res.status(409).json({ code: 409, message: "You already have an appointment at this time." });
    }

    const doctorConflict = await Appointment.findOne({
      doctor_id,
      appointment_time: appointmentDate,
      status: { $ne: "cancelled" },
    });

    if (doctorConflict) {
      return res.status(409).json({ code: 409, message: "Doctor already has an appointment at this time." });
    }

    const newAppointment = await Appointment.create({
      patient_id: patientId,
      doctor_id,
      appointment_time: appointmentDate,
      status: "pending",
    });

    res.status(201).json({
      code: 201,
      message: "Appointment created successfully",
      result: newAppointment,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Get /api/v1/appointments/detail/:appointmentId
export const getDetailAppointment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({ _id: appointmentId, status: { $ne: "cancelled" } })
      .populate({
        path: "patient_id",
        select: "full_name dob phone email",
      })
      .populate({
        path: "doctor_id",
        select: "_id specialization bio",
      });

    res.status(200).json({ code: 200, message: "Get detail appointment successfully", result: appointment });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Patch /api/v1/appointments/status/:appointmentId
export const updateStatusAppointment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findOne({ _id: appointmentId });

    if (!appointment) {
      res.status(400).json({ code: 400, message: "no appointment" });
    }

    await Appointment.updateOne({ _id: appointmentId }, { $set: { status: status } }, { runValidators: true });

    res.status(200).json({ code: 200, message: "Update status appointment successfully" });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};
