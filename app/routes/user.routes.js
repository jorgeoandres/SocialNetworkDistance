module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', users.create);

    // Retrieve all Users
    app.get('/users', users.findAll);

    // Retrieve a single User with username
    app.get('/users/:username', users.findOne);

    // Update a User with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);

    //Add list of follows
    app.put('/users/follow/:username', users.follow);
    // Retrieve a single followers
    app.get('/users/followers/:username', users.followers);
    // Retrieve a single following
    app.get('/users/following/:username', users.following);

    app.get('/users/distance/:user1/:user2', users.distance_between_users);
}