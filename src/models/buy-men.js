const mongoose =require("mongoose");

const menSchema=new mongoose.Schema({
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
const Men=new mongoose.model("Men",menSchema);
module.exports=Men;