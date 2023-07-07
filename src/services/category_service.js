const { categoryModel: model } = require('@models');

// Create
const create = async (name, status, ordering, slug, url, category_id) => {
    const conditions = { name, status, ordering, slug, url, category_id };
    if (category_id) conditions.category_id = category_id;
    return await model.create(conditions);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, name, status, ordering, slug, url, category_id) => {
    const conditions = { name, status, ordering, slug, url };
    if (category_id) conditions.category_id = category_id;

    return await model.updateOne({ _id: id }, conditions);
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

const getAll = async (status, keyword, category_id, { currentPage, itemPerPage }, listCategoryId) => {
    let conditions = {};
    let currPage = 0;
    let itemPPage = 0;
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (listCategoryId) conditions.category_id = listCategoryId;
    if (currentPage) currPage = currentPage;
    if (itemPerPage) itemPPage = itemPerPage;
    if (category_id) conditions.category_id = category_id;
    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPPage * (currPage - 1))
        .limit(itemPPage);
};

const getArticleCategories = async (status, keyword, { currentPage, itemPerPage }) => {
    const [{ id }] = await model.find({ name: 'Tin tức' });
    let conditions = { category_id: id };
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getNameId = async (id) => {
    let conditions = { $exists: true, $eq: '' };
    if (id) conditions = id;
    return await model.find({ category_id: conditions }).select('id name category_id');
};

const getSubCategory = async () => {
    let conditions = { $exists: true, $ne: '' };
    return await model.find({ category_id: conditions });
};

const getMenuCategory = async (id) => {
    return await model.find({ isMenu: true }).sort({ ordering: 1 });
};

const getMainCategories = async (status, keyword, { currentPage, itemPerPage }, category_id) => {
    let conditions = {};
    let currPage = 0;
    let itemPPage = 0;
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (currentPage) currPage = currentPage;
    if (itemPerPage) itemPPage = itemPerPage;
    if (category_id) conditions.category_id = category_id;
    else conditions.category_id = { $exists: true, $eq: '' };
    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPPage * (currPage - 1))
        .limit(itemPPage);
};

const getCategory = async (id) => {
    return await model.findById(id);
};

const getBlogCategory = async () => {
    const { id } = await model.findOne({ name: 'Tin tức' });
    const BlogChildCategory = await model.find({ category_id: id });
    const categories = BlogChildCategory.map((result) => {
        const { id, name, category_id } = result;
        return { value: id, name, category_id };
    });

    return categories;
};

const getShopCategory = async (id) => {
    return await model.find({ category_id: id });
};

const getArticleCategoriesID = async () => {
    return await model.findOne({ name: 'Tin tức' });
};

const getShopCategoriesID = async () => {
    return await model.findOne({ name: 'Shop' });
};
// Count
const countByStatus = async (status, keyword, category_id, listCategoryId) => {
    let conditions = {};
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (listCategoryId) conditions.category_id = listCategoryId;
    if (category_id) conditions.category_id = category_id;
    return await model.count(conditions);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getArticleCategories,
    getNameId,
    getSubCategory,
    getMenuCategory,
    getMainCategories,
    getCategory,
    getArticleCategoriesID,
    getShopCategoriesID,
    updateOneById,
    countByStatus,
    changeFieldById,
    getBlogCategory,
    getShopCategory,
};
