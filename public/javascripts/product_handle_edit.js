$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    $.ajax({
        url: '/category/getAll',
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                fillCategory(response.categories);
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
            $('#message-modal-fail').text(msg);
            $('#failModal').modal('show');
        }
    });

    $.ajax({
        url: '/product/get',
        method: 'POST',
        dataType: 'json',
        data: { productId },
        success: function (response) {
            if (response.success) {
                const product = response.product;

                $('#name').val(product.name);
                $('#category option').each(function () {
                    if ($(this).val() === product.category._id) {
                        $(this).prop('selected', true);
                    } else {
                        $(this).prop('selected', false);
                    }
                });
                fillSpecs(product.category.specs, product.specs);
                displayVariants(product.variants);
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
            $('#message-modal-fail').text(msg);
            $('#failModal').modal('show');
        }
    });
});

$('#name').on('focus', () => {
    $('#name').removeClass('is-invalid');
})

function fillCategory(data) {
    const dropdown = $('#category');
    dropdown.html(data.map(item => `<option value="${item._id}">${item.name}</option>`).join(''));

    dropdown.change(function () {
        const selectedCategoryId = $(this).val();

        const selectedCategory = data.find(item => item._id === selectedCategoryId);
        const categorySpecs = selectedCategory.specs;

        fillSpecs(categorySpecs);
    });
}

function fillSpecs(categorySpecs, productSpecs) {
    const dropdown = $('#specs-area');
    dropdown.empty();

    categorySpecs.forEach((categorySpec, index) => {
        let options;
        if (productSpecs) {
            const selectedProductSpec = productSpecs.find(productSpec => productSpec.name === categorySpec.name);
            options = categorySpec.options.map(option => {
                const isSelected = selectedProductSpec && selectedProductSpec.option === option;
                return `<option value="${option}" ${isSelected ? 'selected' : ''}>${option}</option>`;
            }).join('');
        } else {
            options = categorySpec.options.map(option => {
                return `<option value="${option}">${option}</option>`;
            }).join('');
        }

        dropdown.append(`
            <div class="specs col-lg-3 mt-4">
                <label for="${index}">${categorySpec.name}</label>
                <div class="choices" data-type="select-one">
                    <select id="${index}" class="form-control">${options}</select>
                </div>
            </div>
        `);
    });
}

function displayVariants(variants) {
    const variantsList = $('#variants-list');
    variantsList.empty();

    if (variants.length > 0) {
        variants.forEach(variant => {
            const variantItem = `
                <li class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg">
                    <div class="row w-80">
                        <div class="col-5 col-lg-2">
                            <img class="h-lg-100 w-100" src="/uploads/product_variants/${variant.img}">
                        </div>
                        <div class="col-7 col-lg-10 d-flex flex-column">
                            <h6 class="mb-3 text-sm">${variant.barcode}</h6>
                            <div class="row">
                                <span class="col-lg-6 mb-2 text-xs">Color:
                                    <span class="text-dark font-weight-bold ms-sm-2">${variant.color}</span>
                                </span>
                                <span class="col-lg-6 mb-2 text-xs">Quantity:&nbsp;
                                    <span class="text-dark font-weight-bold ms-sm-2">${variant.quantity}</span>
                                </span>
                                <span class="col-lg-6 mb-2 text-xs">Cost:&nbsp;
                                    <span class="text-dark font-weight-bold ms-sm-2">${variant.cost} VND</span>
                                </span>
                                <span class="col-lg-6 mb-2 text-xs">Warn:&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span class="text-dark font-weight-bold ms-sm-2">${variant.warn}</span>
                                </span>
                                <span class="col-lg-6 mb-2 text-xs">Price:
                                    <span class="text-dark font-weight-bold ms-sm-2">${variant.price} VND</span>
                                </span>
                                <span class="col-lg-6 mb-2 text-xs">Actived:&nbsp;
                                    <span class="text-dark font-weight-bold ms-sm-2">${variant.actived}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="ms-auto text-end">
                        <a class="edit btn btn-link text-dark px-3 mb-0" data-barcode=${variant.barcode}>
                            <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>
                            Edit
                        </a>
                        <a class="btn btn-link text-primary text-gradient px-3 mb-0" data-barcode=${variant.barcode}>
                            <i class="fas fa-truck-moving text-primary me-2" aria-hidden="true"></i>
                            Imp
                        </a>
                    </div>
                    <div class="ms-auto text-end">
                        <a class="delete btn btn-link text-danger text-gradient px-3 mb-0" data-barcode=${variant.barcode}>
                            <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                            Delete
                        </a>
                        <a class="status btn btn-link text-${variant.actived ? 'secondary' : 'success'} px-3 mb-0" data-barcode=${variant.barcode}>
                            <i class="fas fa-ban text-${variant.actived ? 'secondary' : 'success'} me-2" aria-hidden="true"></i>
                            ${variant.actived ? 'Unact' : 'Active'}
                        </a>
                    </div>
                </li>`;

            variantsList.append(variantItem);
        });
    } else {
        const noVariantMessage = `
            <div class="alert alert-light m-0" role="alert">
                <strong>Ooops!</strong> There aren't any product variants yet!
            </div>`;

        variantsList.append(noVariantMessage);
    }
}

// Edit Product
function updateProduct() {
    const productId = new URLSearchParams(window.location.search).get('id');
    const categoryId = $('#category').val();
    const name = $('#name').val();
    const specs = [];
    $('#specs-area .specs').each(function () {
        const specName = $(this).find('label').text().trim();
        const specOption = $(this).find('select').val();

        const spec = {
            name: specName,
            option: specOption
        };

        specs.push(spec);
    });

    $.ajax({
        url: '/product/update',
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ productId, categoryId, name, specs }),
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

// Add Variant
function chooseImg() {
    $('#img').click();
}

$('#img').on('change', function () {
    const fileInput = $(this)[0];
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});

function addVariant() {
    const productId = new URLSearchParams(window.location.search).get('id');

    let formData = new FormData();
    formData.append('productId', productId);
    formData.append('barcode', $('#barcode').val());
    formData.append('color', $('#color').val());
    formData.append('warn', $('#warn').val());
    formData.append('cost', $('#cost').val());
    formData.append('price', $('#price').val());

    let imageFile = $('#img')[0].files[0];
    if (imageFile) {
        formData.append('img', imageFile);
    }
    console.log(formData);
    $.ajax({
        url: '/variant/create',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: formData,
        processData: false,
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
        }
    });
}