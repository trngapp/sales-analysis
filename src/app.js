const express=require("express");
const app=new express();
const fs=require("fs");

require("./db/conn");
const path=require("path");

///MODELS
const Men = require("./models/buy-men");
const Women=require("./models/buy-women");
const Total =require("./models/buy-total");
const Targetyear=require("./models/target-year");
const Targetmonth=require("./models/target-month");
//ENDED

////function

const change=( ht,val)=>{
const tem=ht.replace("{%ans%}",val);
return tem;
}

/////

///ADDING VIEWS
const port=process.env.PORT||3000;
const static_path=path.join(__dirname,"./views");

app.use(express.static(static_path));
app.set("view engine","hbs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
///ENDED


const sale=fs.readFileSync("./views/sales.hbs","utf-8");


///GET REQUEST ON E-COMMERCE SHOE WEBSITE
app.get("/",(req,res)=>{

    res.render("index");
})
//ENDED

///GET REQUEST ON SALES ANALYSIS
app.get("/sales", (req,res)=>{

        res.render("sales");
})
///ENDED


/// Post Request on the  E-commerce shoe website ( BUYING OF SHOE)
app.post("/", async (req,res)=>{
  try {
     // console.log(req.body);
      //res.send("Thank you so much for buying !!!!");
      const gender=req.body.gender;
      const pricing=parseInt(req.body.price);
      const date = new Date();
      const day= date.getDate();
      const mon=date.getMonth();
      const year=date.getFullYear();
      console.log(date);
      console.log(day);
      console.log(mon);
      console.log(year);

      const totalAdded=new Total({
          gender:req.body.gender,
        brand:req.body.brand,
        price:pricing,
        day: day ,
        month: mon+1 ,
        year: year
    })
    const addedtotal=await totalAdded.save();



      if(gender==="men")
      {
    const menAdded=new Men({
        brand:req.body.brand,
        price:pricing,
        day: day ,
        month: mon+1 ,
        year: year
    })
    const added=await menAdded.save();
    res.status(201).send("<h1>Yes!!! Thank you for the purchase</h1>");
      }

      else{
        const womenAdded=new Women({
            brand:req.body.brand,
            price:pricing,
            day: day ,
            month: mon+1 ,
            year: year
        })
        const added=await womenAdded.save();
        res.status(201).send("<h1>Yes!!! Thank you for the purchase</h1>");
      }
  } catch (error) {
      res.status(400).send(error);
  }

})
/////ENDED
/////TOTAL REVENUE
app.get("/totalrevenue",async (req,res)=>{
    try{

    const {gender}=req.query;
    if(gender==="men")
    {
let tar=await Total.aggregate([
    {$match:{gender:"men"}},
    {

    $group : {
        _id : "$gender",
        total : {
            $sum : "$price"
        }
    }
}]);
console.log(tar[0].total);

//res.send(`<h1>Ans is ${tar[0].total}</h1>`);
res.send(`${sale.replace("{%total%}",tar[0].total)}`);

    }
    else if(gender==="women")
    {
        let tar=await Total.aggregate([
            {$match:{gender:"women"}},
        {

            $group : {
                _id : "$gender",
                total : {
                    $sum : "$price"
                }
            }
        }]);
        console.log(tar[0].total);

//res.send(`<h1>Ans is ${tar[0].total}</h1>`);
res.send(`${sale.replace("{%total%}",tar[0].total)}`);
    }

    else{
        let tar=await Total.aggregate([{

            $group : {
                _id : null,
                total : {
                    $sum : "$price"
                }
            }
        }]);
        console.log(tar[0].total);

       // res.send(`<h1>Ans is ${tar[0].total}</h1>`);
       res.send(`${sale.replace("{%total%}",tar[0].total)}`);
    }


    }catch(error)
    {
        res.status(400).send(error);
    }




})
///ENDED

////TOTAL TODAY REVENUE
app.get("/totaltoday", async (req,res) => {
try{
     const {gender}=req.query;

      const date=new Date();
      const newday=date.getDate();



      const newmonth=date.getMonth();
      const newyear=date.getFullYear();


     if(gender==="men")
     {

          let tar=await Total.aggregate([
           {$match:{$and :[{day:newday},{month:newmonth+1},{year:newyear},{gender:"men"}]}},
           { $group: {
                    _id: "$gender",
                    total: {
                        $sum: "$price"
                    }
                }
            }
          ]);
console.log(tar[0].total);

//res.send(`<h1>Ans is ${tar[0].total}</h1>`);
res.send(`${sale.replace("{%today%}",tar[0].total)}`);
     }
     else if(gender==="women")
     {
        let tar=await Total.aggregate([
            {$match:{$and :[{day:newday},{month:newmonth+1},{year:newyear},{gender:"women"}]}},
            { $group: {
                     _id: "$gender",
                     total: {
                         $sum: "$price"
                     }
                 }
             }
           ]);
           console.log(tar[0].total);

           res.send(`${sale.replace("{%today%}",tar[0].total)}`);
     }
     else
     {
        let tar=await Total.aggregate([
            {$match:{$and :[{day:newday},{month:newmonth+1},{year:newyear}]}},
            { $group: {
                     _id: null,
                     total: {
                         $sum: "$price"
                     }
                 }
             }
           ]);
           console.log(tar[0].total);

           res.send(`${sale.replace("{%today%}",tar[0].total)}`);
     }



}
catch(error)
{
    res.status(400).send(error);
}



})
///ENDED


///TOP SELLING

app.get("/topsell", async(req,res)=>{
    try {
        const {gender}=req.query;
        if(gender==="men")
        {
             let tarmen=await Total.aggregate([
               {$match:{gender:"men"}},
                {

                 $group:{
                     _id:"$brand",
                     count:{
                         $sum:1
                     }

                 }
             }])

             //tarmen=JSON.stringify(tarmen);
            // tarmen =JSON.parse(tarmen);
             console.log(tarmen);
             //var x=tarmen.reduce((acc, shot) => acc = acc > shot.count ? acc : shot._id, 0);
            const coun= Math.max.apply(Math, tarmen.map(function(o) {
                return o.count;
            }));
            const d=tarmen.find((ele)=>ele.count===coun);

        const f=[d];
        const x=f[0]._id;
            // const tempe=change(sale,x);
console.log(f);

            res.send(`${sale.replace("{%top%}",x)}`);
             //res.send(`<h1>ans is ${x}</h1>`);
             //res.send("commng");
        }
        else if(gender==="women")
        {
            let tarwomen=await Total.aggregate([
                {$match:{gender:"women"}},
                 {

                  $group:{
                      _id:"$brand",
                      count:{
                          $sum:1
                      }

                  }
              }])
              console.log(tarwomen);
              const coun= Math.max.apply(Math, tarwomen.map(function(o) {
                return o.count;
            }));
            const d=tarwomen.find((ele)=>ele.count===coun);

        const f=[d];
        const x=f[0]._id;
        console.log(f);
        res.send(`${sale.replace("{%top%}",x)}`);
              //res.send(`<h1>ans is ${x}</h1>`);

        }
        else{
            let tar=await Total.aggregate([{
                $group:{
                    _id:"$brand",
                    count:{
                        $sum:1
                    }

                }
            }])
            console.log(tar);
            const coun= Math.max.apply(Math, tar.map(function(o) {
                return o.count;
            }));
            const d=tar.find((ele)=>ele.count===coun);

            const f=[d];
            const x=f[0]._id;
            console.log(f);
            res.send(`${sale.replace("{%top%}",x)}`);

        }



    } catch (error) {
        res.status(400).send(error);
    }
})
///ENDED

///SET TARGET
app.post("/addtarget",async (req,res)=>{
try {

   const tar=req.body;
   const target=parseInt(tar.target);
   const date=new Date();
   const mon=date.getMonth();
      const year=date.getFullYear();
   console.log(tar);
   if(tar.time==="month")
   {
       const targetofmonth=new Targetmonth({
                target:target,
                status:0,
                month:mon+1,
                year:year

       })
       const added= await targetofmonth.save();

       res.send("<h1>The monthly target for this month is added</h1>");

   }
   else{
    const targetofyear=new Targetyear({
        target:target,
        status:0,
        year:year

})
const added= await targetofyear.save();
res.send("<h1>The yearly target for this year is added</h1>");

   }




} catch (error) {
    res.status(400).send(error);
}



})
////ENDED

//// TARGET STATUS

app.get("/status", async (req,res)=>{
try {
    const date=new Date();
    const mon=date.getMonth();

       const year=date.getFullYear();
       const {time}=req.query;

       if(time==="month")
       {
              const result= await Targetmonth.find({$and:[{month:mon+1},{year:year}]});

            if(result[0].status===result[0].target)
           {
               res.send("<h1>Target achieved</h1>");
           }
           else
           {
           // res.send("<h1>Target not acieved!!</h1>");
           res.send(`${sale.replace("{%staus%}","Target not acieved!!")}`);
           }

       }
       else{
        const result= await Targetmonth.find({year:year});

        if(result[0].status===result[0].target)
        {
            res.send("<h1>Target achieved</h1>");
        }
        else{
            res.send("<h1>Target not acieved!!</h1>");
        }

       }


} catch (error) {
    res.status(400).send(error);
}

})


/// lISTENING TO THE PORT GIVEN
app.listen(port,()=>{
    console.log("connected to server...");
})