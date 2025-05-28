const nodemailer = require('nodemailer');
require('dotenv').config();
const OTP=require('../models/OTP')
 exports.otpMail = async (userEmail,otp)=>{
    
      try{
          const transporter= nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:userEmail,
            subject: 'Your OTP Verification Code',
             text: `Your One-Time Password (OTP) is: ${otp}`,
            html: `<h1>Your OTP: <strong>${otp}</strong></h1>`
        })
        return { success: true, message: 'OTP sent successfully' };
      }catch(error){
         console.error('Error sending OTP:', error.message);
         throw new Error('Failed to send OTP email');
      }


}
exports.mailSend= async(userEmail,resetLink)=>{
      try{
          const transporter= nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:userEmail,
            subject: 'Your reset Password Link',
           text: `You requested to reset your password. Please use the following link to reset it: ${resetLink}`,
           html: `<p>You requested to reset your password. Please click the link below to reset it:</p>
             <a href="${resetLink}">${resetLink}</a>`,
        })
        return { success: true, message: ' password reset link email sent successfully' };
      }catch(error){
         console.error('Error sending reset password mail :', error.message);
         throw new Error('Failed to send  email');
      }
}