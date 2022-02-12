const express= require("express");
const bodyParser=require("body-parser");

const mongoose =require("mongoose");
const _=require("lodash");

const app=express();


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//connect to mongoose
mongoose.connect("mongodb+srv://sahilg125:SahilG%40123@cluster0.lotpd.mongodb.net/todolistDB");
// mongoose.connect("process.env.MONGODB_URI");


//Create new Schema


const itemSchema=new mongoose.Schema({
  name:String
});
const Item=mongoose.model("Item",itemSchema);


//Create Default Items to database

const item1=new Item({
   name:"Welcome to your to do list"
});

const item2=new Item({
  name:"Hit the + button to add a new item"
});


const item3=new Item({
  name:"<-- Hit this to delete an item"
});

//Create Default Items Array

var defaultArray=[item1,item2,item3];
const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema]
});
const List=mongoose.model("List",listSchema);






app.get("/",function(req,res){

  Item.find({},function(err,results){

     if(results.length==0){
       Item.insertMany(defaultArray,function(err){


         if(err) console.log(err);
         else {

           console.log("Successfully inserted Default Items");
           res.redirect("/");
       }
       });
     }else{

       let Day="Today";
       res.render("list",{

          kindOfDay:Day,
          newListItem:results

       });
     }


  });



});


app.post("/",function(req,res){

var singleItem=req.body.details;
var listTitle=req.body.list;

console.log(singleItem);
console.log(listTitle);
const newItem=new Item({
  name:singleItem
});

if(req.body.list=="Today"){


  newItem.save();
  res.redirect("/");

}else{

List.findOne({name:listTitle},function(err,results){

if(err)console.log(err);
else{
    results.items.push(newItem);
    results.save();
    res.redirect("/"+listTitle);
}

});
}
});



app.post("/delete",function(req,res){
  console.log(req.body.checkbox);
  var listName=req.body.ListName;

  console.log(listName);

  if(listName=="Today")
  {
    Item.deleteOne({_id:req.body.checkbox}, function(err){
      if(err) console.log(err);
      else{
        console.log("Deleted the item Successfully");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:req.body.checkbox}}},function(err,results){
      if(err)console.log(err);
      else{
        res.redirect("/"+listName);
      }
    })



  }


});

app.get("/:customListName",function(req,res){


const customListName= _.capitalize(req.params.customListName);

List.findOne({name:customListName},function(err,results){


  if(err)console.log(err);
  else{

    if(results!=null){
          res.render("list",{
            kindOfDay:results.name,
            newListItem:results.items
          })
        }
    else {
      console.log("Doesn't Exists");
      const customListArray=new Item({
        name:"Welcome to List"
      });
         const item=List({
           name:customListName,
           items:customListArray
         });

      item.save();
    res.redirect("/"+customListName);

    }



  }
})




})


app.listen(process.env.PORT||3000,function(){
  console.log("Server has started on channel 3000");

});
