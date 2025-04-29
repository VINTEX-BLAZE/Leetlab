// Importing required modules
import { body } from "express-validator";

export const registerValidation = () => {
  return [
    body("username").trim().notEmpty().withMessage("Please enter the Username"),
    body("fullname").trim().notEmpty().withMessage("Please enter the Fullname"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please enter the Email")
      .isEmail()
      .withMessage("Please enter a valid Email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter the Password")
      .isStrongPassword()
      .withMessage("Please enter a strong Password"),
  ];
};

export const LoginValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Please enter The Email")
      .isEmail()
      .withMessage("Please enter a valid Email"),
    body("password").trim().notEmpty().withMessage("Please enter The Password"),
  ];
};
