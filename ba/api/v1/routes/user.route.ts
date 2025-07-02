import { Router } from "express";
import multer from "multer";
const router: Router = Router();

const upload = multer();
import * as uploadCloud from "../../../middlewares/uploadCloud.middlewares";
import * as validateUser from "../../../validates/user.validate";
import * as authMiddleware from "../../../middlewares/auth.middleware";
import * as controllerUser from "../controllers/user.controller";
// users

// login user
router.post("/auth/login", validateUser.login, controllerUser.loginUser);

// register user
router.post("/auth/register", validateUser.register, controllerUser.registerUser);

// update user
router.patch(
  "/update/:userId",
  authMiddleware.verifyToken,
  upload.single("avatar"),
  uploadCloud.upload,
  controllerUser.updateUser,
);

// get user info
router.get("/info/:userId", authMiddleware.verifyToken, controllerUser.getUserInfo);

// get my profile
router.get("/my-profile", authMiddleware.verifyToken, controllerUser.getMyProfile);

// sent confirm account
router.post("/sent-confirm-account", controllerUser.sentConfirmAccount);

// confirm account
router.post("/confirm-account", controllerUser.confirmAccount);

// sent forgot password
router.post("/password/forgot", validateUser.forgotPasswordPost, controllerUser.forgotPasswordPost);

// otp forgot password
router.post("/password/otp", controllerUser.otpPasswordPost);

// reset password
router.post(
  "/password/reset",
  authMiddleware.verifyToken,
  validateUser.resetPasswordPost,
  controllerUser.resetPasswordPost,
);

export const userRoutes: Router = router;
