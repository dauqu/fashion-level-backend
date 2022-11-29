const jwt = require('jsonwebtoken');

const tokenIsValid = (req, res, next) => {
    let token = req.headers["x-auth-token"] || req.cookies.auth_token || req.body.token;
    if (token == undefined || token == null || token == "") {
        return res.json(false);
      }
    
      const have_valid_tokem = jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: "HS256",
      });
    
      if (!have_valid_tokem) {
        return res.json(false);
      }
      next();
}

module.exports = tokenIsValid;