const handlePagination = async (totalItems, currentPage, itemPerPage, pageRange) => {
    const totalPages = Math.ceil(totalItems / itemPerPage);
    const middle = Math.ceil(pageRange / 2);

    currentPage = currentPage <= 0 || currentPage > totalPages ? 1 : currentPage;
    let min = currentPage - middle + 1 <= 0 ? 1 : currentPage - middle + 1;
    let max = min + pageRange - 1 >= totalPages ? totalPages : min + pageRange - 1;
    min = max - pageRange + 1 <= 0 ? 1 : max - pageRange + 1;
    let skip = itemPerPage * (currentPage - 1);

    return { totalPages, currentPage, itemPerPage, skip, min, max };
};

module.exports = {
    handlePagination,
};
