const { itemModel } = require('@models');

const create = async (name, status, ordering, slug, image) => {
    return await itemModel.create({ name, status, ordering, slug, image });
};

const deleteOneById = async (id) => {
    return await itemModel.deleteOne({ _id: id });
};

const getOneById = async (id) => {
    return await itemModel.findById(id);
};

const updateOneById = async (id, name, status, ordering, slug, image) => {
    const condition = { id, name, status, ordering, slug };
    if (image) condition.image = image;
    return await itemModel.updateOne({ _id: id }, condition);
};

const getAll = async (status, keyword, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    return await itemModel
        .find(condition)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const countByStatus = async (status, keyword) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    return await itemModel.count(condition);
};

const changeStatusById = async (id, status) => {
    return await itemModel.updateOne({ _id: id }, { status });
};

const changeOrderingById = async (id, ordering) => {
    return await itemModel.updateOne({ _id: id }, { ordering });
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
