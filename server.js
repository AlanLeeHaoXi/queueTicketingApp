    //Import express, express-ejs layout and set app to run express.
    const express = require("express");
    const app = express()
    const ejs = require('ejs');
    const cors = require('cors')
    const mongoose = require('mongoose')
    
    const methodOverride = require('method-override')

    //Import data schema 
    const ticketCollection = require("./models/ticketSchema")

    //Import router module that was exported from routes/programs.js and use it
    const ticketCounterRouter = require('./routes/ticketCounterRoute.js')

    //Set app to run "ejs" view engine(requires ejs extension) EJS - allows javascript to be rendered in html.     
    app.set('view engine', 'ejs')   

    //Set app to render STATIC files(xxxx.img, xxxx.css and xxxx.js) in a directory named public    
    app.use('/public', express.static('public'));    

    //Allows app to use cors and parse user request(fetch data from server/calling API) in urlencoded and json format                                                                                                                 
    app.use(cors())
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.use(express.json())
    app.use(methodOverride('_method'))    

    // Launch web server and listen for request
    // try {
    //     app.listen(3002,'0.0.0.0')
    // } catch (error){
    //     console.log(error.message)
    // }
    try {
        app.listen(process.env.PORT || 3000, 
	    () => console.log("Server is running..."));
    } catch (error) {
        console.log(error.message)
    }
        
    //Connect to mongoDB altas
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect("mongodb+srv://admin:admin@mongodbchartcluster.0tbkz.mongodb.net/queueTicketingApp?retryWrites=true&w=majority", 
        {useNewUrlParser: true, useUnifiedTopology: true})
        console.log("Connected to mongoDB")
    }
    catch(error) {
        console.log(error)
    }
    app.use(ticketCounterRouter) 
