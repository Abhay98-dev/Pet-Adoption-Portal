const jwt=require("jsonwebtoken");

function verifyToken(req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized access, token missing or invalid"}
        )
    }
    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user=decoded
        next()
    }catch(err){
        console.error("Token verification failed: ",err)
        return res.status(403).json({message:"Forbidden, invalid token"})
    }
}

module.exports = verifyToken;