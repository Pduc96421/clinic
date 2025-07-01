import { Schema, model } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    record_id: { type: Schema.Types.ObjectId, ref: "MedicalRecord", required: true },
    medicines: [
      {
        medicine_id: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
        quantity: Number,
        dosage: String,
      },
    ],
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true },
);

const Prescription = model("Prescription", PrescriptionSchema, "prescription");

export default Prescription;
