const regFormDOM = $('#register-form');
const loginFormDOM = $('#login-form');
const topCartDOM = $('.top-cart-number');
const topCartItems = $('.top-cart-items');
const topCheckoutPrice = $('.top-checkout-price');
const cartItems = $('#cart-items');
const cartSection = $('#cart-section');
const cartTotal = $('#cart-total');
const totalPrice = $('#total');
const checkoutCardDOM = $('#checkout-cart');
const discountDOM = $('#discount');
const shippingDOM = $('#shipping');
const selectDOM = $('#select');
const inputDOM = $('#coupon');
const locationFormDOM = $('#shipping-form-city');
const productInputDOM = $('#productInput');
const couponInputDOM = $('#couponInput');
const deliveryInputDOM = $('#deliveryInput');
const maxLength = 23;
// $(document).ready(() => {
const formatPriceNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
// Handdle Cart
const cartData = localStorage.getItem('cart');
const delivery = localStorage.getItem('delivery');
const coupon = localStorage.getItem('coupon');
productInputDOM.val(cartData);
couponInputDOM.val(coupon);
deliveryInputDOM.val(delivery);
if (cartData && cartData !== '[]') {
    const jsonCartData = JSON.parse(cartData);
    let total = 0;

    const items = jsonCartData
        .map((item, index) => {
            $(`#input-${item.id}`).val(item.quantity);
            total += parseInt(item.total);
            if (index > 2) return '<h6 class="text-center m-0">...</h6>';
            return `
                    <div class="top-cart-item">
                    <div class="top-cart-item-image">
                    <a href="/shop/product/${item.id}"><img src="/uploads/product/${
                item.image
            }" alt="Blue Round-Neck Tshirt" /></a>
                    </div>
                    <div class="top-cart-item-desc">
                    <div class="top-cart-item-desc-title">
                        <a href="/shop/product/${item.id}">${item.name.slice(0, maxLength) + '...'}</a>
                        <span class="top-cart-item-price d-block" id="top-cart-price-${item.id}">${formatPriceNumber(
                item.total,
            )} VNĐ</span>
                    </div>
                    <div class="top-cart-item-quantity" id="top-cart-${item.id}">x ${item.quantity}</div>
                    </div>
                </div>
                    `;
        })
        .join('');
    topCartDOM.text(jsonCartData.length);
    let shortTotal = String(total).slice(0, 4);
    topCartItems.html(items);
    topCheckoutPrice.text(formatPriceNumber(shortTotal) + '...VNĐ');

    const cartTableDatas = jsonCartData
        .map((item) => {
            return `
            <tr class="cart_item">
                <td class="cart-product-remove">
                    <a href="javascript:handleDeleteItemCart('${
                        item.id
                    }')" class="remove" title="Remove this item"><i class="icon-trash2"></i></a>
                </td>

                <td class="cart-product-thumbnail">
                    <a href="/shop/product/${item.id}"><img width="64" height="64" src="/uploads/product/${
                item.image
            }" alt="Pink Printed Dress"></a>
                </td>

                <td class="cart-product-name">
                    <a href="/shop/product/${item.id}">${item.name}</a>
                </td>

                <td class="cart-product-price">
                    <span class="amount">${formatPriceNumber(item.price)} VNĐ</span>
                </td>

                <td class="cart-product-quantity">
                    <div class="quantity">
                    <input type="button" value="-" class="minus">
                    <input
                        id="qty-${item.id}"
                        type="text"
                        name="quantity"
                        value="${item.quantity}" 
                        class="qty" 
                        onchange="javascript:handleChangeQuantityCart('${item.id}')"/>
                    <input type="button" value="+" class="plus">
                    </div>
                </td>

                <td class="cart-product-subtotal">
                    <span class="amount" id="total-${item.id}">${formatPriceNumber(item.total)} VNĐ</span>
                </td>
            </tr>
        `;
        })
        .join('');
    cartItems.html(cartTableDatas);
    cartTotal.html(formatPriceNumber(total) + 'VNĐ');
    if (delivery) {
        let shippingFee = JSON.parse(delivery);
        total = parseInt(total) + parseInt(shippingFee.shippingFee);
        shippingDOM.html(formatPriceNumber(shippingFee.shippingFee) + 'VNĐ');
        selectDOM.val(shippingFee.id);
    } else {
        selectDOM.val('');
    }
    if (coupon) {
        let discount = JSON.parse(coupon);
        total = parseInt(total) - parseInt(discount.discount);
        discountDOM.html(formatPriceNumber(discount.discount) + 'VNĐ');
        inputDOM.val(discount.code);
    }
    totalPrice.html(formatPriceNumber(total) + 'VNĐ');
    // order
    const cartXhtml = jsonCartData.map((data) => {
        return `
            <tr class="cart_item">
          <td class="cart-product-thumbnail">
            <a href="/shop/product/${data.id}"><img width="64" height="64" src="/uploads/product/${
            data.image
        }" alt="Pink Printed Dress"></a>
          </td>

          <td class="cart-product-name">
            <a href="/shop/product/${data.id}">${data.name.slice(0, 32)}...</a>
          </td>

          <td class="cart-product-quantity">
            <div class="quantity clearfix">
              1x${data.quantity}
            </div>
          </td>

          <td class="cart-product-subtotal">
            <span class="amount">${formatPriceNumber(data.total)} VNĐ</span>
          </td>
        </tr>
        `;
    });
    checkoutCardDOM.html(cartXhtml);
} else {
    cartSection.html('<h3 class="text-center">Chưa có sản phẩm nào trong giỏ hàng.</h3>');
}
// });

