const Tag = require('../models/Tags');
// create the tag 
exports.createTag= async (req,res)=>{

    try{

        const {name,description}=req.body;
        
        // validation
        if(!name || ! description){
            res.status(400).json({
                sucess:false,
                message:"fields are required",
            })
        }

        const tag =await Tag.create(
            {
                name:name.trim(),
                description:description.trim(),
            }
        )
        return res.status(200).json({
            sucess:true,
            message:"tag created sucessfully",
            tag
        })
    }catch(error){
        return res.status(500).json(
            { success: false,
              message: "Failed to create tag", error: error.message
             });
    }
}

// fetch tag 

exports.fetchTag=async(req,res)=>{
    try{
        const tag= await Tag.find().populate("course");
          return res.status(200).json({
            sucess:true,
            message:"tag fetched sucessfully",
            tag
        })


    }catch(error){
       return res.status(500).json(
            { success: false,
              message: "Failed to fetch tag", error: error.message
             });
    }
    }

