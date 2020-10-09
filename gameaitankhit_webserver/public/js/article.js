var url = location.protocol + "//" + document.domain + ":" + location.port;
function editA(id) {
    document.editform.action = '/admin/article/edit';
    $.ajax({
        type: 'GET',
        url: url + '/admin/article/get/' + id,
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
            $('input[name=id]').val(data._id);
            $('textarea[name=content]').val(data.content);
            $('input[name=title]').val(data.title);
            $('#editform').modal('show');
        })
        .fail(() => { })
}

function deleteA(id) {
    let data = {
        id: id
    }

    $.ajax({
        type: 'GET',
        url: url + '/admin/article/delete',
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
            $('input[name=id]').val(id);
            $('#confirmform').modal('show');
        })
        .fail(() => { })
}

function addA() {
    document.editform.action = '/admin/article/add';

    $('input[name=id]').val('');
    $('textarea[name=content]').val('');
    $('input[name=title]').val('');

    $.ajax({
        type: 'GET',
        url: url + '/admin/article/add',
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
            $('#editform').modal('show');
        })
        .fail(() => { })
}