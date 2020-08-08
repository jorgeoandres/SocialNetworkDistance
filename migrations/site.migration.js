const mongoose = require('mongoose');
const dbConfig = require('../config/database.config.js');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.urlAdmin, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database for migration");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    //user
    const User = require('../app/models/user.model.js');
    users = []
        //creating all users from A to Z
    for (i = 0; i < 26; i++) {
        var user = new User({
            username: "user" + (i + 10).toString(36).toUpperCase()
        })
        users.push(user);
    }

    // Save user in the database
    User.insertMany(users).then(data => {
        console.log("Users created on the database.")
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating User database."
        });
    });
});