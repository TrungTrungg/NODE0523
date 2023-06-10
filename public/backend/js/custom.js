// change status
const handleStatusClick = (id, status, query) => {
    const statusDOM = $(`#status-${id}`);
    const filterAllDOM = $(`#status-all`);
    const filterActiveDOM = $(`#status-active`);
    const filterInactiveDOM = $(`#status-inactive`);

    const newUrl = `item/changeStatusAjax/${id}/${status}${query}`;

    $.ajax({
        type: 'GET',
        url: new URL(newUrl, 'http://localhost:3000/admin/item').href,
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let toastrMessage = data.message;

                statusDOM.html(
                    `<a 
                        type="button" 
                        class="btn btn-${data.status === 'active' ? 'success' : 'danger'}"
                        href="javascript:handleStatusClick('${id}', '${data.status}', '${query}')">${data.status}
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

// change ordering
const handleOrderingChange = (id) => {
    const orderingDOM = $(`#ordering-${id}`);
    const newOrdering = orderingDOM.find('input').val();

    const orderingUrl = `item/changeOrderingAjax/${id}/${newOrdering}`;

    $.ajax({
        type: 'GET',
        url: new URL(orderingUrl, 'http://localhost:3000/admin/item').pathname,
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                console.log(data.ordering);
                let toastrMessage = data.message;

                orderingDOM.find('input').val(data.ordering);
                // orderingDOM.html(
                //     `<input
                //         onChange="javascript:handleOrderingChange('${id}')"
                //         type="number"
                //         value="${data.ordering}"
                //         class="ordering"
                //     />`,
                // );

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
