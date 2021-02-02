const jwt = require('jsonwebtoken');


module.exports = function (req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(500).json({"error":"Access Denied, Token is missing!"});
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(500).json({"error":"Invalid Token!"});
    }
}