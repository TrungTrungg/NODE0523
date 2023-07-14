const userValidator = {
    name: { length: { min: 1, max: 8 } },
    phone: { length: { min: 1, max: 10 } },
    password: { length: { min: 3, max: 8 } },
};

module.exports = {
    userValidator,
    userCollection: 'user',
};
