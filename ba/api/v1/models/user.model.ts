import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: String,
    fullName: String,
    email: String,
    password: { type: String, select: false },
    token: { type: String, select: false },
    sex: { type: String, enum: ["male", "female", "other"] },
    avatar: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
    role: { type: String, enum: ["patient", "doctor", "admin"], require: true },
    phone: String,
    dob: Date,
    address: String,
    acceptFriends: [{ user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, _id: false }],
    requestFriends: [{ user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, _id: false }],
    friendList: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        room_chat_id: { type: Schema.Types.ObjectId, ref: "RoomChat", required: true },
        _id: false,
      },
    ],
    statusOnline: String,
    status: { type: String, default: "active" },
    isConfirmed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true },
);

const User = model("User", userSchema, "user");

export default User;
