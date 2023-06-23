const { articleModel: model } = require('@models');

// Create
const create = async (
    name,
    status,
    ordering,
    slug,
    category_id,
    post_date,
    author,
    description,
    url,
    is_special,
    image,
) => {
    const condition = {
        name,
        status,
        ordering,
        slug,
        category_id,
        post_date,
        author,
        description,
        url,
    };
    if (is_special === 'yes') condition.is_special = true;
    else condition.is_special = false;
    if (image) condition.image = image;
    return await model.create(condition);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (
    id,
    name,
    status,
    ordering,
    category_id,
    post_date,
    author,
    description,
    url,
    is_special,
    image,
) => {
    const condition = { name, status, ordering, category_id, post_date, author, description, url };
    if (image) condition.image = image;
    if (is_special === 'yes') condition.is_special = true;
    else condition.is_special = false;
    return await model.updateOne({ _id: id }, condition);
};

const changeFieldById = async (id, field, value) => {
    const conditions = {};

    if (field === 'status') conditions.status = value;
    if (field === 'ordering') conditions.ordering = value;
    if (field === 'url') conditions.url = value;

    return await model.updateOne({ _id: id }, conditions);
};

const changeStatusById = async (id, status) => {
    return await model.updateOne({ _id: id }, { status });
};

const changeUrlById = async (id, url) => {
    return await model.updateOne({ _id: id }, { url });
};

const changeOrderingById = async (id, ordering) => {
    return await model.updateOne({ _id: id }, { ordering });
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

const getArticleSpecial = async () => {
    return await model.find({ is_special: true }).sort({ ordering: 1 });
};

const getAllNameId = async () => {
    return await model.find({ category_id: { $exists: false } }).select('_id name');
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
    getArticleSpecial,
    getAllNameId,
    updateOneById,
    countByStatus,
    changeFieldById,
    changeStatusById,
    changeOrderingById,
    changeUrlById,
};
