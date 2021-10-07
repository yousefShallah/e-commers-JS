const jwt = require('jsonwebtoken');

// verifyToken
const verifyToken = (req, res, next) => {
    // const authHeader = req.headers.token;
    const authHeader = req.headers['authorization'];

    if(authHeader){
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, {"token_type": "Bearer"}, (err, user) => {
            if(err){
                return res.status(403).json("Token Is Not Valid");
            } 
            else{
                req.user = user
            }
            next()
        })
    }
    else{
        return res.status(401).json("You Are Not Authenticated!")
    }
}

// virifyTokenAndAuth
const virifyTokenAndAuth = (req, res, next) => {
    verifyToken(req,res, () =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("you are not allowed to do that!")
        }
    })
}

// virifyTokenAndAdmin
const virifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req,res, () =>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("you are not allowed to do that!")
        }
    })
}
module.exports = {verifyToken, virifyTokenAndAuth, virifyTokenAndAdmin};