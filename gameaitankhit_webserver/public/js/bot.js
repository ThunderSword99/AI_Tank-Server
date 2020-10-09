var url = location.protocol + "//" + document.domain + ":" + location.port;
function upB() {
    $.ajax({
        type: 'GET',
        url: url + '/user/bot/create',
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
        })
        .fail(() => { })
}