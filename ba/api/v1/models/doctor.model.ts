import { Schema, model } from "mongoose";
import { IDoctor } from "../../../types/doctor.type";

const DoctorSchema = new Schema<IDoctor>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, default: "Not specified" },
    bio: String,
  },
  { timestamps: true },
);

const Doctor = model<IDoctor>("Doctor", DoctorSchema, "doctor");
export default Doctor;
