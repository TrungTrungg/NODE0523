const { categoryService: service, brandService } = require('@services');

const getListCategories = async (id) => {
    const results = await service.getNameId(id);

    const categories = results.map((result) => {
        const { id, name, category_id } = result;
        return { value: id, name, category_id };
    });

    return categories;
};

const getListBrands = async () => {
    const results = await brandService.getBrandCateogries();

    const categories = results.map((result) => {
        const { id, name } = result;
        return { value: id, name };
    });

    return categories;
};

module.exports = {
    getListCategories,
    getListBrands,
};
