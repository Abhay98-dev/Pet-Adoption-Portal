const mongoose = require("mongoose")

const petSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    breed:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
},{timestamp:true})

const Pet= mongoose.model("Pet",petSchema)

module.exports=Pet