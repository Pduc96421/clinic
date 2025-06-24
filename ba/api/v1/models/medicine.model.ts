import { Schema, model } from "mongoose";

const MedicineSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
});

const Medicine = model('Medicine', MedicineSchema, "medicine");

export default Medicine;
