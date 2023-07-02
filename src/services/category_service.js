const { categoryModel: model } = require('@models');

// Create
const create = async (name, status, ordering, slug, url, category_id) => {
    const condition = { name, status, ordering, slug, url, category_id };
    return await model.create(condition);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, name, status, ordering, slug, url, category_id) => {
    const condition = { name, status, ordering, slug, url, category_id };
    return await model.updateOne({ _id: id }, condition);
};

const changeFieldById = async (id, field, value) => {
    const conditions = {};

    if (field === 'status') conditions.status = value;
    if (field === 'ordering') conditions.ordering = value;
    if (field === 'url') conditions.url = value;
    if (field === 'isMenu') conditions.isMenu = value;

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

const getArticleCategories = async (status, keyword, { currentPage, itemPerPage }) => {
    const [{ id }] = await model.find({ name: 'Tin tức' });
    let condition = { category_id: id };
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
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

const getMainCategory = async (id) => {
    return await model.find({ isMenu: true }).sort({ ordering: 1 });
};

const getCategory = async (id) => {
    return await model.findById(id);
};

const getBlogCategory = async () => {
    const [{ id }] = await model.find({ name: 'Tin tức' });
    const BlogChildCategory = await model.find({ category_id: id });
    const categories = BlogChildCategory.map((result) => {
        const { _id, name } = result;
        return { value: _id, name };
    });

    return categories;
};

const getArticleCategoriesID = async () => {
    return await model.find({ name: 'Tin tức' });
};

const getShopCategoriesID = async () => {
    return await model.find({ name: 'Shop' });
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
    getArticleCategories,
    getNameId,
    getSubCategory,
    getMainCategory,
    getCategory,
    getArticleCategoriesID,
    getShopCategoriesID,
    updateOneById,
    countByStatus,
    changeFieldById,
    getBlogCategory,
};
