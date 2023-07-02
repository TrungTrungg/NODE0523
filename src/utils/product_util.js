const productValidator = {
    name: { length: { min: 1, max: 100 } },
    ordering: { length: { min: 1, max: 100 } },
};

module.exports = {
    productCollection: 'product',
    productValidator,
};
