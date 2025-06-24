import { Router } from "express";
import multer from "multer";
const router: Router = Router();

const upload = multer();
import * as uploadCloud from "../../../middlewares/uploadCloud.middlewares";
import * as validateUser from "../../../validates/user.validate";
import * as authMiddleware from "../../../middlewares/auth.middleware";
import * as controller from "../controllers/user.controller";
// users

// login user
router.post("/auth/login", validateUser.login, controller.loginUser);

// register user
router.post("/auth/register", validateUser.register, controller.registerUser);

// update user
router.patch(
  "/update/:userId",
  authMiddleware.verifyToken,
  upload.single("avatar"),
  uploadCloud.upload,
  controller.updateUser
);

// get user info
router.get("/info/:userId", authMiddleware.verifyToken, controller.getUserInfo);

// get my profile
router.get("/my-profile", authMiddleware.verifyToken, controller.getMyProfile);

// sent confirm account
router.post("/sent-confirm-account", controller.sentConfirmAccount);

// confirm account
router.post("/confirm-account", controller.confirmAccount);

// sent forgot password
router.post(
  "/password/forgot",
  validateUser.forgotPasswordPost,
  controller.forgotPasswordPost
);

// otp forgot password
router.post("/password/otp", controller.otpPasswordPost);

// reset password
router.post(
  "/password/reset",
  authMiddleware.verifyToken,
  validateUser.resetPasswordPost,
  controller.resetPasswordPost
);

export const userRoutes: Router = router;
