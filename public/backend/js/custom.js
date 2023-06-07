$(document).ready(function () {
    $('#check-all').click(() => {
        const isChecked = $('#check-all').prop('checked');
        $('.checkbox').prop('checked', isChecked);
    });
});
