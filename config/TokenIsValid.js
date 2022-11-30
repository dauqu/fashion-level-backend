const jwt = require('jsonwebtoken');

const tokenIsValid = (req, res, next) => {
    let token = req.headers["x-auth-token"] || req.cookies.auth_token || req.body.token;
    if (token == undefined || token == null || token == "") {
        return res.json({message: "provide token"});
      }
    
      try{

        const have_valid_tokem = jwt.verify(token, process.env.JWT_SECRET, {
          algorithm: "HS256",
        });
        if(!have_valid_tokem){
          return res.json({message: "token is not valid", status: "warning"});
        }
      }catch(e){
        return res.json({message: "This token is not valid", status: "warning"});
      }
    
      next();
}

module.exports = tokenIsValid;