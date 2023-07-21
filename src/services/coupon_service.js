const { couponModel: model } = require('@models');

// Create
const create = async (code, type, value, started_at, expired_at, quantity, condition) => {
    const conditions = {
        code,
        type,
        value,
        started_at,
        expired_at,
        quantity,
        condition,
    };
    return await model.create(conditions);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, code, type, value, started_at, expired_at, quantity, condition) => {
    const conditions = { code, type, value, started_at, expired_at, quantity, condition };
    return await model.updateOne({ _id: id }, conditions);
};

const updateQuantityUsed = async (id) => {
    return await model.updateOne({ _id: id }, { $inc: { quantity: -1, used: 1 } });
};

const changeFieldById = async (id, field, value) => {
    const conditions = {};

    if (field === 'status') conditions.status = value;
    if (field === 'ordering') conditions.ordering = value;
    if (field === 'url') conditions.url = value;
    if (field === 'is_special') conditions.is_special = value;
    if (field === 'isMenu') conditions.isMenu = value;

    return await model.updateOne({ _id: id }, conditions);
};

// Get
const getOneById = async (id) => {
    return await model.findById(id);
};

const getOneByCode = async (code) => {
    return await model.findOne({ code });
};

const getAll = async (keyword, { currentPage, itemPerPage }) => {
    let conditions = {};
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

// Count
const countByStatus = async (keyword) => {
    let conditions = {};
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    return await model.count(conditions);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getOneByCode,
    getAll,

    updateOneById,
    updateQuantityUsed,
    changeFieldById,
    countByStatus,
};
