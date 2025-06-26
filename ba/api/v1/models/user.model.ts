import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    fullName: String,
    email: String,
    password: { type: String, select: false },
    token: { type: String, select: false },
    sex: String,
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    role: { type: String, enum: ["patient", "doctor", "admin"], require: true },
    phone: String,
    dob: Date,
    address: String,
    status: { type: String, default: "active" },
    isConfirmed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
    statusOnline: String,
  },
  { timestamps: true },
);

const User = model("User", userSchema, "user");

export default User;
