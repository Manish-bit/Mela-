const jwt = require('jsonwebtoken')



//verifying jwt token
const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.PASS_SEC, (err,user)=>{
            if(err)
            {
                return res.status(403).json("Token is not valid");
            }
            req.user = user;
            next();
        })

    }
    else{
        return res.status(401).json("You are not authorized")
    }

}



//verifying jwt token along with id verification for  editing
const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
                next();
        }
        else{
            res.status(403).json("You are not allowed to do that")
        }
    })
}



//verifying jwt along with user as admin
const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
                next();
        }
        else{
            res.status(403).json("You are not allowed to do that")
        }
    })
}

module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}