import { Request, Response } from 'express';
import Schedule from '../models/schedule.model';
import Doctor from '../models/doctor.model';

// Post /api/v1/schedules/create/:doctorId
export const createSchedule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;
    const myDoctorId = req.user.id;
    const { day_of_week, start_time, end_time } = req.body;

    const doctor = await Doctor.findOne({ _id: doctorId });

    const existsSchedule = await Schedule.findOne({
      doctor_id: doctorId,
      day_of_week,
    });

    if (existsSchedule) {
      return res.status(400).json({
        code: 400,
        message: 'Schedule already exists for this day',
      });
    }

    if (req.user.role !== 'ADMIN') {
      if (myDoctorId !== doctor.user_id.toString()) {
        return res.status(403).json({
          code: 403,
          message: 'You are not authorized to create schedule this doctor',
        });
      }
    }

    const schedule = await Schedule.create({
      doctor_id: doctorId,
      day_of_week,
      start_time,
      end_time,
    });

    res.status(200).json({
      code: 200,
      message: 'Create schedule successfully',
      result: schedule,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Get /api/v1/schedules/doctor/:doctorId
export const getScheduleByDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;

    const schedule = await Schedule.find({ doctor_id: doctorId })
      .select('-__v')
      .populate({
        path: 'doctor_id',
        select: 'specialization bio user_id',
        populate: {
          path: 'user_id',
          select: 'fullName email',
        },
      });

    if (!schedule) {
      return res.status(404).json({ code: 404, message: 'Schedule not found' });
    }

    res.status(200).json({
      code: 200,
      message: 'get schedule by doctor successfully',
      result: schedule,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Patch /api/v1/schedules/update/:scheduleId
export const updateSchedule = async (req: Request, res: Response): Promise<any> => {
  try {
    const { scheduleId } = req.params;
    const myUserId = req.user.id;

    const schedule = await Schedule.findOne({ _id: scheduleId }).populate({
      path: 'doctor_id',
      select: 'user_id',
    });
    if (!schedule) {
      return res.status(404).json({ code: 404, message: 'Schedule not found' });
    }

    const doctor: any = schedule.doctor_id;
    const userId = doctor.user_id.toString();

    if (req.user.role !== 'ADMIN') {
      if (myUserId !== userId) {
        return res.status(403).json({
          code: 403,
          message: 'You are not authorized to update schedule this doctor',
        });
      }
    }

    await Schedule.updateOne({ _id: scheduleId }, { $set: req.body });

    res.status(200).json({
      code: 200,
      message: 'Update Schedule successfully',
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
