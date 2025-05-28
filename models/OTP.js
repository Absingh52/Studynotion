const mongoose = require('mongoose');
const bcrypt=require('bcrypt')

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        required:true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})
// hash and save 
OTPSchema.pre("save",async function(next) {
    if(!this.isModified('otp'))
        return next();
    this.otp= await bcrypt.hash(this.otp,10);
    next()
    
})
// compare 
OTPSchema.methods.compareOtp= async function(otp) {
   return await bcrypt.compare(otp,this.otp);
    
}
module.exports = mongoose.model("OTP",OTPSchema); 