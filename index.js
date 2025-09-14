const express=require("express")
const app=express()
const mongoose=require("mongoose")
const path=require("path")
const cookieParser = require("cookie-parser");
const pet_router= require("./routes/pet")
express.urlencoded({extended:true})
app.use(express.json())
const auth_router=require("./routes/auth")
const Pet=require("./module/pet_info")
const adoptionRouter = require("./routes/adoption");
const verifyToken = require("./middleware/verifyToken");
const checkRole = require("./middleware/checkRole");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const jwt=require("jsonwebtoken");


app.use((req, res, next) => {
  const token = req.cookies ? req.cookies.token : null; // safe check
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded; // ✅ now available in all EJS templates
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});


app.use(cookieParser());
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))

mongoose.connect('mongodb://127.0.0.1:27017/Pet_Portal')
  .then(() => console.log('Connected to MongoDb'))
  .catch((err)=> console.log("Error connecting to MongoDB ",err))

app.get("/dashboard", verifyToken, checkRole("owner"), async (req, res) => {
  try {
    const pets = await Pet.find();
    res.render("ownerDashboard", { pets });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/add-pet", verifyToken, checkRole("owner"), (req, res) => {
  res.render("addPet");
});

// Render Login & Register Pages
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token"); // clear JWT cookie
  res.redirect("/login");
});


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
app.use("/adoption", adoptionRouter);

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

app.get("/pet/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).send("Pet not found");
    }
    res.render("petDetails", { pet });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


app.get("/reset-pets", async (req, res) => {
  try {
    await Pet.deleteMany({});
    res.send("All pets deleted!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting pets");
  }
});
