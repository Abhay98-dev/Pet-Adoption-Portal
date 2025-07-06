const express=require("express")
const app=express()
const mongoose=require("mongoose")
const path=require("path")

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})