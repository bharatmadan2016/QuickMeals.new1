var swiper = new Swiper(".mySwiper", {
    loop: true,
    speed: 5000,
    autoplay: {
        delay: 1,
        disableOnInteraction: false,
    },
    slidesPerView: 1,
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');

const checkOut = document.querySelector('.checkout-btn')
const closeBtn = document.querySelector('.close-btn');

const mobileMenu = document.querySelector('.Mobile-Menu');
const hamburger = document.querySelector('.hamburger');
const barsIcon = document.querySelector('.hamburger i');


const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');

const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');



hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    
    mobileMenu.classList.toggle('Mobile-Menu-Active');
    

    if (barsIcon.classList.contains('fa-bars')) {
        barsIcon.classList.remove('fa-bars');
        barsIcon.classList.add('fa-xmark');
    } else {
        barsIcon.classList.remove('fa-xmark');
        barsIcon.classList.add('fa-bars');
    }
});


cartIcon.addEventListener('click', () => cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'));
checkOut.addEventListener('click', () =>cartTab.classList.remove('cart-tab-active'));

let productList = [];
let cartProduct = [];

const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cartProduct");
    if (storedCart) {
        cartProduct = JSON.parse(storedCart);
        cartProduct.forEach(product => {
            renderCartItem(product, product.quantity);
        });
        updateTotals();
    }
};

const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;

    document.querySelectorAll('.item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-value').textContent);
        const price = parseFloat(item.querySelector('.item-total').textContent.replace('Rs.', ''));
        totalPrice += price;
        totalQuantity += quantity;
    });

    cartTotal.textContent = `Rs. ${totalPrice}`;
    cartValue.textContent = totalQuantity;
};

const showCards = () => {
    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}" alt="">
        </div>

        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="" class="btn card-btn">Add to Cart</a>
        `;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};

const renderCartItem = (product, initialQuantity = 1) => {
    let price = parseFloat(product.price.replace('Rs.', ''));
    let quantity = initialQuantity;
    
    const cartItem = document.createElement('div');
    cartItem.classList.add('item');
    cartItem.setAttribute('data-product-id', product.id);

    cartItem.innerHTML = `
        <div class="item-image">
           <img src="${product.image}" alt="">
        </div>

        <div class="item-details">
            <h4>${product.name}</h4>
            <h4 class="item-total">Rs. ${(price * quantity)}</h4>
        </div>

        <div class="flex quantity-box">
            <button class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </button>

            <h4 class="quantity-value">${quantity}</h4>

            <button class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    `;

    cartList.appendChild(cartItem);

    const plusBtn = cartItem.querySelector('.plus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');
    const minusBtn = cartItem.querySelector('.minus');

    plusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `Rs. ${(price * quantity)}`;
        
        const productIndex = cartProduct.findIndex(item => item.id === product.id);
        if (productIndex > -1) {
            cartProduct[productIndex].quantity = quantity;
            updateCartStorage();
        }
        updateTotals();
    });

    minusBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (quantity > 1) {
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `Rs. ${(price * quantity)}`;
            
            const productIndex = cartProduct.findIndex(item => item.id === product.id);
            if (productIndex > -1) {
                cartProduct[productIndex].quantity = quantity;
                updateCartStorage();
            }
            updateTotals();
        } else {
            cartItem.classList.add('slide-out');
            setTimeout(() => {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateCartStorage();
                updateTotals();
            }, 300);
        }
    });
};

const addToCart = (product) => {
    const existingProductIndex = cartProduct.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        alert("Item already in the cart");
        return;
    }
    
    const productWithQuantity = {
        ...product,
        quantity: 1
    };
    
    cartProduct.push(productWithQuantity);
    renderCartItem(product, 1);
    updateCartStorage();
    updateTotals();
};

const updateCartStorage = () => {
    localStorage.setItem("cartProduct", JSON.stringify(cartProduct));
};

const initApp = () => {
    fetch("Products.json")
        .then(response => response.json())
        .then(data => {
            productList = data;
            showCards();
            loadCartFromStorage();
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
};

initApp();
