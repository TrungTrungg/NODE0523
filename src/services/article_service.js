const { articleModel: model } = require('@models');

// Create
const create = async (
    name,
    status,
    ordering,
    slug,
    author,
    description,
    content,
    url,
    is_special,
    category_id,
    image,
) => {
    const condition = {
        name,
        status,
        ordering,
        slug,
        category_id,
        author,
        description,
        content,
        url,
        category_id,
    };
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
    slug,
    ordering,
    author,
    description,
    content,
    is_special,
    category_id,
    image,
) => {
    const condition = { name, status, slug, ordering, author, description, content, is_special, category_id };
    if (image) condition.image = image;
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
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    if (category_id) condition.category_id = category_id;
    return await model
        .find(condition)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getArticleSpecial = async (category_id) => {
    const conditions = { is_special: true, status: 'active' };
    if (category_id) conditions.category_id = category_id;
    return await model.find(conditions).sort({ ordering: 1 }).limit(2);
};

const getArticleCurrent = async () => {
    const conditions = { status: 'active' };
    return await model.find(conditions).sort({ createdAt: -1 }).limit(3);
};

const getArticleRelated = async (category_id) => {
    const conditions = { status: 'active' };
    if (category_id) conditions.category_id = category_id;
    return await model.find(conditions).limit(3);
};

const getArticleWithCategory = async (category_id, { itemPerPage, skip }) => {
    const conditions = {};
    if (category_id) conditions.category_id = category_id;
    return await model.find(conditions).sort({ createdAt: -1 }).skip(skip).limit(itemPerPage);
};

// Count
const countByStatus = async (status, keyword, category_id) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    if (category_id) condition.category_id = category_id;

    return await model.count(condition);
};

const countArticleByCategory = async (category_id) => {
    const conditions = {};
    if (category_id) conditions.category_id = category_id;
    return await model.count(conditions);
};
const countAll = async () => {
    return await model.count();
};
module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getArticleSpecial,
    getArticleCurrent,
    getArticleRelated,
    getArticleWithCategory,
    updateOneById,
    changeFieldById,
    countByStatus,
    countArticleByCategory,
    countAll,
};
