const { productModel: model } = require('@models');

// Create
const create = async (
    name,
    slug,
    status,
    ordering,
    is_special,
    price,
    quantity,
    sold,
    sale,
    description,
    size,
    ram,
    cpu,
    ssd,
    vga,
    category_id,
    brand_id,
    image,
    gallery_image,
) => {
    const condition = {
        name,
        slug,
        status,
        ordering,
        price,
        quantity,
        sold,
        sale,
        description,
        specification: {
            size,
            ram,
            cpu,
            ssd,
            vga,
        },
        category_id,
        brand_id,
    };
    if (is_special === 'yes') condition.is_special = true;
    else condition.is_special = false;
    if (image) condition.image = image;
    if (gallery_image) condition.gallery_image = gallery_image;
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
    slug,
    status,
    ordering,
    is_special,
    price,
    quantity,
    sold,
    sale,
    description,
    size,
    ram,
    cpu,
    ssd,
    vga,
    category_id,
    brand_id,
    image,
    gallery_image,
) => {
    const condition = {
        name,
        slug,
        status,
        ordering,
        price,
        quantity,
        sold,
        sale,
        description,
        size,
        ram,
        cpu,
        ssd,
        vga,
        category_id,
        brand_id,
    };
    if (image) condition.image = image;
    if (gallery_image) condition.gallery_image = gallery_image;
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

const getAll = async (status, keyword, category_id, brand_id, { currentPage, itemPerPage }) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    if (category_id) condition.category_id = category_id;
    if (brand_id) condition.brand_id = brand_id;
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
const countByStatus = async (status, keyword, category_id, brand_id) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'i');
    if (category_id) condition.category_id = category_id;
    if (brand_id) condition.brand_id = brand_id;

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
