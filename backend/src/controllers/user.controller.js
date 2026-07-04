import UserModel from "../models/user.model.js";
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendServerError,
  sendSuccess,
} from "../utils/response.js";
import sendOtpMail from "../utils/sendOtpMail.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.API_SECRET);

import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ name: name });
    console.log(user);
    if (user) return sendConflict(res, "User already exists");
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = Date.now() + 3 * 60 * 1000;
    const mailReponse = await sendOtpMail(email, otp);
    console.log(mailReponse, "mailResponse");
    const passwordHash = cryptr.encrypt(password);
    await UserModel.create({
      name,
      email,
      password: passwordHash,
      otp,
      otpExpire,
    });
    return res.status(201).json({
      user: email,
      success: true,
      message:
        "User registered successfully. Please check your email for OTP verification.",
    });
  } catch (error) {
    console.log(error, "error");
    sendServerError(res, "Internal Server Error");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return sendConflict(res, "User not found");
    if (user.otp != otp) return sendConflict(res, "Invalid OTP");
    if (Date.now() > user.otpExpire) return sendConflict(res, "OTP expired");
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    return sendSuccess(res, "User verified successfully.");
  } catch (error) {
    console.log(error, "error");
    sendServerError(res, "Internal Server Error");
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return sendConflict(res, "User not found");
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = Date.now() + 3 * 60 * 1000;
    const mailReponse = await sendOtpMail(email, otp);
    // console.log(mailReponse, "mailResponse")
    user.otp = otp;
    user.otpExpire = otpExpire;
    await user.save();
    return sendSuccess(
      res,
      "OTP resent successfully. Please check your email.",
    );
  } catch (error) {
    console.log(error, "error");
    sendServerError(res, "Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return sendConflict(res, "User not found");
    const decryptedPassword = cryptr.decrypt(user.password);

    if (decryptedPassword != password)
      return sendConflict(res, "Invalid credentials");
    if (!user.isVerified)
      return sendConflict(res, "Please verify your email before logging in");
    //Send Cookie
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Expires after 15 minutes (in milliseconds)
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: false, // Sent over HTTPS only in production
      sameSite: "lax", // Protects against CSRF attacks
    });
    return sendSuccess(res, "Login successful", { user });
  } catch (error) {
    console.log(error, "error");
    sendServerError(res, "Internal Server Error");
  }
};

const googleLogin = async (req, res) => {
  try {
    const { name, email, photo, uid } = req.body;

    let user = await UserModel.findOne({ email });

    // Agar user nahi hai to create karo
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        image: photo,
        googleId: uid,
        isVerified: true,
        password: "", // Google user ke liye password zaruri nahi
      });
    }

    // JWT
    const token = generateToken(user._id);

    res.cookie("jwt", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return sendSuccess(res, "Google Login Successful", { user });
  } catch (error) {
    console.log(error);
    sendServerError(res, "Internal Server Error");
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendConflict(res, "User not found");
    return res
      .status(200)
      .json({
        success: true,
        message: "User profile fetched successfully",
        user: user,
      });
  } catch (error) {
    console.log(error, "error");

    sendServerError(res, "Internal Server Error");
  }
};

const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = req.body;

    const user = await UserModel.findById({ _id: userId });
    user.addresses.push(address);
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const logout = (req, res) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({
      success: false,
      message: "User is not logged in Please log in first",
    });
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};


// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);

//     user.otp = otp;
//     user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

//     await user.save();

//     await sendOtpMail(
//       email,
//       "Reset Password OTP",
//       `<h2>Your OTP is ${otp}</h2>
//        <p>This OTP is valid for 10 minutes.</p>`,
//     );

//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };


const forgotPassword = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    let user;

    if (email) {
      user = await UserModel.findOne({ email });
    } else if (mobile) {
      user = await UserModel.findOne({ mobile });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile is required",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    if (email) {
       await sendOtpMail(
      email,
      "Reset Password OTP",
      `<h2>Your OTP is ${otp}</h2>
       <p>This OTP is valid for 10 minutes.</p>`,
    );
    } else {
      
      // Send OTP on Mobile using SMS provider
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const resetPassword = async (req, res) => {

  try {
    const { email, otp, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    // const hashPassword = await cryptr.hash(password, 10);

    // user.password = hashPassword;
    // user.otp = null;
    // user.otpExpire = null;


const encryptedPassword = cryptr.encrypt(password);

user.password = encryptedPassword;
user.otp = undefined;
user.otpExpire = undefined;

await user.save();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  forgotPassword,
  resetPassword,
  register,
  verifyOtp,
  resendOtp,
  login,
  getProfile,
  addAddress,
  logout,
  googleLogin,
};
