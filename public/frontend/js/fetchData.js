$(document).ready(function () {
    console.log(new URL());
    $.ajax({
        type: 'GET',
        url: 'url',
        data: 'data',
        dataType: 'dataType',
        success: function (response) {},
    });
});