//

// Delete Cart Item
const handleDeleteItemCart = (id) => {
    const cartData = localStorage.getItem('cart');
    let toastrMessage = 'Xóa sản phẩm thành công';
    let total = 0;
    if (cartData) {
        let jsonCartData = JSON.parse(cartData);
        jsonCartData = jsonCartData.filter((data) => {
            return data.id !== id;
        });
        const cartTableDatas = jsonCartData
            .map((item) => {
                total += parseInt(item.total);
                return `
            <tr class="cart_item">
                <td class="cart-product-remove">
                    <a href="javascript:handleDeleteItemCart('${
                        item.id
                    }')" class="remove" title="Remove this item"><i class="icon-trash2"></i></a>
                </td>

                <td class="cart-product-thumbnail">
                    <a href="/shop/product/${item.id}"><img width="64" height="64" src="/uploads/product/${
                    item.image
                }" alt="Pink Printed Dress"></a>
                </td>

                <td class="cart-product-name">
                    <a href="/shop/product/${item.id}">${item.name}</a>
                </td>

                <td class="cart-product-price">
                    <span class="amount">${formatPriceNumber(item.price)} VNĐ</span>
                </td>

                <td class="cart-product-quantity">
                    <div class="quantity">
                    <input type="button" value="-" class="minus">
                    <input
                        type="text"
                        name="quantity"
                        value="${item.quantity}" 
                        class="qty" 
                        onchange="javascript:handleChangeQuantityCart('${item.id}')"/>
                    <input type="button" value="+" class="plus">
                    </div>
                </td>

                <td class="cart-product-subtotal">
                    <span class="amount">${formatPriceNumber(item.total)} VNĐ</span>
                </td>
            </tr>
        `;
            })
            .join('');
        const items = jsonCartData
            .map((item, index) => {
                if (index > 2) return '<h6 class="text-center m-0">...</h6>';

                return `
                        <div class="top-cart-item">
                        <div class="top-cart-item-image">
                        <a href="/shop/product/${item.id}"><img src="/uploads/product/${item.image}" alt="${
                    item.name
                }" /></a>
                        </div>
                        <div class="top-cart-item-desc">
                        <div class="top-cart-item-desc-title">
                            <a href="/shop/product/${item.id}">${item.name.slice(0, maxLength) + '...'}</a>
                            <span class="top-cart-item-price d-block">${formatPriceNumber(item.price)} VNĐ</span>
                        </div>
                        <div class="top-cart-item-quantity">x ${item.quantity}</div>
                        </div>
                    </div>
                        `;
            })
            .join('');
        let shortTotal = String(total).slice(0, 5);
        topCartItems.html(items);
        topCheckoutPrice.text(formatPriceNumber(shortTotal) + '...VNĐ');

        cartItems.html(cartTableDatas);
        cartTotal.html(formatPriceNumber(total) + 'VNĐ');
        totalPrice.html(formatPriceNumber(total) + 'VNĐ');
        topCartDOM.text(jsonCartData.length);
        // save
        localStorage.setItem('cart', JSON.stringify(jsonCartData));
        // message
        toastr.success(toastrMessage, 'SUCCESS', {
            newestOnTop: true,
            closeButton: false,
            progressBar: true,
            preventDuplicates: false,
            showMethod: 'slideDown',
            timeOut: 10000,
        });
        if (jsonCartData.length <= 0) cartSection.html('<h3 class="text-center">Chưa có sản phẩm nào.</h3>');
    }
};

