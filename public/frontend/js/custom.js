// Validate Form
regFormDOM.submit(function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    const url = '/auth/register';
    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                const toastrMessage = data.message;
                toastr.success(toastrMessage, 'SUCCESS', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 10000,
                });
                window.location.href = '/';
            }

            if (data.error) {
                const errorMessage = data.message
                    .map((error) => {
                        return `
                        <li>
                            <b>${error.path}:</b> ${error.msg}
                        </li>    
                `;
                    })
                    .join('');
                let toastrMessage = errorMessage;
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
});
loginFormDOM.submit(function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    const url = '/auth/login';
    $.ajax({
        type: 'POST',
        url: url,
        data: formData,
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                window.location.href = document.referrer;
            }

            if (data.error) {
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
});
