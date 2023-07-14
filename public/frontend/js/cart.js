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
const maxLength = 23;

// Handdle Cart
const cartData = localStorage.getItem('cart');
if (cartData && cartData !== '[]') {
    const jsonCartData = JSON.parse(cartData);
    let total = 0;
    const items = jsonCartData
        .map((item, index) => {
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
            <span class="top-cart-item-price d-block" id="top-cart-price-${item.id}">${item.total} VNĐ</span>
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
    topCheckoutPrice.text(shortTotal + '...' + 'VNĐ');

    const cartTableDatas = jsonCartData
        .map((item) => {
            return `
            <tr class="cart_item">
                <td class="cart-product-remove">
                    <a href="javascript:handleDeleteItemCart('${item.id}')" class="remove" title="Remove this item"><i class="icon-trash2"></i></a>
                </td>

                <td class="cart-product-thumbnail">
                    <a href="/shop/product/${item.id}"><img width="64" height="64" src="/uploads/product/${item.image}" alt="Pink Printed Dress"></a>
                </td>

                <td class="cart-product-name">
                    <a href="/shop/product/${item.id}">${item.name}</a>
                </td>

                <td class="cart-product-price">
                    <span class="amount">${item.price} VNĐ</span>
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
                    <span class="amount" id="total-${item.id}">${item.total} VNĐ</span>
                </td>
            </tr>
        `;
        })
        .join('');
    cartItems.html(cartTableDatas);
    cartTotal.html(total + 'VNĐ');
    totalPrice.html(total + 'VNĐ');
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
            <span class="amount">${data.total} VNĐ</span>
          </td>
        </tr>
        `;
    });
    checkoutCardDOM.html(cartXhtml);
} else {
    cartSection.html('<h3 class="text-center">Chưa có sản phẩm nào trong giỏ hàng.</h3>');
}

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
                    <a href="javascript:handleDeleteItemCart('${item.id}')" class="remove" title="Remove this item"><i class="icon-trash2"></i></a>
                </td>

                <td class="cart-product-thumbnail">
                    <a href="/shop/product/${item.id}"><img width="64" height="64" src="/uploads/product/${item.image}" alt="Pink Printed Dress"></a>
                </td>

                <td class="cart-product-name">
                    <a href="/shop/product/${item.id}">${item.name}</a>
                </td>

                <td class="cart-product-price">
                    <span class="amount">${item.price} VNĐ</span>
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
                    <span class="amount">${item.total} VNĐ</span>
                </td>
            </tr>
        `;
            })
            .join('');
        const items = jsonCartData
            .map((item, index) => {
                total += parseInt(item.total);
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
                            <span class="top-cart-item-price d-block">${item.price} VNĐ</span>
                        </div>
                        <div class="top-cart-item-quantity">x ${item.quantity}</div>
                        </div>
                    </div>
                        `;
            })
            .join('');
        let shortTotal = String(total).slice(0, 5);
        topCartItems.html(items);
        topCheckoutPrice.text(shortTotal + '...' + 'VNĐ');

        cartItems.html(cartTableDatas);
        cartTotal.html(total + 'VNĐ');
        totalPrice.html(total + 'VNĐ');
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
                totalDOM.html(data.total + 'VNĐ');
                topCartQtyDOM.html(data.quantity);
                topCartPriceDOM.html(data.total + 'VNĐ');
            }
            total += parseInt(data.total);
            return data;
        });
        cartTotal.html(total + 'VNĐ');
        totalPrice.html(total + 'VNĐ');
        let shortTotal = String(total).slice(0, 4);
        topCheckoutPrice.text(shortTotal + '...' + 'VNĐ');
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
                return (data.quantity += 1), (data.total = data.price * data.quantity);
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
            <span class="top-cart-item-price d-block">${item.price} VNĐ</span>
          </div>
          <div class="top-cart-item-quantity">x ${item.quantity}</div>
        </div>
      </div>
        `;
        })
        .join('');
    let shortTotal = String(total).slice(0, 5);
    topCartItems.html(items);
    topCheckoutPrice.text(shortTotal + '...' + 'VNĐ');

    toastr.success(toastrMessage, 'SUCCESS', {
        newestOnTop: true,
        closeButton: false,
        progressBar: true,
        preventDuplicates: false,
        showMethod: 'slideDown',
        timeOut: 10000,
    });
};
