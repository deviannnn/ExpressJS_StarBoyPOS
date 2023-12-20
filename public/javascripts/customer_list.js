$(document).ready(function () {
    $('#example2').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
    });
})

// Handler
$('tbody').on('click', '.edit, .delete, .cannot-delete, .time', function () {
    const Id = $(this).data("id");

    const clickedElement = this;

    $.ajax({
        url: '/customer/get',
        method: 'POST',
        dataType: 'json',
        data: { Id },
        success: function (response) {
            if (response.success) {
                const customer = response.customer;

                switch (true) {
                    case $(clickedElement).hasClass('edit'):
                        displayCustomerEdit(customer);
                        break;

                    case $(clickedElement).hasClass('delete'):
                        $('.current-customer').text(`(${customer.name})`);
                        $('#delete-customer-id').val(customer.Id);
                        $('#deleteModal').modal('show');
                        break;

                    case $(clickedElement).hasClass('cannot-delete'):
                        $('#message-modal-fail').text('Cannot delete. There are products associated with it.');
                        $('#failModal').modal('show');
                        break;

                    case $(clickedElement).hasClass('time'):

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

// Edit
function displayCustomerEdit(customer) {
    $('#Id').val(customer.Id);
    $('#name').val(customer.name);
    $('#phone').val(customer.phone);
    $('#editModal').modal('show');
}

function updateCustomer() {
    const Id = $('#Id').val();
    const name = $('#name').val().trim();
    const phone = $('#phone').val().trim();
    const password = $('#password').val().trim();

    const data = { Id, name, phone, password };
    removeEmptyProperties(data);

    $.ajax({
        url: '/customer/update',
        method: 'PUT',
        dataType: 'json',
        data: data,
        success: function (response) {
            if (response.success) {
                $('#modal-created-title').text(response.title);
                $('#modal-created-msg').text(response.message);
                $('#createdModal').modal('show');
            }
        },
        error: function (xhr, status, error) {
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
        },
        complete: function () {
            $('#password').val('');
        }
    });
}

// Delete
function confirmDel() {
    const customerId = $('#delete-customer-id').val();
    const listItem = $(`[data-id="${customerId}"]`).closest('tr');

    $.ajax({
        url: '/customer/remove',
        method: 'DELETE',
        dataType: 'json',
        data: { Id: customerId },
        success: function (response) {
            if (response.success) {
                listItem.remove();
                $('#btn-ok-reload').hide();
                $('#btn-ok-noreload').show();

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

function removeEmptyProperties(obj) {
    for (const key in obj) {
        if (obj[key] === '' || obj[key] === undefined) {
            delete obj[key];
        }
    }
}

$('#editModal').on('hidden.bs.modal', function () {
    $('#Id').val('');
    $('#name').val('').removeClass('is-invalid');
    $('#phone').val('').removeClass('is-invalid');
    $('#password').val('');
});