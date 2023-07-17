const { deliveryModel: model } = require('@models');

// Create
const create = async (location, status, shipping_fee) => {
    const conditions = {
        location,
        shipping_fee,
        status,
    };
    return await model.create(conditions);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, location, status, shipping_fee) => {
    const conditions = { location, status, shipping_fee };
    return await model.updateOne({ _id: id }, conditions);
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
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getLocations = async () => {
    const allLocations = await model.find();
    const locations = allLocations.map((result) => {
        const { _id, location } = result;
        return { value: _id, name: location };
    });
    return locations;
};

// Count
const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    return await model.count(condition);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getLocations,

    updateOneById,
    changeFieldById,
    countByStatus,
};
