import { Request, Response } from "express";
import RoomChat from "../models/room-chat.model";

// Post /api/v1/room-chat/create
export const createRoomChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, usersId } = req.body;
    const currentUserId = req.user.id;

    if (typeof usersId !== "object" || usersId.length < 2) {
      return res.status(400).json({ code: 400, message: "Select two members in the group" });
    }

    const dataRoomChat = {
      title: title,
      typeRoom: "group",
      users: [{ user_id: currentUserId, role_room: "superAdmin" }],
    };

    usersId.forEach((userId: any) => {
      dataRoomChat.users.push({ user_id: userId, role_room: "user" });
    });

    const room = new RoomChat(dataRoomChat);
    await room.save();

    res.status(200).json({ code: 200, message: "Create room chat successfully", result: room });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Get /api/v1/room-chat/list-friend
export const listRoomChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.id;

    const rooms = await RoomChat.find({ "users.user_id": currentUserId, deleted: false })
      .populate({
        path: "users.user_id",
        select: "username fullName email sex avatar role dob",
      })
      .lean();

    const result = rooms.map((room) => {
      const users = room.users.map((u) => {
        const infoUser = u.user_id as any;
        infoUser.role_room = u.role_room;
        return infoUser;
      });

      return { ...room, users: users };
    });

    res.status(200).json({ code: 200, message: "Get list friend successfully", result: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Get /api/v1/room-chat/info/:roomId
export const getRoomChatByRoomId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;
    const currentUserId = req.user.id;

    const room = await RoomChat.findOne({ _id: roomId, deleted: false })
      .populate({
        path: "users.user_id",
        select: "username fullName email sex avatar role dob",
      })
      .lean();

    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    const isUserInRoom = room.users.some((u) => u.user_id && u.user_id._id.toString() === currentUserId);
    if (!isUserInRoom) {
      return res.status(403).json({ code: 403, message: "You are not a member of this room" });
    }

    const users = room.users.map((u) => {
      const infoUser = u.user_id as any;
      infoUser.role_room = u.role_room;
      return infoUser;
    });
    const result = { ...room, users };

    res.status(200).json({ code: 200, message: "Get room chat by roomId successfully", result: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Patch /api/v1/room-chat/update/:roomId
export const updateRoomChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.id;
    const { roomId } = req.params;

    const room = await RoomChat.findOne({ _id: roomId, deleted: false });

    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    const isUserInRoom = room.users.some((u) => u.user_id._id.toString() === currentUserId);
    if (!isUserInRoom) {
      return res.status(403).json({ code: 403, message: "You are not a member of this room" });
    }

    await RoomChat.updateOne({ _id: roomId }, { $set: req.body }, { runValidators: true });

    res.status(200).json({ code: 200, message: "Update room chat successfully" });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Post /api/v1/room-chat/add-user/:roomId
export const addUserInRoomChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.id;
    const { roomId } = req.params;
    const { usersId }: { usersId: string[] } = req.body;

    if (!Array.isArray(usersId) || usersId.length === 0) {
      return res.status(400).json({ code: 400, message: "userIds must be a non-empty array" });
    }

    const room = await RoomChat.findOne({ _id: roomId, deleted: false });

    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    const isMyUserInRoom = room.users.some((u) => u.user_id._id.toString() === currentUserId);
    if (!isMyUserInRoom) {
      return res.status(403).json({ code: 403, message: "You are not a member of this room" });
    }

    const existingUsersId = room.users.map((u) => u.user_id.toString());
    const newUsersId = usersId.filter((id: string) => !existingUsersId.includes(id));
    if (newUsersId.length === 0) {
      return res.status(400).json({ code: 400, message: "All users already in the room" });
    }

    const newUsers = newUsersId.map((id: string) => ({ user_id: id, role_room: "user" }));

    await RoomChat.updateOne({ _id: roomId }, { $push: { users: { $each: newUsers } } }, { runValidators: true });

    res.status(200).json({ code: 200, message: "Add user in room chat successfully", result: newUsersId });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};

// Delete /api/v1/room-chat/:roomId/users/:userId
export const removeUserInRoomChat = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.id;
    const { roomId, userId } = req.params;

    const room = await RoomChat.findOne({ _id: roomId, deleted: false });

    if (!room) {
      return res.status(404).json({ code: 404, message: "Room not found" });
    }

    const currentUserInRoom = room.users.find((u) => u.user_id.toString() === currentUserId);
    if (!currentUserInRoom) {
      return res.status(403).json({ code: 403, message: "You are not a member of this room" });
    }

    if (currentUserInRoom.role_room !== "superAdmin") {
      return res.status(403).json({ code: 403, message: "Only superAdmin can remove users" });
    }

    if (currentUserId === userId) {
      return res.status(400).json({ code: 400, message: "You cannot remove yourself" });
    }

    const targetUser = room.users.find((u) => u.user_id.toString() === userId);
    if (!targetUser) {
      return res.status(404).json({ code: 404, message: "User to remove is not in the room" });
    }

    await RoomChat.updateOne({ _id: roomId }, { $pull: { users: { user_id: userId } } }, { runValidators: true });

    res.status(200).json({ code: 200, message: "User removed from room successfully" });
  } catch (error) {
    res.status(500).json({ code: 500, message: error.message });
  }
};
