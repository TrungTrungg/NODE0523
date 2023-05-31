$(document).ready(function () {
    $('a').each(function () {
        var href = $(this).attr('href');
        if (href === window.location.pathname) {
            $(this).addClass('active');
        }
    });

    $('#check-all').click(() => {
        const isChecked = $('#check-all').prop('checked');
        $('.checkbox').prop('checked', isChecked);
    });
});
