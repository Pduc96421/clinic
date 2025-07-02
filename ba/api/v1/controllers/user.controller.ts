import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import ForgotPassword from "../models/forgot-password.model";
import * as sendMailHelper from "../../../helpers/sendMail";
import * as generateHelper from "../../../helpers/generate";
import Doctor from "../models/doctor.model";

// Post /api/v1/users/auth/login
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);

    const user = await User.findOne(
      isEmail ? { email: username, deleted: false } : { username: username, deleted: false },
    ).select("+password +token");

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    if (!user.isConfirmed) {
      return res.status(405).json({ code: 405, message: "Unverified account" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ code: 401, message: "Invalid password" });
    }

    res.status(200).json({
      code: 200,
      message: "User login successful",
      result: user.token,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/auth/register
export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, fullName, email, dob, sex, password, role } = req.body;

    const existEmail = await User.findOne({ email: email, deleted: false });
    if (existEmail) {
      return res.status(400).json({ code: 400, message: "Email already exists" });
    }

    const existsUsername = await User.findOne({ username: username });
    if (existsUsername) {
      return res.status(400).json({ code: 400, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      fullName,
      email,
      dob,
      sex,
      password: hashedPassword,
      role,
    });

    if (role === "doctor") {
      await Doctor.create({ _id: newUser._id, user_id: newUser._id });
    }

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      // { expiresIn: "1d" }
    );
    newUser.token = token;

    await newUser.save();

    res.status(201).json({
      code: 201,
      message: "User registered successfully",
      result: newUser,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/sent-confirm-account
export const sentConfirmAccount = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    // 1: tạo mã otp và lưu otp, email yêu cầu vào collection
    const otp = generateHelper.generateRandomNumber(10);

    const objectConfirmAccount = {
      email: email,
      otp: otp,
      action: "ConfirmAccount",
      expireAt: Date.now(),
    };

    const confirmAccount = new ForgotPassword(objectConfirmAccount);
    await confirmAccount.save();
    // end tạo mã otp và lưu thông tin yêu cầu vào collection

    // 2:  gửi mã otp qua email của user
    const subject = "Mã OTP xác thực tài khoản.";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 5 phút. Vui lòng không cung cấp mã OTP cho người khác.`;

    sendMailHelper.sendEmail(email, subject, htmlSendMail);
    // end 2:  gửi mã otp qua email của user

    res.status(200).json({
      code: 200,
      message: "OTP confirm account sent to email successfully",
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/confirm-account
export const confirmAccount = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, otpConfirm } = req.body;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otpConfirm,
      action: "ConfirmAccount",
    });

    if (!result) {
      res.status(404).json({ code: 404, message: "Invalid OTP or email" });
    }

    await User.updateOne({ email: email, deleted: false }, { $set: { isConfirmed: true } });

    res.status(200).json({
      code: 200,
      message: "Email has been verified!",
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Patch /api/v1/users/update/:id
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const myUserId = req.user.id;

    if (req.user.role !== "admin") {
      if (userId !== myUserId) {
        return res.status(403).json({ code: 403, message: "You are not authorized to update this user" });
      }
    }

    await User.updateOne({ _id: userId, deleted: false }, { $set: updateData });
    const updatedUser = await User.findById(userId);

    res.status(200).json({ code: 200, message: "User updated successfully", result: updatedUser });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Get /api/v1/users/info/:userId
export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId, deleted: false });

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    res.status(200).json({
      code: 200,
      message: "User information retrieved successfully",
      result: user,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Get /api/v1/users/my-profile
export const getMyProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const myUserId = req.user.id;

    const user = await User.findOne({ _id: myUserId, deleted: false });

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    res.status(200).json({
      code: 200,
      message: "My profile retrieved successfully",
      result: user,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    // 1: tạo mã otp và lưu otp, email yêu cầu vào collection
    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
      email: email,
      otp: otp,
      action: "ForgotPassword",
      expireAt: Date.now(),
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    // end tạo mã otp và lưu thông tin yêu cầu vào collection

    // 2:  gửi mã otp qua email của user
    const subject = "Mã OTP lấy lại mật khẩu.";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 5 phút. Vui lòng không cung cấp mã OTP cho người khác.`;

    sendMailHelper.sendEmail(email, subject, htmlSendMail);
    // end 2:  gửi mã otp qua email của user

    res.status(200).json({
      code: 200,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/password/otp
export const otpPasswordPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, otp } = req.body;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp,
      action: "ForgotPassword",
    });

    if (!result) {
      res.status(404).json({ code: 404, message: "Invalid OTP or email" });
    }

    const user = await User.findOne({
      email: email,
      deleted: false,
    }).select("+token");

    res.status(200).json({
      code: 200,
      message: "OTP verified successfully",
      result: user.token,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/password/reset
export const resetPasswordPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId: string = req.user.id;

    const user = await User.findOne({ _id: userId, deleted: false }).select("+password");

    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ code: 401, message: "Invalid old password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ _id: userId, deleted: false }, { password: hashedNewPassword });

    res.status(200).json({
      code: 200,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};
