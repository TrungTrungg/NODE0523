// Validate Form
$(document).ready(function () {
    const regFormDOM = $('#register-form');
    const loginFormDOM = $('#login-form');
    const forgotPasswordFormDOM = $('#forgotPassword-form');
    const changeInfoFormDOM = $('#changeInfo-form');
    const changePasswordFormDOM = $('#changePassword-form');
    const contactFormDOM = $('#template-contactform');
    const subscribeFomDOM = $('#widget-subscribe-form');
    regFormDOM.submit(function (event) {
        event.preventDefault();
        const formData = $(this).serialize();
        const url = '/register';
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
                    window.location.href = '/dang-ky-dang-nhap';
                }

                if (data.error) {
                    const errorMessage = data.message
                        .map((error) => {
                            return `
                        <li>
                            <b> ${error.msg}</b>
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
        const url = '/login';
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
    forgotPasswordFormDOM.submit(function (event) {
        event.preventDefault();
        const formData = forgotPasswordFormDOM.serialize();
        const url = '/resetPassword';
        $.ajax({
            type: 'POST',
            url: url,
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
                        timeOut: 30000,
                    });
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
    forgotPasswordFormDOM.submit(function (event) {
        event.preventDefault();
        const formData = forgotPasswordFormDOM.serialize();
        const url = '/resetPassword';
        $.ajax({
            type: 'POST',
            url: url,
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
                        timeOut: 30000,
                    });
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
    changeInfoFormDOM.submit(function (event) {
        event.preventDefault();
        const formData = changeInfoFormDOM.serialize();
        const url = '/changeInfo';
        $.ajax({
            type: 'POST',
            url: url,
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
                        timeOut: 30000,
                    });
                    setTimeout(() => {
                        window.location.href = '/nguoi-dung/#tab-info';
                    }, 1500);
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
    changePasswordFormDOM.submit(function (event) {
        event.preventDefault();
        const formData = changePasswordFormDOM.serialize();
        const url = '/changePassword';
        $.ajax({
            type: 'POST',
            url: url,
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
                        timeOut: 30000,
                    });
                }

                if (data.error) {
                    const errorMessage = data.message
                        .map((error) => {
                            return `
                        <li>
                            <b>${error.path}</b>
                        </li>    
                `;
                        })
                        .join('');
                    toastrMessage = errorMessage;
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
                            <b>${error.msg}</b>
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
