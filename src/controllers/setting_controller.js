const fs = require('fs');

const { settingService: service } = require('@services');
const { catchAsync } = require('@helpers');

const renderSetting = catchAsync(async (req, res) => {
    const setting = await service.getSetting();
    const options = {
        page: 'Setting',
        setting,
    };
    res.render('backend/pages/setting', options);
});

const handleUpdateSetting = catchAsync(async (req, res) => {
    const formData = req.body;
    const setting = await service.getSetting();
    let headerLogo = setting.header.logo;
    let discountImage = setting.discount.image;
    let footerLogo = setting.footer.logo;
    let imagePath = '';
    if (req.files) {
        if (req.files.headerLogo) {
            imagePath = `public\\uploads\\setting\\${headerLogo}`;
            headerLogo = req.files.headerLogo[0].filename;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        if (req.files.discountImage) {
            imagePath = `public\\uploads\\setting\\${discountImage}`;
            discountImage = req.files.discountImage[0].filename;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        if (req.files.footerLogo) {
            imagePath = `public\\uploads\\setting\\${footerLogo}`;
            footerLogo = req.files.footerLogo[0].filename;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
    }
    const data = {
        header: {
            logo: headerLogo,
            searchIcon: formData.headerSIcon,
            cartIcon: formData.headerCIcon,
        },
        info: {
            left: {
                name: formData.infoLName,
                description: formData.infoLDes,
            },
            mid: {
                name: formData.infoMName,
                description: formData.infoMDes,
                button: {
                    name: formData.infoButtMName,
                    icon: formData.infoButtMIcon,
                    color: formData.infoButtMColor,
                },
            },
            right: {
                name: formData.infoRName,
                link: {
                    facebook: formData.infoLinkFb,
                    zalo: formData.infoLinkZalo,
                    phone: formData.infoPhone,
                    instagram: formData.infoLinkIns,
                    git: formData.infoLinkGit,
                    gmail: formData.infoGmail,
                },
            },
        },
        purchase: {
            first: {
                name: formData.purchaseSTName,
                icon: formData.purchaseSTIcon,
                description: formData.purchaseSTDes,
            },
            second: {
                name: formData.purchaseNDName,
                icon: formData.purchaseNDIcon,
                description: formData.purchaseNDDes,
            },
            third: {
                name: formData.purchaseRDName,
                icon: formData.purchaseRDIcon,
                description: formData.purchaseRDDes,
            },
            fourth: {
                name: formData.purchaseTHName,
                icon: formData.purchaseTHIcon,
                description: formData.purchaseTHDes,
            },
        },
        discount: {
            name: formData.discountName,
            description: formData.discountDes,
            button: {
                name: formData.discountButtName,
                icon: formData.discountButtIcon,
                color: formData.discountButtColor,
            },
            image: discountImage,
        },
        footer: {
            logo: footerLogo,
            subcribeDescription: formData.footerDes,
            address: formData.footerAddress,
            phone: formData.footerPhone,
            fax: formData.footerFax,
            email: formData.footerEmail,
            button: {
                name: formData.footerButtName,
                icon: formData.footerButtIcon,
                color: formData.footerButtColor,
            },
            link: {
                facebook: formData.footerLinkFb,
                git: formData.footerLinkGit,
            },
        },
    };
    const stringData = JSON.stringify(data);
    await service.updateSetting(stringData);
    res.redirect('/admin/setting');
});

module.exports = {
    renderSetting,
    handleUpdateSetting,
};
