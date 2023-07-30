const userValidator = {
    name: { length: { min: 1, max: 15 } },
    phone: { length: { min: 10, max: 10 } },
    password: { length: { min: 3, max: 15 } },
};

module.exports = {
    userValidator,
    userCollection: 'user',
};
