const express=require("express");
const app=express();
const bp=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
app.use(bp.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true });
const itemschema={
    task:String
}
const itemmodel=mongoose.model("Item",itemschema);
const item1 = new itemmodel ({
    task: "Start entering"
  });
const def = [item1];
const listschema={
    name:String,
    items:[itemschema]
}
const listmodel=mongoose.model("List",listschema);
app.get("/",(req,res)=>{
    let day=date.getDay();
    itemmodel.find((err,fitems)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
           if(fitems.length===0)
            {
                itemmodel.insertMany(def,(e)=>{
                    if(e)console.log(e);
                    else
                    console.log("Successfully added default items");
                })
                res.redirect("/")
            }
            else
            {
            res.render("index",{listtitle:day,newitem:fitems})
            }
        }
    })
})
app.post("/",(req,res)=>
{
    let t=req.body.mytask;
    let title=req.body.list;
    let today=date.getDay();
    let myitem= new itemmodel({
        task:t
    })
    if(title===today)
    {
    myitem.save();
    res.redirect("/");
}
else
{
    listmodel.findOne({name:title},(err,found)=>{
        if(!err){
            found.items.push(myitem);
            found.save();
            res.redirect("/"+title);
        }
    })
}
})
app.post("/delete",(req,res)=>{
    const id=req.body.checkbox;
    const listname=req.body.hidinp;
    let day=date.getDay();
    if(day===listname){
    itemmodel.deleteMany({_id:id},(err)=>{
        if(err) console.log(err);
        else
        console.log("Deletion successful");
    })
    res.redirect("/");
}
else
{
    listmodel.findOneAndUpdate({name:listname},{$pull :{items:{_id:id}}},(err,foundl)=>{
        if(!err)
        res.redirect("/"+listname);
    })
}
})
app.get("/:source",(req,res)=>{
    const listname=req.params.source;
    listmodel.findOne({name:listname},(err,found)=>{
        if(!err){
            if(!found){
                let li=new listmodel({
                    name:listname,
                    items:def
                })
                li.save();       
                res.redirect("/"+listname);     
            }
             else
        {
            res.render("index",{listtitle:found.name,newitem:found.items})
        }
        }
       
    })

})
app.get("/about",(req,res)=>
{
    res.render("about")
})
app.listen(3000,()=>
{
    console.log("Server Started at port 3000");
})