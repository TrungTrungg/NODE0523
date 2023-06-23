const { categoryModel: model } = require('@models');

// Create
const create = async (name, status, ordering, slug, category_id) => {
    const condition = { name, status, ordering, slug, category_id };
    return await model.create(condition);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, name, status, ordering, slug, category_id) => {
    const condition = { name, status, ordering, slug, category_id };
    return await model.updateOne({ _id: id }, condition);
};

const changeStatusById = async (id, status) => {
    return await model.updateOne({ _id: id }, { status });
};

const changeOrderingById = async (id, ordering) => {
    return await model.updateOne({ _id: id }, { ordering });
};

const changeUrlById = async (id, url) => {
    return await model.updateOne({ _id: id }, { url });
};
// Get
const getOneById = async (id) => {
    return await model.findById(id);
};

const getAll = async (status, keyword, category_id, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    if (category_id) condition.category_id = category_id;
    return await model
        .find(condition)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getNameId = async (id) => {
    let condition = { $exists: true, $eq: '' };
    if (id) condition = id;
    return await model.find({ category_id: condition }).select('id name category_id');
};

const getSubCategory = async () => {
    let condition = { $exists: true, $ne: '' };
    return await model.find({ category_id: condition });
};

const getMainCategory = async () => {
    let condition = { $exists: true, $eq: '' };
    return await model.find({ category_id: condition });
};

const getCategory = async (id) => {
    return await model.findById(id);
};
// Count
const countByStatus = async (status, keyword, category_id) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    if (category_id) condition.category_id = category_id;
    return await model.count(condition);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getNameId,
    getSubCategory,
    getMainCategory,
    getCategory,
    updateOneById,
    countByStatus,
    changeStatusById,
    changeOrderingById,
    changeUrlById,
};