// Change qty Item
const handleChangeQuantityCart = (id) => {
    console.log(id);
    const cartData = localStorage.getItem('cart');
    let toastrMessage = 'Cập nhập thành công';
    const qtyDOM = $(`#qty-${id}`);
    const totalDOM = $(`#total-${id}`);
    const topCartQtyDOM = $(`#top-cart-${id}`);
    const topCartPriceDOM = $(`#top-cart-price-${id}`);
    if (qtyDOM.val() <= 0) {
        toastrMessage = 'Sai giá trị';
        return toastr.error(toastrMessage, 'ERROR', {
            newestOnTop: true,
            closeButton: false,
            progressBar: true,
            preventDuplicates: false,
            showMethod: 'slideDown',
            timeOut: 10000,
        });
    }
    let total = 0;
    if (cartData && cartData !== '[]') {
        let jsonCartData = JSON.parse(cartData);
        jsonCartData = jsonCartData.map((data) => {
            if (data.id === id) {
                data.quantity = qtyDOM.val();
                data.total = parseInt(data.price) * parseInt(data.quantity);
                totalDOM.html(formatPriceNumber(data.total) + 'VNĐ');
                topCartQtyDOM.html('x' + data.quantity);
                topCartPriceDOM.html(formatPriceNumber(data.total) + 'VNĐ');
            }
            total += parseInt(data.total);
            return data;
        });
        cartTotal.html(formatPriceNumber(total) + 'VNĐ');
        totalPrice.html(formatPriceNumber(total) + 'VNĐ');
        let shortTotal = String(total).slice(0, 4);
        topCheckoutPrice.text(formatPriceNumber(shortTotal) + '...VNĐ');

        // save to localStorage
        localStorage.setItem('cart', JSON.stringify(jsonCartData));
        // message
        toastr.success(toastrMessage, 'SUCCESS', {
            newestOnTop: true,
            closeButton: false,
            progressBar: true,
            preventDuplicates: false,
            showMethod: 'slideDown',
            timeOut: 10000,
        });
    }
};

// Add Item to Cart
const handleAddToCart = (id, name, image, price) => {
    const cartData = localStorage.getItem('cart');
    let total = 0;
    let toastrMessage = 'Thêm sản phẩm thành công';
    const product = { id, name, image, price, quantity: 1, total: price };
    let jsonCartData = [];
    let isExist = false;
    if (!cartData) jsonCartData.push(product);
    else {
        jsonCartData = JSON.parse(cartData);
        jsonCartData.filter((data) => {
            if (data.id === id) {
                isExist = true;
                return (
                    (data.quantity = parseInt(data.quantity) + 1),
                    (data.total = parseInt(data.price) * parseInt(data.quantity))
                );
            }
        });
        if (!isExist) jsonCartData.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(jsonCartData));

    const newcartData = localStorage.getItem('cart');
    const newjsonCartData = JSON.parse(newcartData);

    topCartDOM.text(newjsonCartData.length);
    const items = newjsonCartData
        .map((item, index) => {
            total += parseInt(item.total);
            if (index > 2) return '<h6 class="text-center m-0">...</h6>';

            return `
        <div class="top-cart-item">
        <div class="top-cart-item-image">
          <a href="/shop/product/${item.id}"><img src="/uploads/product/${item.image}" alt="${item.name}" /></a>
        </div>
        <div class="top-cart-item-desc">
          <div class="top-cart-item-desc-title">
            <a href="/shop/product/${item.id}">${item.name.slice(0, maxLength) + '...'}</a>
            <span class="top-cart-item-price d-block">${formatPriceNumber(item.price)} VNĐ</span>
          </div>
          <div class="top-cart-item-quantity">x ${item.quantity}</div>
        </div>
      </div>
        `;
        })
        .join('');
    let shortTotal = String(total).slice(0, 5);
    topCartItems.html(items);
    topCheckoutPrice.text(formatPriceNumber(shortTotal) + '...VNĐ');

    toastr.success(toastrMessage, 'SUCCESS', {
        newestOnTop: true,
        closeButton: false,
        progressBar: true,
        preventDuplicates: false,
        showMethod: 'slideDown',
        timeOut: 10000,
    });
};

const handleClickAtToCart = (id) => {
    const topCartQty = $(`#top-cart-${id}`);
    const topCartPrice = $(`#top-cart-price-${id}`);
    const inputDOM = $(`#input-${id}`);
    const cartData = localStorage.getItem('cart');
    let total = 0;
    let toastrMessage = 'Thêm sản phẩm thành công';
    if (cartData && cartData !== '[]') {
        let jsonCartData = JSON.parse(cartData);
        jsonCartData = jsonCartData.map((data) => {
            if (data.id === id) {
                data.quantity = inputDOM.val();
                topCartQty.html('x' + parseInt(data.quantity));
                data.total = parseInt(data.price) * parseInt(data.quantity);
                topCartPrice.html(data.total);
            }
            total += parseInt(data.total);
            return data;
        });
        let shortTotal = String(total).slice(0, 5);
        topCheckoutPrice.text(formatPriceNumber(shortTotal) + '...VNĐ');
        localStorage.setItem('cart', JSON.stringify(jsonCartData));

        toastr.success(toastrMessage, 'SUCCESS', {
            newestOnTop: true,
            closeButton: false,
            progressBar: true,
            preventDuplicates: false,
            showMethod: 'slideDown',
            timeOut: 10000,
        });
    }
};

