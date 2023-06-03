const itemsModel = require('../models/items_model');

const create = async (name, status, ordering) => {
    return await itemsModel.create({ name, status, ordering });
};

const deleteOneById = async (id) => {
    return await itemsModel.deleteOne({ _id: id });
};

const getOneById = async (id) => {
    return await itemsModel.find({ _id: id });
};

const updateOneById = async (id, name, status, ordering) => {
    return await itemsModel.updateOne({ _id: id }, { name, status, ordering });
};

const getAll = async (status, keyword, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status;
    if (keyword) condition.name = new RegExp(keyword, 'i');
    return await itemsModel
        .find(condition)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status;
    if (keyword) condition.name = new RegExp(keyword, 'i');
    return await itemsModel.count(condition);
};

const changeStatusById = async (id, status) => {
    return await itemsModel.updateOne({ _id: id }, { status });
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    updateOneById,
    countByStatus,
    changeStatusById,
};