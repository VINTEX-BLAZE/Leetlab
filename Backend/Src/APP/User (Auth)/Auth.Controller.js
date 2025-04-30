// importing required Modules
import { AsyncHandler } from "../../Utils/AsyncHandler.js";
import User from "../../Models/User.model.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import {
  EmailVerificationMailgenContent,
  semdMail,
} from "../../Utils/Email.Shooter.js";

export const RegisterUser = AsyncHandler(async (req, res) => {
  // get data from req.body
  // Errors will be handeled by validator middleware,
  // check the user is exists or not in Databse
  // if not then create a new user, save it to database
  // send a response

  const { username, fullname, email, password } = req.body;

  // checking if the user exists in the Database
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User Already Exists",
      success: false,
    });
  }

  const NewUser = await User.create({
    username,
    fullName: fullname,
    email,
    password,
  });

  if (!NewUser) {
    return res.status(500).json({
      message: "Internal Server Error(register Fn)",
      success: false,
    });
  }

  // Signing A JWT and setting into client's Cokkie (Access Token)
  const Token = JWT.sign({ id: NewUser._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  // Creating a Refresh Token
  const RefreshToken = JWT.sign(
    { id: NewUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );

  res.cookie("Token", Token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  // Storing the Jwt in Database
  NewUser.accessToken = Token || undefined;
  NewUser.refreshToken = RefreshToken || undefined;
  NewUser.refreshTokenExpiery = Date.now() + 24 * 60 * 60 * 1000; // 1 day

  // Creating token for Email Verification
  const EmailVerificationToken = crypto.randomBytes(8).toString("hex");
  NewUser.emailVerificationToken = EmailVerificationToken;
  NewUser.emailVerificationExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Saving to the Databse
  await NewUser.save();

  // Sending Email to Client for email Verification
  semdMail({
    email,
    subject: "Email Verification",
    MailgenContent: EmailVerificationMailgenContent(
      NewUser.fullName,
      `${process.env.BASE_URL}/users/verify-email/${EmailVerificationToken}`,
    ),
  });

  return res.status(201).json({
    message: "User Created Successfully",
    success: true,
    userDetails: {
      Username: NewUser.username,
      Fullname: NewUser.fullName,
      email: NewUser.email,
    },
  });
});
export const VerifyEmail = AsyncHandler(async (req, res) => {
  // get the Token from req.params
  // check if the token is recived or not
  // check if the token holder really exists plus token is expired or not
  // if exists then change the isVerified field to true
  // set EmailVerificationToken and EmailVerificationExpiry to undefined
  // save the user
  // send a response

  // Extracting the token from params
  const { EmailVerificationToken } = req.params;

  // Checking if the token is recived or not
  if (!EmailVerificationToken) {
    return res.status(400).json({
      message: "Invalid Token(Not Recieved)",
      success: false,
    });
  }

  // Checking if the token holder is existis in the db as well as the token is still valid or not
  const user = await User.findOne({
    emailVerificationToken: EmailVerificationToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  // if user not found
  if (!user) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
    });
  }

  // if user found
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  // saving the Updated information into database
  await user.save();

  return res.status(200).json({
    message: "Email Verified Successfully",
    success: true,
  });
});
export const Login = AsyncHandler(async (req, res) => {
  // extract the data from req.body
  // check if the user has any token set in the cookies or not
  // if yes check if the user exists or not (based on the token assuming it as acess token)
  // if yes then make isLoggedIn true and create a acces token and refresh token and set the access token to the cookie and refresh the expiray limit of refresh token
  // if not then check if the user exists or not based on provided email
  // if yes then check if the password is correct or not
  // if yes then make isLoggedIn true and create a acces token and refresh token and set the access token to the cookie and refresh the expiray limit of refresh token
  // send a response that user logged in successfully
  // if not then send a response that user not found
});
export const GetProfile = AsyncHandler(async (req, res) => {});
export const LogOut = AsyncHandler(async (req, res) => {
  // extract the user details from req.user
  // check if the user exists or not
  // if yes then remove the access token and refresh token from the database and set the isLoggedIn to false
  // removing the cookie from the user's browser
  // send a response that user logged out successfully

  const { id } = req.user;

  // checking if the user exists or not
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return res.status(404).json({
      message: "User Not Found",
      success: false,
    });
  }

  // removing the AcessToken and Refresh Token from the database and setting isLoggedIn to false
  existingUser.isLoggedIn = false;
  existingUser.accessToken = undefined;
  existingUser.refreshToken = undefined;
  existingUser.refreshTokenExpiery = undefined;

  // removing the cookie from the user's browser
  res.clearCookie("Token");

  // sending response
  return res.status(200).json({
    message: "User Logged Out Successfully",
    success: true,
  });
});
export const ForgotPasswordRequest = AsyncHandler(async (req, res) => {});
export const ResetForgotenPassword = AsyncHandler(async (req, res) => {});
export const ChangeCurrentPassword = AsyncHandler(async (req, res) => {});
export const RefreashAcessToken = AsyncHandler(async (req, res) => {});
