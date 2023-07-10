const sliderValidator = {
    name: { length: { min: 1, max: 8 } },
    ordering: { length: { min: 1, max: 100 } },
};

module.exports = {
    sliderValidator,
    sliderCollection: 'slider',
};
