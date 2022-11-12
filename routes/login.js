const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users_schema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const SendMail = require("../options/send_email");
const sendSMS = require("../options/send_sms");

router.get("/", (req, res) => {
  sendSMS("+919369390970", "123456");
  res.json({
    message: "Welcome to the API",
  });
});

//User Login
router.post("/", checkUser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsersSchema.findOne({ email }).lean();
    if (!user)
      return res
        .status(400)
        .json({ message: "User and password is wrong.", status: "warning" });
    const hashpass = user.password;
    if (!bcrypt.compareSync(password, hashpass))
      return res
        .status(400)
        .json({ message: "User and password is wrong.", status: "warning" });
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
      }
    );

    //Set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 300,
      sameSite: "none",
      secure: true,
    }); //300 days

    res.setHeader("x-auth-token", token);

    SendMail(email, "Verify your OTP", "Your OTP is 123456");

    res
      .status(200)
      .json({ message: "Login Successful", status: "success", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Check User is login or not
router.get("/isLoggedIn", async (req, res) => {
  const token = req.headers["x-auth-token"] || req.cookies.auth_token || req.body.token;

  if (token == undefined || token == null || token == "") {
    return res.json(false);
  }

  const have_valid_tokem = jwt.verify(token, process.env.JWT_SECRET, {
    algorithm: "HS256",
  });

  if (!have_valid_tokem) {
    return res.json(false);
  }

  const id_from_token = have_valid_tokem.id;

  //Check Same id have database
  const user = await UsersSchema.findOne({ id_from_token }).lean();

  if (user == undefined || user == null || user == "") {
    res.json(false);
  } else {
    res.json(true);
  }
});

async function checkUser(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  //Check all filled or not
  if (
    email == "" ||
    password == "" ||
    email == undefined ||
    password == undefined ||
    email == null ||
    password == null
  ) {
    return res
      .status(400)
      .json({ message: "Please fill all fields", status: "warning" });
  }
  //Check email is valid or not
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email", status: "warning" });
  }

  //Check password is valid or not
  if (req.body.password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
      status: "warning",
    });
  }
  next();
}

module.exports = router;