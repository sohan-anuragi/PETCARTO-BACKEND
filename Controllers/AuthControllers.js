//EXTERNAL MODULE
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../model/authModel");
const jwt = require("jsonwebtoken");

const handleSignUp = async (req, res) => {
  console.log("THE SIGNUP DATA IN BACKEND-->", req.body);
  const errors = validationResult(req);
  const { email, registerPassword, firstName, lastName } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const isSignedIn = await User.findOne({ email });
  if (isSignedIn) {
    return res.json({
      success: false,
      message: "User already Exist",
    });
  }

  const hashedPassword = await bcrypt.hash(registerPassword, 10);

  const UserData = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  try {
    await UserData.save();
    res.status(201).json({
      message: "USER DATA SAVE SUCCESFULLY",
      success: true,
    });
    console.log("USER DATA SAVE SUCCESFULLY");
  } catch (err) {
    console.log("ERRORE WHILE USER DATA STORE IN DB --> ", err);
  }
};

//==============x===========x=============x=============x==============x=========x==========x=========x=

//LOGIN CONTROLLER
const handleLogin = async (req, res) => {
  console.log("LOGIN DATA ---> ", req.body);

  const { loginEmail, loginPassword } = req.body;

  const user = await User.findOne({ email: loginEmail });
  console.log("AND THE USER --> ", user);

  if (!user) {
    return res.json({
      success: false,
      message: "User does not Exist",
    });
  }

  //comparison of passwords
  const isMatch = await bcrypt.compare(loginPassword, user.password);

  if (!isMatch) {
    return res.json({
      success: false,
      message: "Incorrect password",
    });
  }

  //JWT token create
  const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "user logged in successfully",
  });
};

//AUTHENTICATE THE USER IS LOGGED IN OR NOT
const authenticated = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "user Not Logged in",
    });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    next();
  } catch (err) {
    console.log("ERRORE WHILE JWT VARIFICATION ", err);
  }
};

module.exports = {
  authenticated,
  handleSignUp,
  handleLogin,
};
