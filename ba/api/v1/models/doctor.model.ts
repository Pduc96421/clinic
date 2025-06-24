import { Schema, model } from "mongoose";

const DoctorSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  specialization: { type: String, required: true },
  bio: String,
});

const Doctor = model("Doctor", DoctorSchema, "doctor");
export default Doctor;
