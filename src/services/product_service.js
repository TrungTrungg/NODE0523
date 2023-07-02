const { productModel: model } = require('@models');

// Create
const create = async (name, status, ordering, slug, author, description, url, is_special, category_id, image) => {
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
        category_id,
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
const updateOneById = async (id, name, status, ordering, author, description, url, is_special, category_id, image) => {
    const condition = { name, status, ordering, category_id, author, description, url };
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
    if (field === 'is_special') conditions.is_special = value;

    return await model.updateOne({ _id: id }, conditions);
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

const getArticleSpecial = async (category_id) => {
    const conditions = { is_special: true };
    if (category_id) conditions.category_id = category_id;
    return await model.find(conditions).sort({ ordering: 1 }).limit(3);
};

const getArticleCurrent = async (category_id) => {
    const conditions = {};
    if (category_id) conditions.category_id = category_id;
    return await model.find(conditions).sort({ createdAt: -1 }).limit(3);
};

const getArticleWithCategory = async (category_id, { itemPerPage, skip }) => {
    return await model.find({ category_id }).sort({ createdAt: -1 }).skip(skip).limit(itemPerPage);
};

// Count
const countByStatus = async (status, keyword, category_id) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    if (category_id) condition.category_id = category_id;

    return await model.count(condition);
};

const countArticleByCategory = async (category_id) => {
    return await model.count({ category_id });
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getArticleSpecial,
    getArticleCurrent,
    getArticleWithCategory,
    updateOneById,
    changeFieldById,
    countByStatus,
    countArticleByCategory,
};
