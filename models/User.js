const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const { trim } = require('validator');
const userSchema =new mongoose.Schema({

    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    number:{
        type:Number,
        required:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    accountType:{
        type:String,
        enum:['admin','student','teacher'],
        required:true,
    },

    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    image:{
        type:String,
        required:true
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress"
    }],

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpires: {
        type: Date,
    }

})

// hash before saving
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
        return next ()
    try{
        this.password= await bcrypt.hash(this.password,10)
        next()
    }catch(error){
        return next(error)
    }
})

// compoare password with save one
 userSchema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password,this.password)
 }
module.exports =mongoose.model('user',userSchema);