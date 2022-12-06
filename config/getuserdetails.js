const jwt = require("jsonwebtoken")

const getUserDetails = (res, token) => {
    if (!token) {
        return res.json({message: "Provide Token", status: "warning"});
    }

    //Get user details
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(500).json({message: "token is not valid", status: "warning"});
        }
        return user;
    });
    return user;
}

module.exports = getUserDetails;