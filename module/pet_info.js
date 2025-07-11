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
    }
})

const Pet= mongoose.model("Pet",petSchema)

module.exports=Pet