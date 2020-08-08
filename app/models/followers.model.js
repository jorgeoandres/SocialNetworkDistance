const mongoose = require('mongoose');
const FollowerSchema = mongoose.Schema({
    "follower": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    "following": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Followers', FollowerSchema);