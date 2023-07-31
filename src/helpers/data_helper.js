const fsHelper = require('@helpers/fs_helper');

const resetData = () => {
    if (fsHelper.checkFileExist('src/files/homeData.txt')) {
        fsHelper.deleteFile('src/files/homeData.txt');
    }
    if (fsHelper.checkFileExist('src/files/blogData.txt')) {
        fsHelper.deleteFile('src/files/blogData.txt');
    }
    if (fsHelper.checkFileExist('src/files/shopData.txt')) {
        fsHelper.deleteFile('src/files/shopData.txt');
    }
    if (fsHelper.checkFileExist('src/files/shopDetailData.txt')) {
        fsHelper.deleteFile('src/files/shopDetailData.txt');
    }
};

module.exports = { resetData };
