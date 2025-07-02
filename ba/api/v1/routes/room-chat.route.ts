import { Router } from "express";
const router: Router = Router();
import * as controllerRoomChat from "../controllers/room-chat.controller";

router.post("/create", controllerRoomChat.createRoomChat);

router.post("/add-user/:roomId/", controllerRoomChat.addUserInRoomChat);

router.patch("/update/:roomId", controllerRoomChat.updateRoomChat);

router.get("/list-room", controllerRoomChat.listRoomChat);

router.get("/info/:roomId", controllerRoomChat.getRoomChatByRoomId);

router.delete("/:roomId/users/:userId", controllerRoomChat.removeUserInRoomChat);

router.delete("/:roomId/leave", controllerRoomChat.leaveRoomChat);

router.patch('/:roomId/change-super-admin/:userId', controllerRoomChat.changeSuperAdmin);

router.patch("/:roomId/change-role-room", controllerRoomChat.changeRoleRoom);

export const roomChatRoute: Router = router;
