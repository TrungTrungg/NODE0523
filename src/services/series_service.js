const { seriesModel: model } = require('@models');

// Create
const create = async (name, status, ordering, slug, category_id, post_date, author, description) => {
    const conditions = { name, status, ordering, slug, category_id, post_date, author, description };
    return await model.create(conditions);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, name, status, ordering, slug, url, category_id) => {
    const conditions = { name, status, ordering, slug, url, category_id };
    return await model.updateOne({ _id: id }, conditions);
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
    let conditions = {};
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'i');
    if (category_id) conditions.category_id = category_id;
    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getAllWithoutConditions = async () => {
    return model.find();
};

// Count
const countByStatus = async (status, keyword, category_id) => {
    let conditions = {};
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'i');
    if (category_id) conditions.category_id = category_id;
    return await model.count(conditions);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getAllWithoutConditions,
    updateOneById,
    countByStatus,
    changeStatusById,
    changeOrderingById,
    changeUrlById,
};
