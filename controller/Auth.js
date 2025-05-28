const User = require('../models/User');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const otpGeneration=require('./OtpGeneration')
const validator=require('validator');

// create token 
const createToken=(user)=>{
    return jwt.sign({
         id:user._id,
         accountType:user.accountType,
         email:user.email,
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
)
}




// signup
exports.signUp= async(req,res)=>{
   try{
     let {firstName,lastName,email,password,number,accountType}=req.body;

   firstName=validator.trim(firstName);
     lastName=validator.trim(lastName);
     number=validator.trim(number);
     email=validator.normalizeEmail(email.trim())
     password=validator.trim(password)
    //  validations 
    if(validator.isEmpty(firstName) || validator.isEmpty(lastName) || validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(accountType) || validator.isEmpty(number)){
        return res.status(400).json({
            success:false,
            message:"Please fill all the fields",
            error:"you havent fill the fields"
        })
    }
    // is user exist
    const existUser= await User.findOne({email});
    if(existUser){
        return res.status(400).json({
            success:false,
            message:"User already exists",
            error:"user already exists"
        })
    }
    //number 
    if(!validator.isNumeric){
        return res.status(400).json({
                success:true,
                message:"please enter the numeric values "
        })
    }
    // email validation
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success:false,
            message:"invalid email address",
            error:"error email address is not valid "
        })
    }
    // password length and strength
    if(!validator.isStrongPassword(password,{
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
    const creatingOTP= await otpGeneration(email)
    if(!creatingOTP.success){
        return res.status(400).json({
            success: false,
            message: otpResponse.message,
             });
    }
     
    const user= await User.create({
        firstName,
        lastName,
        password,
        email,
        accountType
    })
    
    const token=createToken(user)
    //setcookie
    res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:24*60*60*1000
        
    })
    return res.status(200).json({
        success:true,
        message:"successfully signup welcome to studynotion"
        
    })
   }catch(error){
    return res.status(400).json({
        success:false,
        error:"error occured",
        message:"you cant signup sorry"
    })
   }
}

exports.logIn=async (req,res)=>{
    try{
        let {email,password,accountType}=req.body
        email=validator.normalizeEmail(email.trim());
        password=validator.trim();
        
        if(validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(accountType)){
            return res.status(400).json({
                success:false,
                message:"please fill the fields"
            })
        }

        const userExist= await User.findOne({email})
        if(!userExist){
            return res.status(400).json({
                success:false,
                message:"email not found"
            })
        }

        if(!validator.isEmail(email)){
            return  res.status(400).json({
                success:false,
                message:"email is invalid"
            })
        }
        const user=userExist

        const isMatched = await user.comparePassword(password)
        if(!isMatched){
              return res.status(400).json({
                success:false,
                message:"Password is incorrect "
            })
        }
        const token=createToken(user)
        // set cookie
        res.cookie('token',token({
            httpOnly:true,
            secure:true,
             sameSite:"strict",
            maxAge:24*60*60*1000
        
            
        }))
        return res.status(200).json({
        success: true,
        message: 'Successfully logged in!',
    });

    }catch(error){
          return res.status(500).json({
      success: false,
      message: 'Login failed due to server error',
      error: error.message,
    });
    }
}

