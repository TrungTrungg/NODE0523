// Validate Form
$(document).ready(function () {
    const regFormDOM = $('#register-form');
    const loginFormDOM = $('#login-form');
    const contactFormDOM = $('#template-contactform');
    const subscribeFomDOM = $('#widget-subscribe-form');
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
    contactFormDOM.submit((event) => {
        event.preventDefault();

        const formData = contactFormDOM.serialize();
        $.ajax({
            type: 'POST',
            url: '/contact',
            data: formData,
            dataType: 'json',
            success: (data) => {
                if (data.success) {
                    let toastrMessage = data.message;
                    toastr.success(toastrMessage, 'SUCCESS', {
                        newestOnTop: true,
                        closeButton: false,
                        progressBar: true,
                        preventDuplicates: false,
                        showMethod: 'slideDown',
                        timeOut: 15000,
                    });
                    $('.form-process').attr('style', 'display: none !important');
                    $('.form-result').attr('style', 'display: block !important');
                }
            },
        });
    });
    subscribeFomDOM.submit((event) => {
        event.preventDefault();
        const formData = subscribeFomDOM.serialize();

        $.ajax({
            type: 'POST',
            url: '/subscribe',
            data: formData,
            dataType: 'json',
            success: (data) => {
                if (data.success) {
                    let toastrMessage = data.message;
                    toastr.success(toastrMessage, 'SUCCESS', {
                        newestOnTop: true,
                        closeButton: false,
                        progressBar: true,
                        preventDuplicates: false,
                        showMethod: 'slideDown',
                        timeOut: 15000,
                    });
                    $('#icon-check').addClass('icon-line-check');
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
});