const handleEnterCoupon = () => {
    const inputDOM = $('#coupon');
    const cartData = localStorage.getItem('cart');
    const delivery = localStorage.getItem('delivery');
    let total = 0;
    let discount = 0;
    if (cartData && cartData !== '[]') {
        let jsonCartData = JSON.parse(cartData);
        let price = jsonCartData.map((data) => {
            return (total += parseInt(data.total));
        });
        $.ajax({
            type: 'POST',
            url: '/checkout',
            data: { code: inputDOM.val() },
            dataType: 'json',
            success: (data) => {
                if (data.success) {
                    const toastrMessage = data.message;
                    toastr.success(toastrMessage, 'SUCCESS', {
                        newestOnTop: true,
                        closeButton: false,
                        progressBar: true,
                        preventDuplicates: false,
                        showMethod: 'slideDown',
                        timeOut: 10000,
                    });
                    if (data.type === 'percent') {
                        discount = (parseInt(price) * parseInt(data.value)) / 100;
                    } else {
                        discount = parseInt(price) - parseInt(data.value);
                    }
                    price = parseInt(price) - parseInt(discount);
                    if (delivery) {
                        let shippingFee = JSON.parse(delivery);
                        price = parseInt(price) + parseInt(shippingFee.shippingFee);
                    }
                    discountDOM.html(formatPriceNumber(discount) + 'VNĐ');
                    totalPrice.html(formatPriceNumber(price) + 'VNĐ');
                    const couponData = { id: data.id, code: data.code, discount };
                    localStorage.setItem('coupon', JSON.stringify(couponData));
                }

                if (data.error) {
                    const errorMessage = data.message
                        .map((error) => {
                            return `
                        <li>
                            <b>${error.path}:</b> ${error.msg}
                        </li>    
                `;
                        })
                        .join('');
                    let toastrMessage = errorMessage;
                    toastr.error(toastrMessage, 'ERROR', {
                        newestOnTop: true,
                        closeButton: false,
                        progressBar: true,
                        preventDuplicates: false,
                        showMethod: 'slideDown',
                        timeOut: 30000,
                    });
                }
            },
        });
    }
};

const handleSelectLocation = () => {
    const selectDOM = $('#select');
    const cartData = localStorage.getItem('cart');
    const coupon = localStorage.getItem('coupon');
    let total = 0;
    if (cartData && cartData !== '[]') {
        let jsonCartData = JSON.parse(cartData);
        let price = jsonCartData.map((data) => {
            return (total += parseInt(data.total));
        });
        if (selectDOM.val()) {
            $.ajax({
                type: 'POST',
                url: '/checkout/location',
                data: { id: selectDOM.val() },
                dataType: 'json',
                success: (data) => {
                    if (data.success) {
                        shippingDOM.html(formatPriceNumber(data.shipping_fee) + 'VNĐ');
                        price = parseInt(price) + parseInt(data.shipping_fee);
                        if (coupon) {
                            let discount = JSON.parse(coupon);
                            price = parseInt(price) - parseInt(discount.discount);
                        }
                        totalPrice.html(formatPriceNumber(price) + 'VNĐ');
                        const deliveryData = {
                            id: data.id,
                            shippingFee: data.shipping_fee,
                            location: data.location,
                        };
                        localStorage.setItem('delivery', JSON.stringify(deliveryData));
                    }
                },
            });
        } else {
            shippingDOM.html('0 VNĐ');
            if (coupon) {
                let discount = JSON.parse(coupon);
                total = parseInt(total) - parseInt(discount.discount);
            }
            totalPrice.html(formatPriceNumber(total) + 'VNĐ');
            localStorage.removeItem('delivery');
        }
    }
};

const formCheckoutDOM = $('#form-checkout');

formCheckoutDOM.submit(function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/checkout/createOrder',
        data: formData,
        dataType: 'json',
        success: (data) => {
            if (data.success) {
                let toastrMessage = data.message;
                toastr.success(toastrMessage, 'SUCCESS', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 30000,
                });
                setTimeout((window.location.href = '/'), 3000);
                localStorage.clear();
            }
            if (data.error) {
                const errorMessage = data.message
                    .map((error) => {
                        return `
                        <li>
                            <b>${error.path}:</b> ${error.msg}
                        </li>    
                `;
                    })
                    .join('');
                let toastrMessage = errorMessage;
                toastr.error(toastrMessage, 'ERROR', {
                    newestOnTop: true,
                    closeButton: false,
                    progressBar: true,
                    preventDuplicates: false,
                    showMethod: 'slideDown',
                    timeOut: 30000,
                });
            }
        },
    });
});
