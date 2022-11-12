const express = require('express');
const router = express.Router();
const UsersSchema = require("../models/users_schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SendSMS = require('../options/send_sms');
const SendMail = require('../options/send_email');

//Get account details
router.get('/', async (req, res) => {
    const token = req.cookies.auth_token || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", status: "error" });
        }
        return user;
    });

    //Get user details by id
    UsersSchema.findById(user.id, (err, user) => {
        if (err) {
            return res.status(500).json({ message: err.message, status: "error" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found", status: "error" });
        }
        res.status(200).json({ message: "User found", status: "success", user: user });
    });
});


//Send OTP Email
router.post('/send-otp-email', async (req, res) => {
    const token = req.cookies.auth_token || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", status: "error" });
        }
        return user;
    });

    //Get user details by id
    const userFound = await UsersSchema.findById(user.id);
    if (!userFound) {
        return res.status(404).json({ message: "User not found", status: "error" });
    }

    //Check if phone number is verified
    if (userFound.email_verified) {
        return res.status(400).json({ message: "Email is already verified", status: "error" });
    }

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    //Update user
    const updateOTP = await UsersSchema.findByIdAndUpdate(user.id, { otp: otp }, { new: true });
    if (!updateOTP) {
        return res.status(500).json({ message: "Error sending OTP", status: "error" });
    }

    //Send OTP Email
    SendMail(userFound.email, "Verify your OTP", "Your OTP is " + otp);

    res.status(200).json({ message: "OTP sent", status: "success" });
});

//Verify OTP Email 
router.post('/verify-email', async (req, res) => {
    const token = req.cookies.auth_token || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", status: "error" });
        }
        return user;
    });

    //Get user details by id
    const userFound = await UsersSchema.findById(user.id);
    if (!userFound) {
        return res.status(404).json({ message: "User not found", status: "error" });
    }

    //Check if email is verified
    if (userFound.email_verified === true) {
        return res.status(400).json({ message: "Email already verified", status: "error" });
    }

    //Verify OTP
    if (userFound.otp != req.body.otp) {
        return res.status(400).json({ message: "OTP is wrong", status: "error" });
    }

    //Update user
    const userUpdated = await UsersSchema.findByIdAndUpdate(user.id, { email_verified: true }, { new: true });
    if (!userUpdated) {
        return res.status(500).json({ message: "Error verifying Email", status: "error" });
    }

    //Set otp to empty
    const userUpdatedOtp = await UsersSchema.findByIdAndUpdate(user.id, { otp: "" }, { new: true });
    if (!userUpdatedOtp) {
        return res.status(500).json({ message: "Error verifying Email", status: "error" });
    }

    res.status(200).json({ message: "Email Verified", status: "success", user: userUpdated });
});


//Send OTP Phone
router.post('/send-otp-phone', async (req, res) => {
    const token = req.cookies.auth_token || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", status: "error" });
        }
        return user;
    });

    //Get user details by id
    const userFound = await UsersSchema.findById(user.id);
    if (!userFound) {
        return res.status(404).json({ message: "User not found", status: "error" });
    }

    //Check if phone number is verified
    if (userFound.phone_verified) {
        return res.status(400).json({ message: "Phone number is already verified", status: "error" });
    }

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    //Update user
    const updateOTP = await UsersSchema.findByIdAndUpdate(user.id, { otp: otp }, { new: true });
    if (!updateOTP) {
        return res.status(500).json({ message: "Error sending OTP", status: "error" });
    }

    //Send OTP
    SendSMS("+91" + userFound.phone, otp);

    res.status(200).json({ message: "OTP sent", status: "success" });
});


//Verify OTP Phone
router.post('/verify-phone', async (req, res) => {
    const token = req.cookies.auth_token || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", status: "error" });
        }
        return user;
    });

    //Get user details by id
    const userFound = await UsersSchema.findById(user.id);
    if (!userFound) {
        return res.status(404).json({ message: "User not found", status: "error" });
    }

    //Check if phone number is verified
    if (userFound.phone_verified === true) {
        return res.status(400).json({ message: "Phone number is already verified", status: "error" });
    }

    //Verify OTP
    if (userFound.otp != req.body.otp) {
        return res.status(400).json({ message: "OTP is wrong", status: "error" });
    }

    //Update user
    const userUpdated = await UsersSchema.findByIdAndUpdate(user.id, { phone_verified: true }, { new: true });
    if (!userUpdated) {
        return res.status(500).json({ message: "Error verifying Phone", status: "error" });
    }

    //Set otp to empty
    const userUpdatedOtp = await UsersSchema.findByIdAndUpdate(user.id, { otp: "" }, { new: true });
    if (!userUpdatedOtp) {
        return res.status(500).json({ message: "Error verifying Phone", status: "error" });
    }

    res.status(200).json({ message: "Phone Verified", status: "success", user: userUpdated });
});


//Forgot Password
router.post('/change-password', async (req, res) => {
    const token = req.cookies.auth_token || req.headers['x-auth-token'] || req.body.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "error" });
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden", status: "error" });
        }
        return user;
    });

    //Get user details by id
    const userFound = await UsersSchema.findById(user.id);
    if (!userFound) {
        return res.status(404).json({ message: "User not found", status: "error" });
    }

    //Get old password
    const oldPassword = req.body.oldPassword;

    //Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, userFound.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Old Password is wrong", status: "error" });
    }

    //Get new password
    const newPassword = req.body.newPassword;

    //Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //Update user
    const userUpdated = await UsersSchema.findByIdAndUpdate(user.id, { password: hashedPassword }, { new: true });
    if (!userUpdated) {
        return res.status(500).json({ message: "Error updating password", status: "error" });
    }

    res.status(200).json({ message: "Password Updated", status: "success", user: userUpdated });
});


//Forgot Password
router.post('/forgot-password', async (req, res) => {
    //Get email
    const email = req.body.email;

    //Get user details by email
    const userFound = await UsersSchema.findOne({ email: email });
    if (!userFound) {
        return res.status(404).json({ message: "User not found", status: "error" });
    }

    //Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    //Update user
    const updateOTP = await UsersSchema.findByIdAndUpdate(userFound._id, { otp: otp }, { new: true });
    if (!updateOTP) {
        return res.status(500).json({ message: "Error sending OTP", status: "error" });
    }

    //Send OTP
    SendEmail(email, otp);

    res.status(200).json({ message: "OTP sent", status: "success" });
});



module.exports = router;