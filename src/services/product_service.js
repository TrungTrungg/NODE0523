const { productModel: model } = require('@models');

// Create
const create = async (
    name,
    slug,
    status,
    ordering,
    special,
    showHome,
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
        specialShowhome: {
            special,
            showHome,
        },
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
    // if (is_special === 'yes') condition.is_special.special = true;
    // else condition.is_special.special = false;
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
    special,
    showHome,
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
        specialShowhome: { special, showHome },
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
    // if (is_special === 'yes') condition.is_special = true;
    // else condition.is_special = false;
    return await model.updateOne({ _id: id }, condition);
};

const changeFieldById = async (id, field, value) => {
    const conditions = {};

    if (field === 'status') conditions.status = value;
    if (field === 'ordering') conditions.ordering = value;
    if (field === 'url') conditions.url = value;
    if (field === 'special') conditions.specialShowhome = { special: value };
    if (field === 'showHome') conditions.specialShowhome = { showHome: value };

    return await model.updateOne({ _id: id }, conditions);
};

// Get
const getOneById = async (id) => {
    return await model.findById(id);
};

const getAll = async (status, keyword, category_id, brand_id, { currentPage, itemPerPage }, price, sort, sale) => {
    let conditions = {};
    let sortField = { updatedAt: -1, createdAt: -1 };
    if (price) {
        const minPrice = price.split(',')[0];
        const maxPrice = price.split(',')[1];
        if (minPrice === 'lower') {
            conditions.price = { $lt: maxPrice };
        } else if (minPrice === 'higher') {
            conditions.price = { $gt: maxPrice };
        } else conditions.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (sort) {
        if (sort === 'asc') sortField = { name: 1 };
        else sortField = { name: -1 };
    }
    if (sale) {
        const minSale = sale.split(',')[0];
        const maxSale = sale.split(',')[1];
        if (minSale === 'lower') {
            conditions.sale = { $lt: maxSale };
        } else if (minSale === 'higher') {
            conditions.sale = { $gt: maxSale };
        } else conditions.sale = { $gte: minSale, $lte: maxSale };
    }
    if (status) conditions.status = status.toLowerCase();
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (category_id) conditions.category_id = category_id;
    if (brand_id) conditions.brand_id = brand_id;
    return await model
        .find(conditions)
        .sort(sortField)
        .skip(itemPerPage * (currentPage - 1))
        .limit(itemPerPage);
};

const getByCondition = async (category_id, params, limit, id) => {
    const conditions = {};
    if (id) conditions._id = { $nin: id };
    if (category_id) conditions.category_id = category_id;
    if (params) {
        if (params === 'popular') {
            conditions['specialShowhome.showHome'] = true;
        } else if (params === 'special') {
            conditions['specialShowhome.special'] = true;
        }
    }

    return await model.find(conditions).sort({ createdAt: 1 }).limit(limit);
};

// Count
const countByStatus = async (status, keyword, category_id, brand_id) => {
    let condition = {};
    if (status) condition.status = status.toLowerCase();
    if (keyword) condition.name = new RegExp(keyword, 'gi');
    if (category_id) condition.category_id = category_id;
    if (brand_id) condition.brand_id = brand_id;

    return await model.count(condition);
};

const countByCategory = async (category_id, keyword, brand_id, price, sale) => {
    let conditions = {};
    if (keyword) conditions.name = new RegExp(keyword, 'gi');
    if (category_id) conditions.category_id = category_id;
    if (brand_id) conditions.brand_id = brand_id;
    if (price) {
        const minPrice = price.split(',')[0];
        const maxPrice = price.split(',')[1];
        if (minPrice === 'lower') {
            conditions.price = { $lt: maxPrice };
        } else if (minPrice === 'higher') {
            conditions.price = { $gt: maxPrice };
        } else conditions.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (sale) {
        const minSale = sale.split(',')[0];
        const maxSale = sale.split(',')[1];
        if (minSale === 'lower') {
            conditions.sale = { $lt: maxSale };
        } else if (minSale === 'higher') {
            conditions.sale = { $gt: maxSale };
        } else conditions.sale = { $gte: minSale, $lte: maxSale };
    }

    return await model.count(conditions);
};

module.exports = {
    create,
    deleteOneById,
    getOneById,
    getAll,
    getByCondition,
    updateOneById,
    changeFieldById,
    countByStatus,
    countByCategory,
};
