const express=require("express")
const app=express()
const mongoose=require("mongoose")
const path=require("path")
const pet_router= require("./routes/pet")
express.urlencoded({extended:true})
app.use(express.json())
const auth_router=require("./routes/auth")
const cookieParser = require("cookie-parser");
const Pet=require("./module/pet_info")


app.use(cookieParser());
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))

mongoose.connect('mongodb://127.0.0.1:27017/Pet_Portal')
  .then(() => console.log('Connected to MongoDb'))
  .catch((err)=> console.log("Error connecting to MongoDB ",err))


app.get("/",async (req,res)=>{
    try {
        const pets = await Pet.find();   
        res.render("home", { pets });    
    } catch (err) {
        console.error(err);
        res.render("home", { pets: [] }); 
    }
})

app.get("/about", (req, res) => {
  res.render("about"); // renders views/about.ejs
});

app.get("/contact", (req, res) => {
  res.render("contact"); // renders views/contact.ejs
});

app.get("/pet", async (req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 });
  res.render("pet", { pets }); // renders views/pet.ejs
});


app.use("/pet",pet_router)
app.use("/auth",auth_router)


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})



app.get("/reset-pets", async (req, res) => {
  try {
    await Pet.deleteMany({});
    res.send("All pets deleted!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting pets");
  }
});
