$(document).ready(function () {
    $('#searchResults').css('width', $('#variantValue').outerWidth());

    $(window).resize(function () {
        $('#searchResults').css('width', $('#variantValue').outerWidth());
    });

    $('#searchCustomer').css('width', $('#customerValue').outerWidth());

    $(window).resize(function () {
        $('#searchCustomer').css('width', $('#customerValue').outerWidth());
    });
});

// Search
$('#variantValue').on('input', function () {
    const searchTerm = $(this).val().trim();

    if (searchTerm !== '') {
        $.ajax({
            url: 'variant/search',
            method: 'POST',
            dataType: 'json',
            data: { searchTerm: searchTerm },
            success: function (data) {
                displaySearchResults(data);
            },
            error: function (error) {
                console.error('Error fetching search results:', error);
            }
        });
    } else {
        $('#searchResults').empty().hide();
    }
})

function displaySearchResults(results) {
    $('#searchResults').empty().show();

    if (results.length > 0) {
        results.forEach(function (result) {
            const resultText = `(${result.barcode}) ${result.productName} - ${result.color} `;
            const imgsrc = `/uploads/product_variants/${result.img !== 'default.png' ? `${result.productId}/` : ''}${result.img}`;
            const listItem = `
                <li data-product-name="${resultText}" data-product-color="${result.color}"
                    data-product-barcode="${result.barcode}" data-product-price="${result.price}" 
                    data-product-img="${imgsrc}">
                    <a class="dropdown-item"><img class="search-img me-2" src="${imgsrc}" />${resultText}</a>
                </li>`;
            $('#searchResults').append(listItem);
        });
    } else {
        $('#searchResults').append('<li><a class="dropdown-item">No results found</a></li>');
    }
}

$('#searchResults').on('click', 'li', function () {
    const name = $(this).data('product-name');
    const barcode = $(this).data('product-barcode');
    const price = $(this).data('product-price');
    const img = $(this).data('product-img');

    const existingRow = $(`#list-items tr[data-barcode="${barcode}"]`);
    if (existingRow.length > 0) {
        const currentQuantity = parseInt(existingRow.find('.quan').text());
        existingRow.find('.quan').text(currentQuantity + 1);
        updateAmount(existingRow);
    } else {
        const newRow = `
        <tr data-barcode="${barcode}">
            <td>
                <div class="d-flex align-items-center">
                    <img src="${img}" alt="${barcode}">
                    <h6 class="text-md ms-3">${name}</h6>
                </div>
            </td>
            <td class="price text-sm">${currency(price * 1000)}</td>
            <td class="text-center text-lg">
                <span class="dec-quan btn badge bg-gradient-danger">–</span>
                <span class="quan badge bg-gradient-light text-dark">1</span>
                <span class="inc-quan btn badge bg-gradient-success">+</span>
            </td>
            <td class="amount text-sm">${currency(price * 1000)}</td>
            <td>
                <a class="delete">
                    <i class="far fa-trash-alt text-danger text-gradient" aria-hidden="true"></i>
                </a>
            </td>
        </tr>
        `;

        $('#list-items').append(newRow);
        updateTotal();
    }

    $('#variantValue').val('');
    $('#searchResults').empty().hide();
});

// Quantity on Product
$('#list-items').on('click', '.dec-quan', function () {
    const sltQuan = $(this).closest('tr').find('.quan');
    let currentQuantity = parseInt(sltQuan.text());

    if (currentQuantity > 0) {
        currentQuantity--;
        sltQuan.text(currentQuantity);
        updateAmount(this);
    } else {
        $(this).closest('tr').remove();
    }
});

$('#list-items').on('click', '.inc-quan', function () {
    const sltQuan = $(this).closest('tr').find('.quan');
    let currentQuantity = parseInt(sltQuan.text());

    currentQuantity++;
    sltQuan.text(currentQuantity);
    updateAmount(this);
});

$('#list-items').on('click', '.delete', function () {
    $(this).closest('tr').remove();
    updateAmount(this);
})

// Amount on Product
function updateAmount(selector) {
    const row = $(selector).closest('tr');

    const price = number(row.find('.price').text());
    const quantity = parseInt(row.find('.quan').text());
    const amount = price * quantity;
    row.find('.amount').text(currency(amount));

    updateTotal();
}

