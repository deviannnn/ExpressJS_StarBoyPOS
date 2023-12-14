$('#next-cate').click(() => {
    $('#next-Modal').modal('show');
});

$('#confirm-cate').click(() => {
    window.location.href = '/category/handle?source=edit&id=6571cf6e7edda196e162f2f2'
});

$('#edit-name-cate').click(() => {
    $('#name').prop('disabled', false);
});

$('#name').on('blur', () => {
    const categoryId = $('#categoryId').val();
    const newName = $('#name').val();

    $.ajax({
        url: '/category/updateName',
        method: 'PUT',
        dataType: 'json',
        data: {
            categoryId: categoryId,
            name: newName
        },
        success: function (response) {
            $('#modal-success-title').text(response.title);
            $('#modal-success-msg').text(response.message);
            $('#successModal').modal('show');
        },
        error: function (xhr, textStatus, errorThrown) {
            let msg = '';
            if (xhr.status === 400) {
                const response = JSON.parse(xhr.responseText);
                if (response.type === 0 && response.errors && response.errors.length > 0) {
                    const inputError = response.errors;
                    inputError.forEach(input => {
                        $(`#${input.field}`).removeClass('is-valid').addClass('is-invalid');
                        msg += input.msg + '<br>';
                    })
                } else {
                    msg = response.message;
                }
            } else {
                msg = error;
            }
            $('#message-modal-fail').html(msg);
            $('#failModal').modal('show');
        }
    });
});

$('#specs-area').on('click', '.edit, .delete', function () {
    const categoryId = $('#categoryId').val();
    const specId = $(this).data("id");

    const clickedElement = this;

    $.ajax({
        url: '/category/getSpec',
        method: 'POST',
        dataType: 'json',
        data: { categoryId, specId },
        success: function (response) {
            if (response.success) {
                const spec = response.spec;

                switch (true) {
                    case $(clickedElement).hasClass('edit'):
                        displaySpecEdit(spec);
                        break;

                    case $(clickedElement).hasClass('delete'):
                        $('.current-spec').text(`(${spec.name})`);
                        $('#deleteId').val(spec._id);
                        $('#deleteSpecModal').modal('show');
                        break;

                    default:
                        break;
                }
            }
        },
        error: function (xhr, status, error) {
            let msg;
            if (xhr.status === 400) {
                const response = JSON.parse(xhr.responseText);
                msg = response.message;
            } else {
                msg = error;
            }
            $('#message-modal-fail').text(msg);
            $('#failModal').modal('show');
        }
    });
});

// Add
function addSpecs() {
    const categoryId = $('#categoryId').val();
    const name = $('#spec-name').val();

    const options = [];
    $('.options').each(function () {
        const optionValue = $(this).val();
        if (optionValue.trim() !== '') {
            options.push(optionValue);
        }
    });

    const requestData = {
        categoryId: categoryId,
        name: name,
        options: options
    };

    console.log(requestData)
}

// Edit
function displaySpecEdit(spec) {
    $('#edit-id').val(spec._id);
    $('#edit-name').val(spec.name);

    const area = $('#edit-options-area');
    area.empty();

    spec.options.forEach(opt => {
        const row = $('<div class="col-4 mb-3">');
        row.append(`
            <div class="d-flex">
                <input class="form-control options" type="text" value="${opt}" name="options">
                <a href="" class="input-group-text delete-options">
                    <i class="fas fa-minus text-danger"></i>
                </a>
            </div>`);
        area.append(row);
    })

    $('#editSpecModal').modal('show');
}

// Delete
$('#confirm-del-btn').on('click', onConfirmDelButtonClick);

function onConfirmDelButtonClick() {
    const categoryId = $('#categoryId').val();
    const specId = $('#deleteId').val();

    $.ajax({
        url: '/category/removeSpecs',
        method: 'DELETE',
        dataType: 'json',
        data: { categoryId, specId },
        success: function (response) {
            if (response.success) {
                $('#modal-success-title').text(response.title);
                $('#modal-success-msg').text(response.message);
                $('#successModal').modal('show');
            }
        },
        error: function (xhr, status, error) {
            let msg;
            if (xhr.status === 400) {
                const response = JSON.parse(xhr.responseText);
                if (response.type === 0 && response.errors && response.errors.length > 0) {
                    const inputError = response.errors;
                    inputError.forEach(input => {
                        $(`#${input.field}`).removeClass('is-valid').addClass('is-invalid');
                        msg += input.msg + '<br>';
                    })
                } else {
                    msg = response.message;
                }
            } else {
                msg = error;
            }
            $('#message-modal-fail').html(msg);
            $('#failModal').modal('show');
        }
    });
}