const { settingModel: model } = require('@models');

const getSetting = async () => {
    const { setting } = await model.findOne();
    return JSON.parse(setting);
};

const updateSetting = (setting) => {
    return model.updateOne({}, { setting });
};

module.exports = { getSetting, updateSetting };
