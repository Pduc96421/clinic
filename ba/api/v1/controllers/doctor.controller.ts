import { Request, Response } from 'express';
import Doctor from '../models/doctor.model';

// Get /api/v1/doctors/list-doctor
export const listDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const doctor = await Doctor.find();

    res.status(200).json({
      code: 200,
      message: 'Get list doctor successfully',
      result: doctor,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Get /api/v1/doctors/info/:doctorId
export const getInfoDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findOne({ user_id: doctorId })
      .populate({
        path: 'user_id',
        select: 'avatar fullName email phone sex',
      })
      .select('-_id -__v');

    if (!doctor) {
      return res.status(404).json({ code: 404, message: 'Doctor not found' });
    }

    res.status(200).json({
      code: 200,
      message: 'Get information doctor successfully',
      result: doctor,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Patch /api/v1/doctors/update/:doctorId
export const updateDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const myDoctorId: string = req.user.id;

    const doctor = await Doctor.findOne({ user_id: myDoctorId });

    if (!doctor) {
      return res.status(404).json({ code: 404, message: 'Doctor not found' });
    }

    await Doctor.updateOne({ user_id: myDoctorId }, { $set: req.body });

    res.status(200).json({
      code: 200,
      message: 'Update doctor successfully',
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};
