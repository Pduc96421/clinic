import { Schema, model } from "mongoose";

const MedicalRecordSchema = new Schema(
  {
    appointment_id: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    symptoms: String,
    diagnosis: String,
    note: String,
  },
  { timestamps: true },
);

const MedicalRecord = model("MedicalRecord", MedicalRecordSchema, "medical-record");

export default MedicalRecord;
