const { sliderModel: model } = require('@models');

// Create
const create = async (status, ordering, description, image) => {
    const condition = {
        status,
        ordering,
        description,
    };
    if (image) condition.image = image;
    return await model.create(condition);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, status, ordering, description, image) => {
    const condition = { status, ordering, description };
    if (image) condition.image = image;
    return await model.updateOne({ _id: id }, condition);
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

const getAllForHome = async () => {
    return await model.find();
};

const getAll = async (status, keyword, category_id, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    if (category_id) condition.category_id = category_id;
    return await model.find(condition).sort({ updatedAt: -1, createdAt: -1 });
};

// Count
const countByStatus = async (status, keyword, category_id) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    if (category_id) condition.category_id = category_id;

    return await model.count(condition);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getAllForHome,
    updateOneById,
    changeFieldById,
    countByStatus,
};
