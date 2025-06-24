import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import MedicalRecord from '../models/medical-record.model';
import User from '../models/user.model';

export const getDoctorAppointments = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;
    const { date, status } = req.query;

    const filter: any = { doctor_id: doctorId };

    // Lọc theo trạng thái nếu có
    if (status) {
      filter.status = status;
    }

    // Lọc theo ngày cụ thể nếu có (chỉ so sánh ngày, không giờ)
    if (date) {
      const start = new Date(date as string);
      const end = new Date(date as string);
      end.setHours(23, 59, 59, 999);

      filter.appointment_time = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter)
      .populate({
        path: 'patient_id',
        select: 'full_name dob phone email',
      })
      .populate({
        path: 'doctor_id',
        select: '_id specialization', // optional
      });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
