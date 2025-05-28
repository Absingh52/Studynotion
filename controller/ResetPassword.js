const OTP=require('../models/OTP')
const crypto = require('crypto');
const User=require('../models/User')
const {mailSend}=('../utils/mailSender')
const validator=require('validator');

exports.forgetPassword= async(req,res)=>{
    const {email}=req.body;
    const exist= await User.findOne({email})
    if(!exist){
        return res.status(400).json({
            success:false,
            message:"user not exist"

        })
    }
    const user=exist;
    
    const resetToken=crypto.randomBytes(32).toString('hex');
    const hashToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken=hashToken;
    user.resetTokenExpiry=Date.now()+30*60*1000;
    
    await user.save();
    
    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

    await mailSend(email,resetURL)

}
 exports.resetPassword= async(req,res)=>{
    try{
        const {newPassword,confirmPassword,token}=req.body;

        if(validator.isEmpty(newPassword) || validator.isEmpty(confirmPassword)){
            return res.status(400).json({
            success:false,
            message:"Please fill both the fields",
            error:"you havent both the fields"
        })
        }
           if(!validator.isStrongPassword(newPassword,{
                  minLength: 8,
                  minLength: 8,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 1,
                  minSymbols: 1,
        
            })){
                 return res.status(400).json({
                    success:false,
                    message:"Password must include uppercase, lowercase, number, symbol, and be at least 8 characters long."
                 })
            }
            if(newPassword !== confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"New password is not same to confirm Password."
                 })
            }
         
        const hashToken=crypto.createHash('sha256').update(token).digest('hex');

        const user= await User.findOne({
            resetPasswordToken:hashToken,
            resetPasswordExpires:{ $gt: Date.now() },
        })
        if(!user){
             return res.status(400).json({
            success:false,
            message:"Token is invalid "

        })
        }
     
            user.password = newPassword;
            user.resetPasswordToken=undefined;
            user.resetPasswordExpires=undefined;

            await user.save()
            
            res.status(200).json({
                success:true,
                message:'Password has been reset successfully'
            })

    }catch(error){
          res.status(400).json({
                success:false,
                message:`error occured while changing password ${error}`
            })
    }
 }
 exports.changePassword= async (req,res)=>{
    try{
        const {newPassword,oldPassword,confirmPassword}=req.body
        const userid=req.user.id

        const user= await User.findOne(userid.select('+password'));
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not Found",
            })
        }
        const isMatched= await user.comparePassword(oldPassword)
        if(!isMatched){
             return res.status(400).json({
                success:false,
                message:"User not Found",
            })
        }
         if(validator.isEmpty(newPassword) || validator.isEmpty(confirmPassword)){
            return res.status(400).json({
            success:false,
            message:"Please fill both the fields",
            error:"you havent both the fields"
        })
        }
           if(!validator.isStrongPassword(newPassword,{
                  minLength: 8,
                  minLength: 8,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 1,
                  minSymbols: 1,
        
            })){
                 return res.status(400).json({
                    success:false,
                    message:"Password must include uppercase, lowercase, number, symbol, and be at least 8 characters long."
                 })
            }
            if(newPassword !== confirmPassword){
                return res.status(400).json({
                    success:false,
                    message:"New password is not same to confirm Password."
                 })
            }

            user.password=newPassword;
            await user.save()
           res.status(200).json({
                success:true,
                message:'Password has been reset successfully'
            })


    }catch(error){

        res.status(400).json({
                success:false,
                message:`error occured while changing password ${error}`
            })
    }
 }