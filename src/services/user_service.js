const { userModel: model } = require('@models');

const create = async (first_name, last_name, address, email, phone, password, avatar) => {
    const conditions = { first_name, last_name, address, email, phone, password };
    if (avatar) conditions.avatar = avatar;
    return await model.create(conditions);
};

const getOne = async (email) => {
    return await model.findOne({ email });
};
const getOneById = async (id) => {
    return await model.findById(id);
};

module.exports = { create, getOne, getOneById };
