const { userModel: model } = require('@models');

const create = async (first_name, last_name, address, email, phone, password, avatar) => {
    const conditions = { first_name, last_name, address, email, phone, password };
    if (avatar) conditions.avatar = avatar;
    return await model.create(conditions);
};

const updateUserInfo = async (email, first_name, last_name, address, phone) => {
    return await model.updateOne({ email }, { first_name, last_name, address, phone });
};

const getOne = async (email) => {
    return await model.findOne({ email });
};
const getOneById = async (id) => {
    return await model.findById(id);
};
const countAll = async () => {
    return await model.count();
};
module.exports = { create, getOne, getOneById, updateUserInfo, countAll };
