const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        address: String,
        email: String,
        phone: String,
        password: String,
        avatar: String,
        status: { type: String, default: 'active' },
        is_admin: { type: Boolean, default: false },
    },
    { timestamps: true },
);

userSchema.pre('save', function (next) {
    console.log(this.isModified('password'));
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    next();
});

module.exports = new mongoose.model('users', userSchema);
