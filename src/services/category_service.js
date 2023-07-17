const { categoryModel: model } = require('@models');

// Create
const create = async (name, slug, status, ordering, url, category_id) => {
    const conditions = { name, status, ordering, slug, url, category_id };
    if (category_id) conditions.category_id = category_id;
    return await model.create(conditions);
};

// Delete
const deleteOneById = async (id) => {
    return await model.deleteOne({ _id: id });
};

// Update
const updateOneById = async (id, name, slug, status, ordering, url, category_id) => {
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

    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (listCategoryId) conditions.category_id = listCategoryId;
    if (currentPage) currentPage = currentPage;
    if (itemPerPage) itemPerPage = itemPerPage;
    if (category_id) conditions.category_id = category_id;
    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getMainCategories = async (status, keyword, { currentPage, itemPerPage }, category_id) => {
    let conditions = {};
    if (currentPage) currentPage = currentPage;
    if (itemPerPage) itemPerPage = itemPerPage;

    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (category_id) conditions.category_id = { $exists: true, $in: ['', category_id] };
    else conditions.category_id = { $exists: true, $eq: '' };

    return await model
        .find(conditions)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getIdByName = async (name) => {
    return await model.findOne({ name });
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

const getCategory = async (id) => {
    return await model.findById(id);
};

const getCategoriesById = async (id) => {
    const BlogChildCategory = await model.find({ category_id: id });
    const categories = BlogChildCategory.map((result) => {
        const { id, name, category_id } = result;
        return { value: id, name, category_id };
    });

    return categories;
};

const getCategiresByCategoryId = async (category_id) => {
    return await model.find({ category_id });
};

const getShopCategory = async (id) => {
    return await model.find({ category_id: id });
};

// Count
const countByStatus = async (status, keyword, type, category_id, listCategoryId) => {
    let conditions = {};
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (type === 'main') {
        if (category_id) conditions.category_id = { $exists: true, $in: ['', category_id] };
    }
    if (type === 'article') {
        if (category_id) conditions.category_id = category_id;
    }
    if (type === 'product') {
        if (category_id) conditions.category_id = category_id;
        if (listCategoryId) conditions.category_id = { $in: listCategoryId };
    }
    return await model.count(conditions);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getIdByName,
    getNameId,
    getSubCategory,
    getMenuCategory,
    getMainCategories,
    getCategory,
    getCategiresByCategoryId,
    updateOneById,
    countByStatus,
    changeFieldById,
    getCategoriesById,
    getShopCategory,
};
