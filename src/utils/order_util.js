const orderValidator = {
    phone: { length: { min: 1, max: 10 } },
    name: { length: { min: 1, max: 8 } },
};
module.exports = {
    // orderValidator,
    orderCollection: 'order',
};
