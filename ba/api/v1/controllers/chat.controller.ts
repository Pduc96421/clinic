import { Request, Response } from "express";
import Chat from "../models/chat.model";
import RoomChat from "../models/room-chat.model";

// POST /api/v1/chats/send
export const sendMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    let { room_chat_id, content, reply_chat_id } = req.body;
    const currentUserId = req.user.id;

    const room = await RoomChat.findOne({ _id: room_chat_id, deleted: false });
    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    const isMember = room.users.some((u) => u.user_id.toString() === currentUserId);
    if (!isMember) {
      return res.status(403).json({ code: 403, message: "You are not a member of this room" });
    }

    if (reply_chat_id) {
      const originalMessage = await Chat.findOne({ _id: reply_chat_id, room_chat_id, deleted: false });
      if (!originalMessage) {
        return res.status(400).json({ code: 400, message: "Reply target not found or invalid" });
      }
    }

    const chat = new Chat({ user_id: currentUserId, room_chat_id, content, reply_chat_id: reply_chat_id || null });
    await chat.save();

    res.status(200).json({ code: 200, message: "Message sent", result: chat });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Post /api/v1/chats/send-file
export const sendFileMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const room_chat_id = req.body.room_chat_id;
    const reply_chat_id = req.body.reply_chat_id;
    const currentUserId = req.user.id;

    if (!req.body.file_url) {
      return res.status(400).json({ code: 400, message: "No file uploaded or invalid format" });
    }

    const room = await RoomChat.findOne({ _id: room_chat_id, deleted: false });
    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    const isMember = room.users.some((u) => u.user_id.toString() === currentUserId);
    if (!isMember) {
      return res.status(403).json({ code: 403, message: "You are not a member of this room" });
    }

    const newMessage = new Chat({
      user_id: currentUserId,
      room_chat_id,
      type: "file",
      file_url: req.body.file_url,             // URL từ Cloudinary
      file_name: req.file?.originalname || "", // tên gốc của file
      reply_chat_id: reply_chat_id || null,
    });
    // await newMessage.save();

    res.status(200).json({ code: 200, message: "File sent successfully", result: newMessage });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// GET /api/v1/chats/:roomId
export const getMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user.id;

    const room = await RoomChat.findOne({ _id: roomId, deleted: false });
    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    if (req.user.role !== "admin") {
      const isMember = room.users.some((u) => u.user_id.toString() === currentUserId);
      if (!isMember) {
        return res.status(403).json({ code: 403, message: "You are not a member of this room" });
      }
    }

    const messages = await Chat.find({ room_chat_id: roomId, deleted: false })
      .populate("user_id", "username fullName avatar")
      .populate({
        path: "reply_chat_id",
        populate: {
          path: "user_id",
          select: "username fullName avatar",
        },
        select: "content user_id createdAt",
      })
      .select("-__v")
      .sort({ createdAt: 1 });

    res.status(200).json({ code: 200, message: "Messages retrieved", result: messages });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// DELETE /api/v1/chats/:chatId
export const deleteMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { chatId } = req.params;
    const currentUserId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat || chat.deleted) {
      return res.status(404).json({ code: 404, message: "Chat not found or already deleted" });
    }

    if (chat.user_id.toString() !== currentUserId) {
      return res.status(403).json({ code: 403, message: "You can only delete your own messages" });
    }

    chat.deleted = true;
    chat.deletedAt = new Date();
    await chat.save();

    res.status(200).json({ code: 200, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
