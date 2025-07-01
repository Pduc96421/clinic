import { Server } from "socket.io";
import Chat from '../api/v1/models/chat.model'

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    // Lấy roomId từ query (có thể là userId hoặc conversationId)
    const roomId = socket.handshake.query.roomId as string;

    if (roomId) {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    }

    // Gửi tin nhắn vào room
    socket.on("send_message", async ({ sender_id, content }) => {
      if (!roomId || !sender_id || !content) return;

      // Lưu tin nhắn vào DB (nếu cần)
      const message = await Chat.create({ sender_id, room_id: roomId, content });

      // Gửi tin nhắn cho tất cả user trong room
      io.to(roomId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected from room ${roomId}`);
    });
  });
};