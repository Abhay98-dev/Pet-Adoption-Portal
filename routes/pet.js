const express = require("express")
const router = express.Router()
const Pet=require("../module/pet_info")
express.urlencoded({extended:true})
const verifyToken = require("../middleware/verifyToken")

router.get("/", async (req,res)=>{
    const data= await Pet.find()
    res.json(data)
})

router.post("/",verifyToken,async(req,res)=>{
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

router.put("/:id",verifyToken,async(req,res)=>{
    const {name,type,description, breed}=req.body
    const petId = req.params.id;
    if(!name||!type||!description|| !breed){
        return res.status(400).json({error:"All the fields are required"})
    }
    try{
        const pet=await Pet.findOne({_id:petId})
        if(!pet){
            return res.status(400).json({message:"Pet not found"})
        }
        console.log(pet)
        const updated_pet=await Pet.findByIdAndUpdate(
            petId,
            {name,type,description, breed},
            {new:true}
        )
        res.status(200).json({message:"Pet updated",pet:updated_pet})
    }
    catch(err){
        console.log("Error updating pet :",err)
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.delete("/",verifyToken,async (req,res)=>{
    const {name , type}=req.body
    if(!name||!type){
        return res.status(400).json({error:"Name and Type must be mentioned"})
    }
    try{
        const pet=await Pet.findOne({name,type})
        if(!pet){
            return res.status(400).json({message:"pet not found"})
        }
        console.log("Found pet:", pet);
        await Pet.deleteOne({ _id: pet._id })
        res.status(200).json({message:"Pet deleted"})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports = router