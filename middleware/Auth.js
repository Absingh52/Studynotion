const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();

exports.verifyToken= async(req,res,next)=>{
    const token =req.cookies.token || req.headers("authorization").replace("Bearer"," ")


    if(!token)
        return res.status(403).json({
            sucess:false,
            message:"No token provided"
        })
         try{
            const decoded =jwt.verify(token,process.env.JWT_SECRET)
            req.user=decoded
            next()
         }catch(error){
            return res.status(401).json({
                sucess:false,
                message:"Invalid token"
            })
         }
}

exports.checkRole =(role)=>{
    return (req,res,next)=>{
        if(req.user.role !== role){
            return res.status(403).json({
                sucess:false,
                message:"You are not authorized to access this resource"
            })
        }
        next()
    }
}