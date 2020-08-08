const User = require('../models/user.model.js');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        return res.status(400).send({
            message: "Username can not be empty"
        });
    }

    // Create a User
    const user = new User(req.body);

    // Save User in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with a username
exports.findOne = (req, res) => {
    User.findOne({ username: req.params.username }, function(err, user) {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.username
            });
        } else {
            res.send(user);
        }
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.username) {
        return res.status(400).send({
            message: "Username can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
            title: req.body.title || "Untitled User",
            content: req.body.content
        }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.username
            });
        });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.username
            });
        });
};

//User follows another user
exports.follow = (req, res, next) => {
    User.findOne({ username: req.params.username }, function(err, followee) {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.username
            });
        } else {
            //find user to be followed
            User.findOne({ username: req.body.username }, function(err, userToFollow) {
                if (err) {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "User not found with id " + req.params.username
                        });
                    }
                    return res.status(500).send({
                        message: "Error retrieving user with id " + req.params.username
                    });
                } else {
                    return followee.follow(userToFollow).then(function() {
                        res.send(followee);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Error following someone."
                        });
                    });
                }
            });

        }
    });
}

//Get followers from a user with a given username
exports.followers = (req, res) => {
    User.findOne({ username: req.params.username }, 'username followers').populate('following', 'username').exec(function(err, user) {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.username
            });
        } else {
            res.send(user);
        }
    });
}

//Get followings from a user with a given username
exports.following = (req, res) => {
    User.findOne({ username: req.params.username }, 'username following').populate('following', 'username').exec(function(err, user) {
        if (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.username
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.params.username
            });
        } else {
            res.send(user);
        }
    });
}

//help async function to get information of user with a given username
async function getUser(username) {
    let result = await User.findOne({ username: username }).exec();
    return result;
}

//help async function to get an array of the users who a user follows with a given id
async function getFollowings(id) {
    let result = await User.findOne({ _id: id }, "following").exec();
    return result.following;
}

//function that checks if the destination node (user) is on the list of followings
function checkFollows(current_childs, destination) {
    return current_childs.includes(destination);
}

//algorithm to find distance between two users. To control the level of search maxLevel value is asked.
async function BFS(origin, destination, maxLevel) {
    visited = []
    distance = 1;
    current_node = origin;
    current_childs = await getFollowings(origin);
    queue = [];
    queueChilds = [];

    //check first level, the most easy.
    if (checkFollows(current_childs, destination)) {
        return { "distance": distance };
    } else {
        visited.push(origin);
        queue = queue.concat(current_childs);
        distance++;
    }

    // //check BFS
    while (queue.length > 0) {
        current_node = queue.shift();
        if (!visited.includes(current_node)) {
            current_childs = await getFollowings(current_node);
            visited.push(current_node);
            if (current_childs.length > 0) {
                if (checkFollows(current_childs, destination)) {
                    return { "distance": distance };
                } else {
                    queueChilds = queueChilds.concat(current_childs);
                }
            }
        }
        if (queue.length == 0) {
            console.log("Searching on next level");
            if (queueChilds.length > 0) {
                if (distance == maxLevel) {
                    return "Max level conecction found";
                }
                queue = queueChilds;
                queueChilds = [];
                distance++;
            }
        }
    }
}

//method to find distance between two users. It looks a user as a node and the follow conecction as an edge of a unweighted graph. So it uses BFS to look for the distance
exports.distance_between_users = (req, res) => {
    getUser(req.params.user1).then(function(origin) {
        getUser(req.params.user2).then(function(destination) {
            BFS(origin._id, destination._id, 6).then(function(result) {
                res.send(result);
            });
        });
    });
}