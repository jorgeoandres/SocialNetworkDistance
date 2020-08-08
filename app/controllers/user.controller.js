const User = require('../models/user.model.js');
const Follower = require('../models/followers.model');
//const UserServices = require('../services/user.service.js');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        return res.status(400).send({
            message: "User content can not be empty"
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

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

// Find a single user with a user
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

// Update a user identified by the user in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.content) {
        return res.status(400).send({
            message: "User content can not be empty"
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

// Delete a user with the specified user in the request
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

async function getUser(username) {
    let result = await User.findOne({ username: username }).exec();
    return result;
}

async function getFollowings(id) {
    let result = await User.findOne({ _id: id }, "following").exec();
    return result.following;
}

function checkFollows(current_childs, destination) {
    return current_childs.includes(destination);
}

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

exports.distance_between_users = (req, res) => {
    getUser(req.params.user1).then(function(origin) {
        getUser(req.params.user2).then(function(destination) {
            BFS(origin._id, destination._id, 6).then(function(result) {
                res.send(result);
            });
        });
    });
}