const { itemModel: model } = require('@models');

const create = async (name, status, ordering, slug, image) => {
    const condition = { name, status, ordering, slug };
    if (image) condition.image = image;
    return await model.create(condition);
};

const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

const getOneById = async (id) => {
    return await model.findById(id);
};

const updateOneById = async (id, name, status, ordering, slug, image) => {
    const condition = { id, name, status, ordering, slug };
    if (image) condition.image = image;
    return await model.updateOne({ _id: id }, condition);
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

const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    return await model.count(condition);
};

const changeStatusById = async (id, status) => {
    return await model.updateOne({ _id: id }, { status });
};

const changeOrderingById = async (id, ordering) => {
    return await model.updateOne({ _id: id }, { ordering });
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    updateOneById,
    countByStatus,
    changeStatusById,
    changeOrderingById,
};
