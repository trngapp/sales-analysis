const mongoose =require("mongoose");

const targetySchema=new mongoose.Schema({
    target:{
         type:Number,
         required:true
    },
    status:{
        type:Number,
        required:true
    }
    ,
    year:{
        type:Number,
        unique:true
    }

})
const Targetyear=new mongoose.model("Target-year",targetySchema);
module.exports=Targetyear;