const { categoryService: service } = require('@services');

const getListCategories = async (id) => {
    const results = await service.getNameId(id);

    const categories = results.map((result) => {
        const { _id, name } = result;
        return { value: _id, name };
    });

    return categories;
};

module.exports = {
    getListCategories,
};
