const mongoose = require("mongoose")

//creates a staff schema
const counterSchema = new mongoose.Schema({
    counterNum: Number,
    counterType: String,
    counterStatus: String,
    ticketServing: Number,
},
{collection: 'Counter'})

//Create the schema model/collection & export the module. 
module.exports = mongoose.model("Counter", counterSchema)