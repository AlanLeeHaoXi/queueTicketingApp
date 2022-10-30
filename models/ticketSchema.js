const mongoose = require("mongoose")

//creates a staff schema
const ticketSchema = new mongoose.Schema({
    ticketNum: Number,
    ticketStatus: String,
    counterAssigned: Number,

},
{collection: 'Ticket'})

//Create the schema model/collection & export the module. 
module.exports = mongoose.model("Ticket", ticketSchema)