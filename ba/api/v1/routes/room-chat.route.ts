import { Router } from "express";
const router: Router = Router();
import * as controllerRoomChat from "../controllers/room-chat.controller";

router.post("/create", controllerRoomChat.createRoomChat);

router.post("/add-user/:roomId/", controllerRoomChat.addUserInRoomChat);

router.patch("/update/:roomId", controllerRoomChat.updateRoomChat);

router.get("/list-room", controllerRoomChat.listRoomChat);

router.get("/info/:roomId", controllerRoomChat.getRoomChatByRoomId);

router.delete('/:roomId/users/:userId', controllerRoomChat.removeUserInRoomChat);

export const roomChatRoute: Router = router;
