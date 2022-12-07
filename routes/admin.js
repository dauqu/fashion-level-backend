const router = require("express").Router();
const Admin = require("../models/admin_schema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//Create One admin
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashed_password = await bcrypt.hash(password, 10);

        const get_all_admins = await Admin.find();
        if (get_all_admins.length >= 1) {
            return res.status(403).json({ message: "Cannot create more admins", status: "warning" })
        }

        const new_admins = new Admin({ username, password: hashed_password });
        await new_admins.save();
        return res.status(200).json({ message: "Admin created", status: "success" })
    } catch (error) {
        return res.status(200).json({ message: e.message, status: "error" })
    }
});

// test
router.get("/logout", async (req, res) => {
        res.clearCookie("auth_token");
        res.end();
        // res.status(200).json({message: "User has Logged out.", status: "success"})
})

// admin login 
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).lean();
    if (!admin)
        return res
            .status(400)
            .json({ message: "Admin not found.", status: "warning" });

    const hashpass = admin.password;
    if (!bcrypt.compareSync(password, hashpass))
        return res
            .status(400)
            .json({ message: "Password is wrong.", status: "warning" });


    const token = jwt.sign(
        {
            id: admin._id,
            username: admin.username,
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
        secure: true,
        sameSite: "none",
    }); 
    
    res.setHeader("x-auth-token", token);
    res.cookie("auth_token", token); 
    res.status(200)
        .json({ message: "Login Successful", status: "success", token: token });

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
    const admin = await Admin.findOne({ id_from_token }).lean();

    if (admin == undefined || admin == null || admin == "") {
        res.json(false);
    } else {
        res.json(true);
    }
});



module.exports = router;