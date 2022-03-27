const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://tarang:tarangsharma@cluster0.3mgst.mongodb.net/sales?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("Connected..."))
.catch((err)=>console.log(err));
