// importing required Modules

import { AsyncHandler } from "../Utils/AsyncHandler.js";
import JWT from "jsonwebtoken";
import { validationResult } from "express-validator";

export const IfLoggedIn = AsyncHandler(async (req, res, next) => {
  const JwtToken = req.cookies?.Token;
  // Checking if token recived or not
  if (!JwtToken) {
    return res.status(400).json({
      messeage: "Invalid Token(Not Recieved)",
      success: false,
    });
  }

  // if token exists then check if tampared or not
  const Value = JWT.verify(JwtToken, process.env.ACCESS_TOKEN_SECRET);
  if (!Value) {
    return res.status(400).json({
      messeage: "Invalid Token",
      success: false,
    });
  }
  // After that  attach the decoded data with the req object
  req.user = Value;
  next();
});

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  // Checking if there's Any error
  if (errors.isEmpty()) {
    return next();
  }

  // Extracting the errors
  const ExtractedErrors = [];

  //  It's for Debuging perpose
  console.log(errors);

  errors.array().forEach((err) => {
    ExtractedErrors.push({ [err.path]: err.msg });
  });

  console.error("Errors : ", ExtractedErrors);
  return res.status(400).json({
    message: "Please Provide valide Credentials",
    errors: ExtractedErrors,
    success: false,
  });
};

export default validate;
