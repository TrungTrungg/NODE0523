const { articleModel: model } = require('@models');

// Create
const create = async (name, status, ordering, slug, category_id) => {
    const condition = { name, status, ordering, slug };
    if (category_id) condition.category_id = category_id;
    return await model.create(condition);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (name, status, ordering, slug, category_id) => {
    const condition = { name, status, ordering, slug };
    if (category_id) condition.category_id = category_id;
    return await model.updateOne({ _id: id }, condition);
};

const changeStatusById = async (id, status) => {
    return await model.updateOne({ _id: id }, { status });
};

const changeOrderingById = async (id, ordering) => {
    return await model.updateOne({ _id: id }, { ordering });
};

// Get
const getOneById = async (id) => {
    return await model.findById(id);
};

const getAll = async (status, keyword, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    return await model
        .find(condition)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getAllNameId = async () => {
    return await model.find({ category_id: { $exists: false } }).select('_id name');
};
// Count
const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    return await model.count(condition);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getAllNameId,
    updateOneById,
    countByStatus,
    changeStatusById,
    changeOrderingById,
};
