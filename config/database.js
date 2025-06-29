const mongoose = require('mongoose');
require('dotenv').config();

exports.connect= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL, {
            newUserParser:true,
            useUnifiedTopology:true,
          
        });
        console.log("Database connected successfully");
    

    }catch(error){
        console.error("Database connection failed :",error);
        process.exit(1)
    }
}