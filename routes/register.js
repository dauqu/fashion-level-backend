const express = require("express");
const router = express.Router();
const User = require("../models/user_schema");
const bcrypt = require("bcryptjs");
const { response } = require("express");
// const SendMail = require("../options/send_email");

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

// add new user
router.post("/", validateRegister, async (req, res) => {
  //Hash password
  const hashed_password = await bcrypt.hash(req.body.password, 10);

  //Generate random number for OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save user to database

  const save_user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    dp: req?.body?.dp || "https://styles.redditmedia.com/t5_2c83sr/styles/profileIcon_4dwzf4syg0w51.png",
    phone_no: req.body.phone_no,
    phone_verified: false,
    email: req.body.email,
    email_verified: false,
    otp: otp,
    address: "Edit your profile to add your address",
    username: req.body.username,
    password: hashed_password,
    language: "english",
    country: "india",
  });

  try {
    await save_user.save();
    // SendMail(req.body.email, "Verify your email", otp);
    res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

//Middleware for register validation
async function validateRegister(req, res, next) {
  const { first_name, last_name, phone_no, email, username, password } = req.body;

  //Check if all fields are filled
  if (
    first_name === "" ||
    last_name === "" ||
    phone_no === "" ||
    email === "" ||
    username === "" ||
    password === "" ||
    first_name === undefined ||
    last_name === undefined ||
    phone_no === undefined ||
    email === undefined ||
    username === undefined ||
    password === undefined ||
    first_name === null ||
    last_name === null ||
    phone_no === null ||
    email === null ||
    username === null ||
    password === null
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required", status: "error" });
  }

  //Check password length
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
      status: "error",
    });
  }

  //Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      message: "Email already exists",
      status: "error",
    });

  //Check email is valid
  const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email_regex.test(email))
    return res.status(400).json({
      message: "Email is not valid",
      status: "error",
    });

  //Check Username is valid
  const username_regex = /^[a-zA-Z0-9]+$/;
  if (!username_regex.test(username))
    return res.status(400).json({
      message: "Username is not valid",
      status: "error",
    });

  //Check username is unique
  const user_exists = await User.findOne({ username: username });
  if (user_exists)
    return res.status(400).json({
      message: "Username is already taken",
      status: "error",
    });

  //Check phone is valid
  const phone_regex = /^[0-9]{10}$/;
  if (!phone_regex.test(phone_no))
    return res.status(400).json({
      message: "Phone is not valid",
      status: "error",
    });

  //Check phone is unique
  const phone_exists = await User.findOne({ phone_no: phone_no });
  if (phone_exists)
    return res.status(400).json({
      message: "Phone is already exists",
      status: "error",
    });

  next();
}

module.exports = router;