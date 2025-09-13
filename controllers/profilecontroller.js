const User=require("../models/register");

exports.getProfile= async (req,res)=>{

    try{
        const {userId}=req.params;
        const user=await User.findById(userId).select(" name email phone");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        else{
            res.status(200).json(user);
        }
    }
    catch(err){
        console.err("profile fetch err",err);
         res.status(500).json({ message: "Server error" });

    }

}