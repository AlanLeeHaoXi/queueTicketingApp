//import and use library 
const express = require('express')     
const mongoose = require('mongoose')     
const router = express.Router()     

//import and use mongoDB schema
const ticketCollection = require("../models/ticketSchema")
const counterCollection = require("../models/counterSchema")

let ticketCounter = 0;
let ticketServingCurrNumber = 0;
let ticketServingLastNumber = 0
let counter 
let message

class Ticket {
   constructor() {
       this._ticketNum = 1000 + ticketCounter
       ticketCounter++
       this._ticketStatus = 'pending'
       this._counterAssigned = 0
   }
};

// Static Routes
// default customer route
router.get("/customer_view", async (request, response) => {
   try{
      counter = await counterCollection.find()
      response.render("customer_view", {
         counter : counter,
         ticketServingCurrNumber : ticketServingCurrNumber,
         ticketServingLastNumber : ticketServingLastNumber,
         message : null
      })
   } catch (err) {das
      response.status(403).json("" + err)
   }
})

//Router that adds new tickets to queue
router.post("/customer_view/customertakeNumber", async (request, response) => {
   try {
         //Create a new ticket obj instance and insert document into ticket collection
         let newTicket = new Ticket();
         let result =new ticketCollection({
            ticketNum :  newTicket._ticketNum,
            ticketStatus : newTicket._ticketStatus,
            counterAssigned : newTicket._counterAssigned
         })
         result.save((err) => {
            if(err) {
               console.log("Something went wrong");
            }
         });

         //Update last serving ticket number and render customer view
         counter = await counterCollection.find()
         ticketServingLastNumber = newTicket._ticketNum
         response.render("customer_view", 
         {
               counter : counter,
               ticketServingCurrNumber : ticketServingCurrNumber,
               ticketServingLastNumber : ticketServingLastNumber,
               message : null
         });
   }
   catch (err) {
      response.status(403).json("" + err)
   }
})

// Default counter manager route
router.route("/counter_management_view")
.get( async (request,response)=> {
   try {
   counter = await counterCollection.find()
   response.render("counter_management_view", {
      counter : counter
   })
   } catch (err) {
      response.status(403).json("" + error)
   }
})

//Router that sets the counter to be Offline or Online
router.put('/counter_management_view/setOnlineOffline/:counterNum', async(request, response) =>
{
   try {
      let currCounter = await counterCollection.findOne({counterNum: request.params.counterNum})

      //Set counter to online 
      if (currCounter.counterStatus == "offline") {
         let result = await counterCollection.updateOne(
            {counterNum: request.params.counterNum},
            {"$set": {  counterStatus : request.body.updateStatus }
         })
         message = null

      //Set counter to offline 
      } else if (currCounter.counterStatus == "online"){
         let result = await counterCollection.updateOne(
            {counterNum: request.params.counterNum},
            {"$set": {  counterStatus : request.body.updateStatus }
      })
         message = null

      //Counter is busy, send message alert 
      } else if (currCounter.counterStatus == "busy"){
         message = "Cannot go offline. Counter " + currCounter.counterNum + " is busy serving ticket " + currCounter.ticketServing
      }

      //Rerender the counter management view
      counter = await counterCollection.find()
      response.render("counter_management_view", {
         counter : counter,
         message : message
      })   
   } catch (err) {
      response.status(403).json("" + err)
   }
})

//Router to call the next customer to counter
router.put('/counter_management_view/callNext/:counterNum', async(request, response) =>{
   try {
      let currCounter = await counterCollection.findOne({counterNum: request.params.counterNum})

      //When counter is vacant
      if (currCounter.counterStatus === 'online') {
         //Find and update 1st customer/ticket in queue
         let nextTicket = await ticketCollection.findOneAndUpdate(
            {ticketStatus: "pending"} , { ticketStatus: "serving"}
         ).sort(
            {ticketNum: 1}
         )

         //When there are customer/ticket are in queue
         if (nextTicket) {
            //Update counter status and add serving ticket number to it
               currCounter = await counterCollection.updateOne(
               {counterNum: request.params.counterNum},
               {"$set": { "counterStatus" : "busy", ticketServing : nextTicket.ticketNum }}
            )

            //Rerender the counter management view
            ticketServingCurrNumber = nextTicket.ticketNum;
            counter = await counterCollection.find()
            response.render("counter_management_view", {
               counter : counter,
               nextTicket : nextTicket,
               message : null
            })
         }

         //No more Customer/ticket in queue
         else if (!nextTicket) {
            counter = await counterCollection.find()
            message = "No tickets in the waiting queue"
            response.render('counter_management_view',{
               counter : counter,
               message : message
            })
         }

      //When counter is busy
      } else {

         //Rerender the counter management view with message alert
         counter = await counterCollection.find()
         message = "Cannot call next. Counter " + currCounter.counterNum + " is busy serving ticket " + currCounter.ticketServing
         response.render('counter_management_view',{
            counter : counter,
            message : message
         })
      }
   }catch(error) {
      response.status(403).json("" + error)
   }
})

router.put('/counter_management_view/completeCurr/:counterNum', async(request, response) =>{
   let currCounter = await counterCollection.findOne({counterNum: request.params.counterNum})

   //When counter is online
   if (currCounter.counterStatus == 'online') {
       //Rerender the counter management view with message alert
       counter = await counterCollection.find()
       message = "Counter is free. No current tickets to complete."
       response.render('counter_management_view',{
          counter : counter,
          message : message
       })
   } 

   //When counter is busy
   else if (currCounter.counterStatus == 'busy') {
      //Update ticket status to complete
      let result = await ticketCollection.updateOne(
         {ticketNum: currCounter.ticketServing},
         {"$set": { ticketStatus : "complete"}})
      
      //Update counter status to online and clear serving ticket number
      let result0 = await counterCollection.updateOne(
      {counterNum: request.params.counterNum},
      {"$set": { counterStatus : "online", ticketServing : 0 }})

      //Rerender the counter management view with message alert
      counter = await counterCollection.find()
      response.render('counter_management_view',{
         counter : counter,
         message : null
      })
   }

})

//Export router module. Any other file that runs require('./routes/ticketCounterRoute.js') will import this module.
module.exports = router
