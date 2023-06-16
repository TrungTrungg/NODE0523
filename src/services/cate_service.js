const { cateModel } = require('@models');

const getCate = async () => {
    return await cateModel.find();
};

const addCate = async (name) => {
    return await cateModel.create({ name });
};
const getItemsFromCate = async () => {
    return await cateModel.find().populate({ path: 'items' });
};

module.exports = {
    getCate,
    addCate,
    getItemsFromCate,
};
