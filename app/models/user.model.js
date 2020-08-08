const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    "username": {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
}, {
    timestamps: true
});

UserSchema.methods.follow = function(user) {
    if (this.following.indexOf(user._id) === -1) {
        this.following.push(user._id);
    }

    user.followers.push(this._id);
    user.save();
    return this.save();
};

UserSchema.methods.unfollow = function(id) {
    this.following.remove(id);
    return this.save();
};

UserSchema.methods.isFollowing = function(id) {
    return this.following.some(function(followId) {
        return followId.toString() === id.toString();
    });
};

module.exports = mongoose.model('User', UserSchema);