function updateTotal() {
    let subTotal = 0;
    let totalAmount = 0;
    let totalItems = 0;
    const discount = number($('#discount').val());

    $('#list-items tr').each(function () {
        const amount = number($(this).find('.amount').text()) || 0;
        const quantity = parseInt($(this).find('.quan').text()) || 0;
        subTotal += amount;
        totalItems += quantity;
    });

    totalAmount = Math.max(subTotal - discount, 0);

    $('.totalItems').text(totalItems);
    $('#subTotal').val(currency(subTotal));
    $('#totalPayable').text(currency(totalAmount));
    $('#totalPaying').text(currency(totalAmount));
    $('#receive').val(totalAmount / 1000);
    $('#totalAmount').val(currency(totalAmount));
}

// Payment
function openPaymentModal() {
    $('#paymentModal').modal('show');
}

$('.amount-item').on('click', function () {
    const amount = parseInt($(this).data('amount')) || 0;

    let currentCount = parseInt($(this).find('span').text()) || 0;
    $(this).find('span').text(currentCount + 1).show();

    updateValues(amount);
});

function updateValues(amount) {
    const currentReceive = parseInt($('#receive').val()) || 0;
    const currentTotalPaying = number($('#totalPaying').text()) || 0;

    const newReceive = currentReceive + amount;
    const newTotalPaying = currentTotalPaying + amount * 1000;

    $('#receive').val(newReceive);
    $('#totalPaying').text(currency(newTotalPaying));

    updateChange();
}

function updateChange() {
    const totalPaying = number($('#totalPaying').text()) || 0;
    const totalPayable = number($('#totalPayable').text()) || 0;

    const change = totalPaying - totalPayable;

    $('#change').text(currency(change));
}

function clearValues() {
    $('#receive').val('0');
    $('#totalPaying').text('0');
    $('.amount-item span').text('0').hide();
    updateChange();
}

// Customer
$('#cancel-customer').click(function () {
    $('#customer').val('').prop('disabled', false);
    $('#regist-customer').show();
    $(this).hide();
})

$('#name, #phone').on('focus', function () {
    $(this).removeClass('is-invalid');
})

function registerCustomer() {
    const name = $('#name').val().trim();
    const phone = $('#phone').val().trim();

    $.ajax({
        url: '/customer/register',
        method: 'POST',
        dataType: 'json',
        data: { name, phone },
        success: function (response) {
            if (response.success) {
                const customer = response.customer;
                $('#customer').val(`(${customer.Id}) ${customer.name}`).prop('disabled', true);
                $('#cancel-customer').show();
                $('#regist-customer').hide();

                $('#modal-created-title').text(response.title);
                $('#modal-created-msg').text(response.message);
                $('#registModal').modal('hide');
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
        }
    });
}

$('#registModal').on('hidden.bs.modal', function () {
    $('#name').val('').removeClass('is-invalid');
    $('#phone').removeClass('is-invalid');
});

$('#customer').on('input', function () {
    const searchTerm = $(this).val().trim();

    if (searchTerm !== '') {
        $.ajax({
            url: 'customer/search',
            method: 'POST',
            dataType: 'json',
            data: { searchTerm: searchTerm },
            success: function (data) {
                displaySearchCustomer(data);
            },
            error: function (error) {
                console.error('Error fetching search results:', error);
            }
        });
    } else {
        $('#searchCustomer').empty().hide();
    }
})

function displaySearchCustomer(results) {
    $('#searchCustomer').empty().show();

    if (results.length > 0) {
        results.forEach(function (result) {
            const resultText = `(${result.Id}) ${result.name} - ${result.phone} `;
            const listItem = `
                <li data-customer-id="${result.Id}" data-customer-name="${result.name}"
                    data-customer-phone="${result.phone}" data-customer-discount="${result.discount}">
                    <a class="dropdown-item">${resultText}</a>
                </li>`;
            $('#searchCustomer').append(listItem);
        });
    } else {
        $('#searchCustomer').append('<li><a class="dropdown-item">No results found</a></li>');
    }
}

$('#searchCustomer').on('click', 'li', function () {
    const Id = $(this).data('customer-id');
    const name = $(this).data('customer-name');
    const phone = $(this).data('customer-phone');
    const discount = $(this).data('customer-discount');

    $('#customer').val(`(${Id}) ${name}`).prop('disabled', true);
    $('#cancel-customer').show();
    $('#regist-customer').hide();

    $('#discount').val(currency(discount * 1000));
    updateTotal();

    $('#searchCustomer').empty().hide();
});

// Utils
$('#list-items').on('DOMSubtreeModified', function () {
    const productCount = $(this).find('tr').length;
    $('#paymentBtn').prop('disabled', productCount === 0);
});

function currency(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function number(currency) {
    return parseInt(currency.replace(/,/g, ''));
}