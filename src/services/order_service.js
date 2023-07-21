const { orderModel: model } = require('@models');

// Create
const create = async (user_code, status, product, user, total, coupon_id, delivery_id, message) => {
    const conditions = {
        user_code,
        status,
        product,
        user,
        total,
        delivery_id,
        message,
    };
    if (coupon_id) conditions.coupon_id = coupon_id;
    return await model.create(conditions);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
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

const getAll = async (status, keyword, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    return await model
        .find(condition)
        .sort({ createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getLatest = async (limit) => {
    return model.find().sort({ createdAt: -1 }).limit(limit);
};

const getOrdersByUser = async (user) => {
    const conditions = {};
    if (user) {
        conditions['user.email'] = user;
    }
    return await model.find(conditions);
};

// Count
const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');

    return await model.count(condition);
};
const countAll = async () => {
    return await model.count();
};
module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getLatest,
    getOrdersByUser,
    changeFieldById,
    countByStatus,
    countAll,
};
