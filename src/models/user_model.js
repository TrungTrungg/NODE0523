const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: String,
        username: String,
        password: String,
        email: String,
    },
    { timestamps: true },
);

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

module.exports = new mongoose.model('users', userSchema);
