const mongoose =require("mongoose");

const womenSchema=new mongoose.Schema({
    brand:{
        type:String,
        required:true
    }
    ,
    price:{
        type:Number,
        required:true
    }
    ,
    day:{
        type:Number
    }
    ,
    month:{
        type:Number
    },
    year:{
        type:Number
    }

})
const Women=new mongoose.model("Women",womenSchema);
module.exports=Women;