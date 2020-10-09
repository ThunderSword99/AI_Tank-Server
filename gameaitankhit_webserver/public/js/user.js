var url = location.protocol + "//" + document.domain + ":" + location.port;
function editU(id) {
    document.editform.action = '/admin/user/edit';
    $('input[name=userName]').prop('readonly', true);
    $('input[name=email]').prop('readonly', true);
    $('input[name=password]').prop('required', false);
    $.ajax({
        type: 'GET',
        url: url + '/admin/user/get/' + id,
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
            $('input[name=userName]').val(data.userName);
            $('input[name=firstName]').val(data.firstName);
            $('input[name=lastName]').val(data.lastName);
            $('input[name=dateOfBirth]').val(data.dateOfBirth);
            $('input[name=studentID]').val(data.studentID);
            $('input[name=email]').val(data.email);
            $('input[name=phoneNumber]').val(data.phoneNumber);
            $('#editform').modal('show');
        })
        .fail(() => { })
}

function addU() {
    document.editform.action = '/admin/user/add';
    $('input[name=userName]').prop('readonly', false);
    $('input[name=email]').prop('readonly', false);

    $('input[name=userName]').val('');
    $('input[name=firstName]').val('');
    $('input[name=lastName]').val('');
    $('input[name=dateOfBirth]').val(null);
    $('input[name=studentID]').val('');
    $('input[name=email]').val('');
    $('input[name=phoneNumber]').val('');

    $.ajax({
        type: 'GET',
        url: url + '/admin/user/add',
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
            $('#editform').modal('show');
        })
        .fail(() => { })
}

function lockU(id) {
    let data = {
        id: id
    }

    $.ajax({
        type: 'GET',
        url: url + '/admin/user/lock/',
        dataType: 'json'
    })
        .done((data) => {
            $('input[name=_csrf]').val(data.csrfToken);
            $('input[name=id]').val(id);
            $('#confirmform').modal('show');
        })
        .fail(() => { })
}