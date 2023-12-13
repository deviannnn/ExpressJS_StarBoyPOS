function passwordUpdate() {
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    if (validateConfirmPassword()) {
        $.ajax({
            url: '/account/password/update',
            method: 'POST',
            dataType: 'json',
            data: { currentPassword, newPassword, confirmPassword },
            success: function (response) {
                if (response.success) {
                    $('#modal-success-title').text(response.title);
                    $('#modal-success-msg').text(response.message);
                    $('#successModal').modal('show');
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
};

$('#currentPassword, #newPassword, #confirmPassword').on('focus', function () {
    $(this).removeClass('is-invalid');
});

$('#currentPassword, #newPassword, #confirmPassword').on('input', function () {
    validateConfirmPassword();
});

function validateConfirmPassword() {
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    const currentPassword = $('#currentPassword').val();

    if (newPassword.length >= 6 && newPassword === confirmPassword) {
        $('#newPassword').removeClass('is-invalid').addClass('is-valid');
        $('#confirmPassword').removeClass('is-invalid').addClass('is-valid');
        $('#updateBtn').prop('disabled', false);
        return true;
    } else {
        if (currentPassword === '') {
            $('#currentPassword').removeClass('is-valid').addClass('is-invalid');
        }
        $('#newPassword').removeClass('is-valid').addClass('is-invalid');
        $('#confirmPassword').removeClass('is-valid').addClass('is-invalid');
        $('#updateBtn').prop('disabled', true);
        return false;
    }
}