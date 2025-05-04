// importing required Modules
import { AsyncHandler } from "../../Utils/AsyncHandler.js";
import User from "../../Models/User.model.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import {
  EmailVerificationMailgenContent,
  ForgotPasswordMailgenContent,
  sendMail,
} from "../../Utils/Email.Shooter.js";
import { error } from "console";
import bcrypt from "bcryptjs";

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
      error: "User Already Exists",
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
      error: "Internal Server Error(register Fn)",
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
  sendMail({
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
      error: "Invalid Token(Not Recieved)",
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
      error: "Invalid Token",
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
export const GetProfile = AsyncHandler(async (req, res) => {
  // Extract data from req.user
  // check if the user exists or not
  // if yes then send the user details
  // if not then send a response that user not found

  // extracting data from req.user
  const { id } = req.user;

  // checking if the user exists or not
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return res.status(404).json({
      error: "User Not Found",
      success: false,
    });
  }

  return res.status(200).json({
    messsage: "Successfully Fetched User Details",
    User: {
      Username: existingUser.username,
      Fullname: existingUser.fullName,
      Email: existingUser.email,
    },
  });
});
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
      error: "User Not Found",
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
export const ForgotPasswordRequest = AsyncHandler(async (req, res) => {
  // Extract the given email from req.body
  // Check if the user exists or not
  // if yes then send a email to the user with a link to reset his/her password
  // if not then send a response that user not found

  // Extracting email from req.body
  const { email } = req.body;

  // Checking if the user really exists or not in the database
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({
      error: "User Not Found",
      success: false,
    });
  }

  // Creating a Token
  const ResetPasswordToken = crypto.randomBytes(8).toString("hex");
  existingUser.forgotPasswordToken = ResetPasswordToken;
  existingUser.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Saving to the Database
  await existingUser.save();

  // Sending Email to Client for password reset
  await sendMail({
    email: existingUser.email,
    subject: "Reset your Password",
    MailgenContent: ForgotPasswordMailgenContent(
      existingUser.username,
      `${process.env.BASE_URL}/users/Reset-Password/${ResetPasswordToken}`,
    ),
  });

  console.log("Mail sended");

  // Sending the response
  return res.status(200).json({
    message: "Password reset link sent to your email",
    success: true,
  });
});

export const ResetForgotenPassword = AsyncHandler(async (req, res) => {
  // extraact the token from req.params
  // extract the new and confirm password fields from req.body
  // check if the user exists or not based on the given token
  // if yes then re-write the password and set the forgotPasswordToken and forgotPasswordExpiry to undefined
  // save the user
  // send a response

  // Extracting Data
  const { Token } = req.params;
  const { Newpassword, ConfirmPassword } = req.body;

  // Checking if we got the token or not
  if (!Token) {
    return res.status(400).json({
      error: "Token Not recieved",
      success: false,
    });
  }

  // checking if the two password matches each other or not
  if (Newpassword !== ConfirmPassword) {
    return res.status(400).json({
      error: "PNew Password Doesn't Match , Enter New Password Again",
      success: false,
    });
  }

  // check if the user exists or not
  const ExistingUser = await User.findOne({
    forgotPasswordToken: Token,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!ExistingUser) {
    return res.status(400).json({
      error: "Invalid Token",
      success: false,
    });
  }
 
  // Check if the Old Password matches With New Password or not
  if (await bcrypt.compare(Newpassword, ExistingUser.password)) {
    return res.status(400).json({
      error: "You cannot use your old password",
      success: false,
    });
  }

  // Re-setting the Password
  ExistingUser.password = Newpassword;
  ExistingUser.forgotPasswordToken = undefined;
  ExistingUser.forgotPasswordExpiry = undefined;

  // Saving to the Database
  await ExistingUser.save();

  // Sending Response
  return res.status(200).json({
    message: "Password Reset Successfully",
    success: true,
  });
});
export const ChangeCurrentPassword = AsyncHandler(async (req, res) => {
  // Extract the Password fields from req.body
  // check if newPassword and confirm password are same or not
  // if same check if the user exists or not based on the data user id recived from req.user
  // if yes then check if the old password is same as the new one
  // if not then update the password and send a response

  // Extracting data
  const { OldPassword, NewPassword, ConfirmPassword } = req.body;
  const { id } = req.user;

  // Checking if newPassword and confirm password are same or not
  if (NewPassword !== ConfirmPassword) {
    console.log(NewPassword, ConfirmPassword);
    
    return res.status(400).json({
      error: "New Password Doesn't Match , Enter New Password Again",
      success: false,
    });
  }

  // Checking if the user exists
  const existingUser = await User.findById(id);

  if (!existingUser) {
    return res.status(404).json({
      error: "User Not Found",
      success: false,
    });
  }

  // checking if the Old password is same as the new one or not and the provided old password is correct or not
  if (!await bcrypt.compare(OldPassword, existingUser.password)) {
    return res.status(400).json({
      error: "Your old password was entered incorrectly, Please enter it again",
      success: false,
    });
  }

  if (await bcrypt.compare(NewPassword, existingUser.password)) {
    return res.status(400).json({
      error: "You cannot use your old password",
      success: false,
    });
  }

  // updating the password and saving the data
  existingUser.password = NewPassword;
  await existingUser.save();

  // sending response
  return res.status(200).json({
    message: "Password Updated Successfully",
    success: true,
  });
});
export const RefreashAcessToken = AsyncHandler(async (req, res) => {});
