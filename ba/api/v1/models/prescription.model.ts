import { Schema, model } from "mongoose";

const PrescriptionSchema = new Schema({
  record_id: { type: Schema.Types.ObjectId, ref: 'MedicalRecord', required: true },
  created_at: { type: Date, default: Date.now },
  medicines: [
    {
      medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
      quantity: Number,
      dosage: String,
    },
  ],
}, { timestamps: true },);

const Prescription = model('Prescription', PrescriptionSchema, "prescription");

export default Prescription;
