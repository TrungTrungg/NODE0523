const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        address: String,
        email: String,
        phone: Number,
        password: String,
        avatar: String,
    },
    { timestamps: true },
);

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

module.exports = new mongoose.model('users', userSchema);
