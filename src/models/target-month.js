const mongoose =require("mongoose");

const targetmSchema=new mongoose.Schema({
    target:{
         type:Number,
         required:true
    },
    status:{
        type:Number,
        required:true
    }
    ,
    month:{
        
        type:Number
        

        
    },
    year:{
        type:Number
    }

})
const Targetmonth=new mongoose.model("Target-month",targetmSchema);
module.exports=Targetmonth;