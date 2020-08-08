//IMPORTS 
//PACKAGES
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//APP
const socialNetwork = express()

//Request
// parse requests of content-type - application/x-www-form-urlencoded
socialNetwork.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
socialNetwork.use(bodyParser.json());

//CONFIG
//DATABASE
const dbConfig = require('./config/database.config.js');
mongoose.Promise = global.Promise;

// Connecting to the database
// using a user just with access to CRUD operations
//admin user was used just because this is an exercise
mongoose.connect(dbConfig.urlCommonUser, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Successfully connected to the database");
    //SERVER
    socialNetwork.get('/', (req, res) => {
        res.json({ "message": "Welcome to SocialNetworkDistance application. Manage users and calculate distance between them" });
    });

    // listen for requests
    socialNetwork.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


//ROUTES BY MODEL
require('./app/routes/user.routes.js')(socialNetwork);


module.exports = socialNetwork