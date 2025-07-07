const express = require("express")
const router = express.Router()
const Pet=require("../module/pet_info")
express.urlencoded({extended:true})

router.get("/", async (req,res)=>{
    const data= await Pet.find()
    res.json(data)
})

router.post("/",async(req,res)=>{
    const {name,type,description,breed}=req.body
    if(!name||!type||!description||!breed){
        return res.status(400).json({error:"All fields must be filled"})
    }
    try{
        const newPet= new Pet({
            name,
            type,
            description,
            breed
        })
        const savePet= await newPet.save()
        res.status(201).json({message:"Pet Created Succsefully"})
    }
    catch(err){
        console.error("Error creating pet: ",err)
        res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports = router