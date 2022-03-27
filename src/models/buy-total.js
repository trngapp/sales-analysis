const mongoose =require("mongoose");

const totalSchema=new mongoose.Schema({
    gender:{
         type:String,
         required:true
    },
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
const Total=new mongoose.model("Total",totalSchema);
module.exports=Total;