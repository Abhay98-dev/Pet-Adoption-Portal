const express= require("express")
const router = express.Router()

router.get("/",(req,res)=>{
    res.send("WLc to auth page")
})

module.exports=router