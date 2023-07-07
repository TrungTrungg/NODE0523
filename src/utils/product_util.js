const productValidator = {
    name: { length: { min: 1, max: 100 } },
    ordering: { length: { min: 1, max: 100 } },
};

const productPrice = {
    price1: {
        name: 'dưới 1 triệu',
        value: 'lower,1000000',
    },
    price2: {
        name: 'từ 1 triệu đến 5 triệu',
        value: '1000000,5000000',
    },
    price3: {
        name: 'từ 5 triệu đến 10 triệu',
        value: '5000000,10000000',
    },
    price4: {
        name: 'trên 10 triệu',
        value: 'higher,10000000',
    },
};

module.exports = {
    productCollection: 'product',
    productValidator,
    productPrice,
};
