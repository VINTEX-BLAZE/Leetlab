// importing required Modules

import { AsyncHandler } from "../Utils/AsyncHandler";
import JWT from "jsonwebtoken";

export const IfLoggedIn = AsyncHandler(async (req, res, next) => {
  const JwtToken = req.Cookie?.Token;

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
});
