const otpGenerator=require('otp-generator')
const OTP=require('../models/OTP')
const User=require('../models/User')
const {otpMail}=require('../utils/mailSender')
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const User = require('../models/User');
const { mailSend } = require('../utils/mailSender');

exports.otpGeneration = async (email) => {
  try {
    // Check if user already exists
    const exist = await User.findOne({ email });
    if (exist) {
      // Just return an error indicator. Let your controller handle the response.
      return { success: false, message: 'User already exists' };
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      digits: true,
      specialChars: false,
    });

    // Remove any old OTPs for this email
    await OTP.deleteMany({ email });

    // Save the new OTP (hashed via pre-save)
    await OTP.create({ email, otp });

    // Send OTP via email
   const sendMail= await otpMail(email, otp);
    if(!sendMail.success){
      return {
        success:false,
        message:"faild to send the mail "
      }
    }
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error during OTP generation:', error);
    return { success: false, message: 'Failed to generate or send OTP' };
  }
};



// verification

exports.optVerification= async(req,res)=>{
    try{
            const{email,otp}=req.body;
            const record = await OTP.findOne({email})
            if(!record){
                return res.status(400).json({
                    success:false,
                    message:"OTP is invalid or Not Found"
                })
            }
            const isValid= await record.compareOtp(otp)
            if(!isValid){
                  return res.status(400).json({
                    success:false,
                    message:"OTP is invalid "
                })
            }
            await OTP.deleteMany({email})
             res.status(200).json({ success: true, message: 'Email verified successfully' });
    }catch(error){
         return res.status(400).json({
                    success:false,
                    message:`OTP is invalid ${error}`
                })
    }
}
