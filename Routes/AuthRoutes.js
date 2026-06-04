//EXTERNAL MODULES
const express = require("express");
const authRouter = express.Router();
const { body } = require("express-validator");

//INTERNAL MODULES
const AuthControllers = require("../Controllers/AuthControllers");

//HANDLE SIGNUP REQUEST
authRouter.post(
  "/user/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email please enter your valid email"),

    body("firstName")
      .notEmpty()
      .withMessage("Your first name is empty please enter your name"),

    body("registerPassword")
      .isLength({ min: 6 })
      .withMessage("Password is too short please create a strong password"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.registerPassword) {
        throw new Error("Confirm password do not match ");
      }

      return true;
    }),
  ],
  AuthControllers.handleSignUp,
);

//HANDLE LOGIN REQUEST
authRouter.post("/user/login", AuthControllers.handleLogin);

module.exports = authRouter;
