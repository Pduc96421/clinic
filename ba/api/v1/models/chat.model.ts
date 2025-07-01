import { Schema, model } from "mongoose";

const ChatSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room_chat_id: { type: Schema.Types.ObjectId, ref: "RoomChat", required: true },
    content: String,
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true },
);

const Chat = model("Chat", ChatSchema, "chat");

export default Chat;
