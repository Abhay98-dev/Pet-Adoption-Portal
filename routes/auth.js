const express= require("express")
const router = express.Router()
const User=require("../module/user")
require("dotenv").config()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const saltRounds=10

router.use(express.urlencoded({extended:true}))
router.use(express.json())

router.get("/",(req,res)=>{
    res.send("WLc to auth page")
})

router.post("/register",async (req,res)=>{
    const {username,email,password}= req.body
    if(!username || !email || !password){
        return res.status(400).json({message:"All the fields are required"})
    }
    const existingUser= await User.findOne({email})
    if(existingUser){
        return res.status(409).json({message:"User Already Exists!"})
    }
    const hashedPass=  await bcrypt.hash(password,saltRounds)
    try{
        const user= new User({
            username,
            email,
            password:hashedPass
        })
        await user.save() 
        return res.status(201).json({message:"User created",user})
    }
    catch(err){
        console.log("Error registering new User: ",err)
        return res.status(500).json({message:"Internal server Error"})
    }
})

router.post("/login",async (req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({message:"All the fields are required"})
    }
    try{
        const user=User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isPassValid= bcrypt.compare(password,user.password)
        if(!isPassValid){
            return res.status(401).json({message:"Invalid Password"})
        }
        const token = jwt.sign({userId: user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"}
        )
        return res.status(200).json({message:"Login successful",token})
    }
    catch(err){
        console.log("Error Logging in User: ",err)
        return res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports=router