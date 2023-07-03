// change status
const handleStatusClick = (collection, id, status, query) => {
    const statusDOM = $(`#status-${id}`);
    const filterAllDOM = $(`#status-all`);
    const filterActiveDOM = $(`#status-active`);
    const filterInactiveDOM = $(`#status-inactive`);

    const newUrl = `${collection}/changeStatusAjax/${id}/${status}${query}`;
    $.ajax({
        type: 'GET',
        url: new URL(`http://localhost:3000/admin/${collection}/changeStatusAjax/${id}/${status}${query}`),
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let toastrMessage = data.message;

                statusDOM.html(
                    `<a 
                        type="button" 
                        class="btn btn-${data.status === 'active' ? 'success' : 'danger'}"
                        href="javascript:handleStatusClick('${collection}','${id}', '${data.status}', '${query}')"
                    >${data.status}
                    </a>`,
                );
                filterAllDOM.text(`${data.filter.allStatus.name} (${data.filter.allStatus.count})`);
                filterActiveDOM.text(`${data.filter.activeStatus.name} (${data.filter.activeStatus.count})`);
                filterInactiveDOM.text(`${data.filter.inactiveStatus.name} (${data.filter.inactiveStatus.count})`);

                toastr.success(toastrMessage, 'SUCCESS', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 10000,
                });
            }

            if (data.error) {
                console.log(data.message);
                let toastrMessage = data.message;
                toastr.error(toastrMessage, 'ERROR', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 30000,
                });
            }
        },
    });
};
// change url

const handleUrlChange = (collection, id) => {
    const urlDOM = $(`#url-${id}`);
    const newUrlString = urlDOM.find('input').val();
    const encodedParam = encodeURIComponent(newUrlString);
    const url = `${collection}/changeUrlAjax/${id}/${encodedParam}`;

    $.ajax({
        type: 'GET',
        url: new URL(`http://localhost:3000/admin/${collection}/changeUrlAjax/${id}/${encodedParam}`),
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let toastrMessage = data.message;

                urlDOM.find('input').val(data.url);

                toastr.success(toastrMessage, 'SUCCESS', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 10000,
                });
            }
        },
    });
};

// change ordering
const handleOrderingChange = (collection, id) => {
    const orderingDOM = $(`#ordering-${id}`);
    const newOrdering = orderingDOM.find('input').val();

    const orderingUrl = `${collection}/changeOrderingAjax/${id}/${newOrdering}`;

    $.ajax({
        type: 'GET',
        url: new URL(`http://localhost:3000/admin/${collection}/changeOrderingAjax/${id}/${newOrdering}`),
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let toastrMessage = data.message;

                orderingDOM.find('input').val(data.ordering);

                toastr.success(toastrMessage, 'SUCCESS', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 10000,
                });
            }
        },
    });
};

const handleDelete = (collection, id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.pathname = `admin/${collection}/delete/${id}`;
        }
    });
};

const handleShowImage = () => {
    const inputDOM = $('#add-image');
    const imageDOM = $('#show-image');
    const file = inputDOM.prop('files')[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageSrc = event.target.result;
            imageDOM.prop('src', imageSrc);
        };

        reader.readAsDataURL(file);
    }
};

const handleShowImageG = () => {
    const inputDOM = $('#add-image-g');

    const files = inputDOM.prop('files');
    console.log(files);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            const imageDOM = $(`#show-image-g-${i}`);
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageSrc = event.target.result;
                imageDOM.prop('src', imageSrc);
            };

            reader.readAsDataURL(file);
        }
    }
};

const handleShowImageDis = () => {
    const inputDOM = $('#add-image-dis');
    const imageDOM = $('#show-image-dis');
    const file = inputDOM.prop('files')[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageSrc = event.target.result;
            imageDOM.prop('src', imageSrc);
        };

        reader.readAsDataURL(file);
    }
};
const handleShowImageFoo = () => {
    const inputDOM = $('#add-image-foo');
    const imageDOM = $('#show-image-foo');
    const file = inputDOM.prop('files')[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageSrc = event.target.result;
            imageDOM.prop('src', imageSrc);
        };

        reader.readAsDataURL(file);
    }
};
const handleFilterOption = (collection, category_id, category_name, path, query) => {
    const optionDOM = $('#list-categories');
    const buttDOM = $('#menu-dropdown');
    const url = `${collection}/getListCategoriesAjax/${category_id}`;
    $.ajax({
        type: 'GET',
        url: new URL(`http://localhost:3000/admin/${collection}/getListCategoriesAjax/${category_id}`),
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                buttDOM.html(category_name);
                let options = data.categories
                    .map((category) => {
                        return `
                    <a 
                        class="dropdown-item"  
                        href="/admin/${collection}${path}?page=1${query}&category=${category.value}" 
                    >${category.name}</a>
                `;
                    })
                    .join('');
                optionDOM.html(options);
            }
        },
    });
};

const handleSelectOption = (collection, category_id) => {
    const optionDOM = $('#list-categories');
    const url = `${collection}/getListCategoriesAjax/${category_id}`;
    $.ajax({
        type: 'GET',
        url: new URL(`http://localhost:3000/admin/${collection}/getListCategoriesAjax/${category_id}`),
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let options = data.categories
                    .map((category) => {
                        return `
                    <option
                        value="${category.value}"
                    >${category.name}</a>
                `;
                    })
                    .join('');
                optionDOM.html(options);
            }
        },
    });
};

const handleChangeIsSpecial = (collection, id, isSpecial) => {
    const inputDOM = $(`#special-${id}`);
    const newValue = inputDOM.prop('checked');
    const is_special = `${collection}/changeIsSpecialAjax/${id}/${newValue}`;
    $.ajax({
        type: 'GET',
        url: new URL(`http://localhost:3000/admin/${collection}/changeIsSpecialAjax/${id}/${newValue}`),
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let toastrMessage = data.message;

                inputDOM.val(data.is_special);

                toastr.success(toastrMessage, 'SUCCESS', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 10000,
                });
            }
        },
    });
};
