import { Router } from "express";
import multer from "multer";

const router: Router = Router();
const upload = multer();

import * as uploadCloud from "../../../middlewares/uploadCloud.middlewares";
import * as controllerChat from "../controllers/chat.controller";
import * as validateChat from "../../../validates/chat.validate";

router.post("/send", validateChat.sendMessage, controllerChat.sendMessage);
router.post(
  "/send-file",
  upload.single("file_url"),
  uploadCloud.upload,
  validateChat.sendFileMessage,
  controllerChat.sendFileMessage,
);

router.get("/:roomId", controllerChat.getMessages);

router.delete("/:chatId", controllerChat.deleteMessage);

export const chatRoute: Router = router;
