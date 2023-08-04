const { userModel: model } = require('@models');

const create = async (first_name, last_name, address, email, phone, password, avatar) => {
    const conditions = { first_name, last_name, address, email, phone, password };
    if (avatar) conditions.avatar = avatar;
    return await model.create(conditions);
};

const updateUserInfo = async (email, first_name, last_name, address, phone) => {
    return await model.updateOne({ email }, { first_name, last_name, address, phone });
};

const updatePassword = async (id, password) => {
    return await model.updateOne({ _id: id }, { password: password });
};

const getAll = async (status, keyword, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    return await model
        .find(condition)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
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

// Count
const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    return await model.count(condition);
};

module.exports = { create, updatePassword, getAll, getOne, getOneById, updateUserInfo, countAll, countByStatus };
