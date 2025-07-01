import { Request, Response } from "express";
import User from "../api/v1/models/user.model";

export const usersSocket = async (req: Request, res: Response) => {
  _io.once("connection", (socket) => {
    // Người dùng A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const currentUserId = req.user.id; // A

      // Thêm id A vào acceptFriends B
      const existsUserAinB = await User.findOne({ _id: userId, acceptFriends: currentUserId });
      if (!existsUserAinB) {
        await User.updateOne({ _id: userId }, { $push: { acceptFriends: currentUserId } });
      }

      // Thêm id B vào requestFriends A
      const existsUserBinA = await User.findOne({ _id: currentUserId, requestFriends: userId });
      if (!existsUserBinA) {
        await User.updateOne({ _id: currentUserId }, { $push: { requestFriends: userId } });
      }

      // độ dài acceptFriends của B
      const infoUserB = await User.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;
      socket.broadcast.emit("RETURN_LENGTH_ACCEPT_FRIEND", { userId: userId, lengthAcceptFriends: lengthAcceptFriends });

      // độ dài requestFriends của A
      const infoUserA = await User.findOne({ _id: currentUserId });
      socket.broadcast.emit("RETURN_INFO_ACCEPT_FRIEND", { userId: userId, infoUserA: infoUserA });
    });
  });
};
