const express=require("express")
const app=express()
const mongoose=require("mongoose")
const path=require("path")
const pet_router= require("./routes/pet")
express.urlencoded({extended:true})
app.use(express.json())
const auth_router=require("./routes/auth")

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))

mongoose.connect('mongodb://127.0.0.1:27017/Pet_Portal')
  .then(() => console.log('Connected to MongoDb'))
  .catch((err)=> console.log("Error connecting to MongoDB ",err))


app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.use("/pet",pet_router)
app.use("/auth",auth_router)

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})