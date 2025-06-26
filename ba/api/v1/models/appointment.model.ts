import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema(
  {
    patient_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor_id: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointment_time: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "done", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Appointment = model("Appointment", AppointmentSchema, "appointment");
export default Appointment;
