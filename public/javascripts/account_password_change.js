$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    localStorage.setItem('passwordChangeToken', token);
});

$('#newPassword').on('input', function () {
    validateConfirmPassword();
});

$('#confirmPassword').on('input', function () {
    validateConfirmPassword();
});

function validateConfirmPassword() {
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    if (newPassword !== '' && confirmPassword === newPassword) {
        $('#confirmPassword').removeClass('is-invalid').addClass('is-valid');
        $('#changeBtn').prop('disabled', false);
        return false;
    } else {
        $('#confirmPassword').removeClass('is-valid').addClass('is-invalid');
        $('#changeBtn').prop('disabled', true);
        return true;
    }
}

function passwordChange() {
    const accountId = $('#accountId').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    const token = localStorage.getItem('passwordChangeToken');

    if (validateConfirmPassword) {
        $.ajax({
            url: '/account/password/change',
            method: 'POST',
            dataType: 'json',
            data: { accountId, newPassword, confirmPassword },
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                if (response.success) {
                    $('#modal-success-title').text(response.title);
                    $('#modal-success-msg').text(response.message);
                    $('#successModal').modal('show');
                    setTimeout(function () {
                        window.location.href = '/account/login';
                    }, 4000);
                }
            },
            error: function (xhr, status, error) {
                let msg = '';
                if (xhr.status === 400) {
                    const response = JSON.parse(xhr.responseText);
                    msg = response.message;
                } else {
                    msg = error;
                }
                $('#message-modal-fail').html(msg);
                $('#failModal').modal('show');
            }
        });
    }

}