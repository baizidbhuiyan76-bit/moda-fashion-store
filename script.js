/* =========================
   MOBILE MENU
========================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        mobileNav.classList.toggle("active");

        const icon = mobileMenuBtn.querySelector("i");

        if (mobileNav.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
}

document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
        mobileNav.classList.remove("active");

        const icon = mobileMenuBtn.querySelector("i");
        if(icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });
});


/* =========================
   SEARCH
========================= */

const searchBtn = document.getElementById("searchBtn");
const searchArea = document.getElementById("searchArea");
const searchInput = document.getElementById("searchInput");

if(searchBtn) {
    searchBtn.addEventListener("click", () => {
        searchArea.classList.toggle("active");
        if (searchArea.classList.contains("active") && searchInput) {
            searchInput.focus();
        }
    });
}


/* =========================
   CART (FIXED)
========================= */

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("modaCart")) || [];


/* Open Cart */
function openCart() {
    if(cartSidebar) cartSidebar.classList.add("active");
    if(cartOverlay) cartOverlay.classList.add("active");
    updateCart(); 
}


/* Close Cart */
function closeCartSidebar() {
    if(cartSidebar) cartSidebar.classList.remove("active");
    if(cartOverlay) cartOverlay.classList.remove("active");
}


if(cartBtn) cartBtn.addEventListener("click", openCart);
if(closeCart) closeCart.addEventListener("click", closeCartSidebar);
if(cartOverlay) cartOverlay.addEventListener("click", closeCartSidebar);


/* =========================
   ADD TO CART
========================= */

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        
        cart = JSON.parse(localStorage.getItem("modaCart")) || [];

        const productName = button.dataset.product || button.closest('.product-card, .shop-product-card')?.querySelector('h3')?.textContent || "Premium Fashion Item";
        
        const existingProduct = cart.find(
            item => item.name === productName
        );

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: productName,
                quantity: 1,
                price: getProductPrice(productName),
                image: button.closest('.product-card, .shop-product-card')?.querySelector('img')?.src || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=85"
            });
        }

        localStorage.setItem("modaCart", JSON.stringify(cart));
        
        updateCart();
        showToast(`${productName} added to cart`);

    });
});


/* Product Prices */
function getProductPrice(productName) {
    const prices = {
        "Classic Cotton T-Shirt": 1290,
        "Premium Denim Jacket": 2990,
        "Elegant Everyday Dress": 2490,
        "Relaxed Fit Linen Shirt": 1890,
        "Minimal Summer Set": 2790,
        "Oversized Essential Tee": 1490,
        "Soft Satin Blouse": 1990,
        "Classic Tailored Outfit": 3290
    };
    return prices[productName] || 1500;
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {
    cart = JSON.parse(localStorage.getItem("modaCart")) || [];
    
    const cartCountElements = document.querySelectorAll(".cart-count");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        let cleanPrice = Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0;
        totalPrice += cleanPrice * item.quantity;
    });

    localStorage.setItem("modaCartCount", totalItems);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });

    if(!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started.</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = "";

        cart.forEach((item, index) => {
            const productElement = document.createElement("div");
            productElement.className = "cart-product";

            let cleanPrice = Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0;

            productElement.innerHTML = `
                <div class="cart-product-info" style="display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid #eee;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${item.image}" style="width:55px; height:55px; object-fit:cover; border-radius:5px; border:1px solid #eaeaea;" alt="${item.name}">
                        <div>
                            <h4 style="margin:0; font-size:14px; color:#111;">${item.name}</h4>
                            <p style="margin:4px 0 0; color:#666; font-size:13px;">
                                ৳${cleanPrice.toLocaleString()} × ${item.quantity}
                            </p>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff3b30; cursor:pointer; font-size:13px; text-decoration:underline; font-weight:500;">
                        Remove
                    </button>
                </div>
            `;
            cartItems.appendChild(productElement);
        });
    }

    if(cartTotal) {
        cartTotal.textContent = `৳${totalPrice.toLocaleString()}`;
    }
}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(index) {
    cart = JSON.parse(localStorage.getItem("modaCart")) || [];
    const removedProduct = cart[index].name;
    cart.splice(index, 1);
    
    localStorage.setItem("modaCart", JSON.stringify(cart));
    
    updateCart();
    if(typeof renderCart === 'function') renderCart(); 
    
    showToast(`${removedProduct} removed`);
}


/* =========================
   WISHLIST
========================= */

const wishlistCount = document.querySelector(".wishlist-count");
let savedWishlist = JSON.parse(localStorage.getItem("modaWishlist")) || [];

function updateWishlistCounter() {
    if(wishlistCount) wishlistCount.textContent = savedWishlist.length;
}
updateWishlistCounter();

const wishlistButtons = document.querySelectorAll(".product-wishlist");

wishlistButtons.forEach(button => {
    
    const pName = button.dataset.id || button.closest('.product-card, .shop-product-card')?.querySelector('h3')?.textContent || "Item";
    if(savedWishlist.includes(pName)) {
        button.classList.add("active");
        const icon = button.querySelector("i");
        if(icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }
    }

    button.addEventListener("click", (e) => {
        e.preventDefault();
        const icon = button.querySelector("i");
        button.classList.toggle("active");
        
        const currentPName = button.dataset.id || button.closest('.product-card, .shop-product-card')?.querySelector('h3')?.textContent || "Item";

        if (button.classList.contains("active")) {
            if(icon) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
            }
            if(!savedWishlist.includes(currentPName)) savedWishlist.push(currentPName);
            showToast("Added to wishlist");
        } else {
            if(icon) {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
            }
            savedWishlist = savedWishlist.filter(id => id !== currentPName);
            showToast("Removed from wishlist");
        }
        
        localStorage.setItem("modaWishlist", JSON.stringify(savedWishlist));
        updateWishlistCounter();
    });
});


/* =========================
   QUICK VIEW
========================= */

const quickViewButtons = document.querySelectorAll(".quick-view");

quickViewButtons.forEach(button => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".product-card, .shop-product-card");
        if(productCard) {
            const productName = productCard.querySelector("h3").textContent;
            showToast(`Quick view: ${productName}`);
        }
    });
});


/* =========================
   TOAST MESSAGE
========================= */

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

let toastTimer;

function showToast(message) {
    if(!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================
   COUNTDOWN TIMER
========================= */

let saleEndTime = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000);

function updateCountdown() {
    if (!document.getElementById("days")) return;

    const now = new Date().getTime();
    const distance = saleEndTime - now;

    if (distance <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =========================
   SEARCH ACTION
========================= */

const searchSubmit = document.getElementById("searchSubmit");
if(searchSubmit) searchSubmit.addEventListener("click", performSearch);

if(searchInput) {
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
}

function performSearch() {
    if(!searchInput) return;
    const searchValue = searchInput.value.trim();
    if (!searchValue) {
        showToast("Please enter a product name");
        return;
    }
    showToast(`Searching for "${searchValue}"`);
}


/* =========================
   CHECKOUT BUTTON
========================= */

const checkoutButton = document.querySelector(".checkout-btn");

if(checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        let currentCart = JSON.parse(localStorage.getItem("modaCart")) || [];
        if (currentCart.length === 0) {
            showToast("Your cart is empty");
            return;
        }
        window.location.href = "checkout.html";
    });
}

updateCart();

/* =========================================================
   STEP 2 - SHOP PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const shopGrid = document.getElementById("shopProductGrid");

    if (!shopGrid) return;

    const products = [
        /* MEN */
        { id: "men-01", category: "men", name: "Classic Cotton T-Shirt", price: 1290, oldPrice: 1590, rating: 4.8, reviews: 24, date: 20, badge: "BEST SELLER", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85" },
        { id: "men-02", category: "men", name: "Premium Denim Jacket", price: 2990, oldPrice: 3990, rating: 4.7, reviews: 18, date: 19, badge: "-25%", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85" },
        { id: "men-03", category: "men", name: "Relaxed Fit Linen Shirt", price: 1890, rating: 4.6, reviews: 15, date: 18, badge: "NEW", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85" },
        { id: "men-04", category: "men", name: "Oversized Essential Tee", price: 1490, rating: 4.8, reviews: 12, date: 17, image: "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=800&q=85" },
        { id: "men-05", category: "men", name: "Premium Casual Shirt", price: 2290, oldPrice: 2790, rating: 4.8, reviews: 22, date: 16, badge: "SALE", image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85" },
        { id: "men-06", category: "men", name: "Classic Polo Shirt", price: 1690, rating: 4.7, reviews: 19, date: 15, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=85" },
        { id: "men-07", category: "men", name: "Premium Oxford Shirt", price: 2490, rating: 4.9, reviews: 16, date: 14, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85" },
        { id: "men-08", category: "men", name: "Slim Fit Jeans", price: 2790, oldPrice: 3290, rating: 4.7, reviews: 27, date: 13, badge: "-15%", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85" },
        { id: "men-09", category: "men", name: "Relaxed Cargo Pants", price: 2390, rating: 4.6, reviews: 14, date: 12, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85" },
        { id: "men-10", category: "men", name: "Premium Chino Pants", price: 2590, rating: 4.8, reviews: 21, date: 11, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85" },
        { id: "men-11", category: "men", name: "Classic Panjabi", price: 2190, rating: 4.9, reviews: 32, date: 10, badge: "POPULAR", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85" },
        { id: "men-12", category: "men", name: "Premium Embroidered Panjabi", price: 3490, oldPrice: 3990, rating: 4.9, reviews: 29, date: 9, badge: "BEST SELLER", image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=85" },
        { id: "men-13", category: "men", name: "Formal Suit Jacket", price: 4500, rating: 4.8, reviews: 11, date: 8, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=85" },
        { id: "men-14", category: "men", name: "Summer Shorts", price: 990, rating: 4.5, reviews: 34, date: 7, badge: "NEW", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85" },
        { id: "men-15", category: "men", name: "Cotton Sweatpants", price: 1390, rating: 4.7, reviews: 15, date: 6, image: "https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=800&q=85" },

        /* WOMEN */
        { id: "women-01", category: "women", name: "Elegant Abaya", price: 2990, rating: 4.9, reviews: 35, date: 20, badge: "NEW", image: "images/Elegant Abaya.jpg" },
        { id: "women-02", category: "women", name: "Premium Embroidered Abaya", price: 3990, oldPrice: 4490, rating: 4.9, reviews: 28, date: 19, badge: "BEST SELLER", image: "images/Premium Embroidered Abaya.jpg" },
        { id: "women-03", category: "women", name: "Modest Maxi Dress", price: 2790, rating: 4.8, reviews: 23, date: 18, image: "images/Modest Maxi Dress.jpg" },
        { id: "women-04", category: "women", name: "Floral Islamic Kaftan", price: 3190, rating: 4.7, reviews: 17, date: 17, badge: "NEW", image: "images/Floral Islamic Kaftan.jpg" },
        { id: "women-05", category: "women", name: "Premium Chiffon Hijab", price: 690, rating: 4.9, reviews: 41, date: 16, image: "images/Premium Chiffon Hijab.jpg" },
        { id: "women-06", category: "women", name: "Jilbab with Matching Hijab", price: 2490, rating: 4.8, reviews: 26, date: 15, image: "images/Jilbab with Matching Hijab.jpg" },
        { id: "women-07", category: "women", name: "Two-Piece Modest Co-ord Set", price: 2890, rating: 4.8, reviews: 19, date: 14, image: "images/Two-Piece Modest Co-ord Set.jpg" },
        { id: "women-08", category: "women", name: "Embroidered Long Kurti Set", price: 2690, oldPrice: 3190, rating: 4.7, reviews: 22, date: 13, badge: "SALE", image: "images/Embroidered Long Kurti Set.jpg" },
        { id: "women-09", category: "women", name: "Soft Silk Hijab", price: 890, rating: 4.6, reviews: 15, date: 12, image: "images/Soft Silk Hijab.jpg" },
        { id: "women-10", category: "women", name: "Casual Tunic Top", price: 1890, rating: 4.5, reviews: 20, date: 11, image: "images/Casual Tunic Top.jpg" },
        { id: "women-11", category: "women", name: "Formal Wide Leg Pants", price: 1590, rating: 4.7, reviews: 18, date: 10, badge: "NEW", image: "images/Formal Wide Leg Pants.jpg" },
        { id: "women-12", category: "women", name: "Printed Summer Dress", price: 2290, rating: 4.8, reviews: 31, date: 9, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85" },
        { id: "women-13", category: "women", name: "Satin Evening Gown", price: 4590, oldPrice: 5000, rating: 4.9, reviews: 12, date: 8, badge: "SALE", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=85" },
        { id: "women-14", category: "women", name: "Classic Trench Coat", price: 3490, rating: 4.7, reviews: 22, date: 7, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85" },
        { id: "women-15", category: "women", name: "Daily Wear Salwar Suit", price: 2190, rating: 4.6, reviews: 27, date: 6, image: "images/Daily Wear Salwar Suit.jpg" },

        /* KIDS */
        { id: "kids-01", category: "kids", name: "Kids Casual Outfit", price: 990, rating: 4.5, reviews: 11, date: 12, badge: "NEW", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=85" },
        { id: "kids-02", category: "kids", name: "Kids Premium T-Shirt", price: 790, rating: 4.7, reviews: 18, date: 11, image: "images/Kids Premium T-Shirt.jpg" },
        { id: "kids-03", category: "kids", name: "Kids Traditional Panjabi", price: 1490, rating: 4.8, reviews: 14, date: 10, image: "images/Kids Traditional Panjabi.jpg" },
        { id: "kids-04", category: "kids", name: "Kids Festive Dress", price: 1790, rating: 4.8, reviews: 16, date: 9, badge: "POPULAR", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=85" },
        { id: "kids-05", category: "kids", name: "Boys Denim Jeans", price: 1290, rating: 4.6, reviews: 20, date: 8, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=85" },
        { id: "kids-06", category: "kids", name: "Girls Floral Frock", price: 1590, rating: 4.9, reviews: 32, date: 7, badge: "NEW", image: "images/Girls Floral Frock.jpg" },
        { id: "kids-07", category: "kids", name: "Kids Winter Hoodie", price: 1490, oldPrice: 1890, rating: 4.7, reviews: 25, date: 6, badge: "SALE", image: "images/Kids Winter Hoodie.jpg" },
        { id: "kids-08", category: "kids", name: "Toddler Nightwear", price: 890, rating: 4.5, reviews: 18, date: 5, image: "images/Toddler Nightwear.jpg" },
        { id: "kids-09", category: "kids", name: "Kid Boys Polo Shirt", price: 790, rating: 4.6, reviews: 14, date: 4, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=85" },
        { id: "kids-10", category: "kids", name: "Kid Girls Summer Top", price: 690, rating: 4.7, reviews: 21, date: 3, image: "images/kid Girls Summer Top.jpg" },
        { id: "kids-11", category: "kids", name: "Kids School Backpack", price: 1190, rating: 4.8, reviews: 40, date: 2, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85" },
        { id: "kids-12", category: "kids", name: "Kids Sports Shoes", price: 1890, rating: 4.7, reviews: 28, date: 1, image: "images/Kids Sports Shoes.jpg" },
        { id: "kids-13", category: "kids", name: "Baby Romper Suit", price: 590, rating: 4.9, reviews: 55, date: 20, badge: "BEST SELLER", image: "images/Baby Romper Suit.jpg" },
        { id: "kids-14", category: "kids", name: "Girls Ethnic Kurti", price: 1690, rating: 4.6, reviews: 15, date: 19, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=85" },
        { id: "kids-15", category: "kids", name: "Kid Boys Cargo Shorts", price: 990, rating: 4.5, reviews: 12, date: 18, image: "images/Kid Boys Cargo Shorts.jpg" },

        /* ACCESSORIES */
        { id: "accessories-01", category: "accessories", name: "Classic Fashion Bag", price: 1290, rating: 4.7, reviews: 17, date: 12, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-02", category: "accessories", name: "Minimal Sunglasses", price: 890, rating: 4.6, reviews: 16, date: 11, badge: "NEW", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-03", category: "accessories", name: "Premium Leather Wallet", price: 1190, rating: 4.8, reviews: 24, date: 10, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-04", category: "accessories", name: "Classic Leather Belt", price: 990, rating: 4.7, reviews: 20, date: 9, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-05", category: "accessories", name: "Men's Classic Watch", price: 3490, oldPrice: 3990, rating: 4.9, reviews: 45, date: 8, badge: "SALE", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-06", category: "accessories", name: "Women's Pearl Necklace", price: 1590, rating: 4.8, reviews: 28, date: 7, image: "images/Women's Pearl Necklace.jpg" },
        { id: "accessories-07", category: "accessories", name: "Unisex Canvas Cap", price: 490, rating: 4.5, reviews: 15, date: 6, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-08", category: "accessories", name: "Leather Crossbody Bag", price: 2190, rating: 4.7, reviews: 32, date: 5, badge: "NEW", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-09", category: "accessories", name: "Formal Silk Tie", price: 790, rating: 4.6, reviews: 18, date: 4, image: "images/Formal Silk Tie.jpg" },
        { id: "accessories-10", category: "accessories", name: "Stylish Hairband Set", price: 390, rating: 4.8, reviews: 40, date: 3, image: "images/Stylish Hairband Set.jpg" },
        { id: "accessories-11", category: "accessories", name: "Silver Bracelet", price: 1490, rating: 4.7, reviews: 22, date: 2, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-12", category: "accessories", name: "Aviator Sunglasses", price: 1290, oldPrice: 1500, rating: 4.8, reviews: 35, date: 1, badge: "SALE", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85" },
        { id: "accessories-13", category: "accessories", name: "Travel Backpack", price: 2890, rating: 4.9, reviews: 50, date: 20, badge: "BEST SELLER", image: "images/Travel Backpack.jpg" },
        { id: "accessories-14", category: "accessories", name: "Woolen Scarf", price: 690, rating: 4.6, reviews: 19, date: 19, image: "images/Woolen Scarf.jpg" },
        { id: "accessories-15", category: "accessories", name: "Gold Plated Earrings", price: 890, rating: 4.7, reviews: 27, date: 18, image: "images/Gold Plated Earrings.jpg" }
    ];

    const productCount = document.getElementById("productCount");
    const noProducts = document.getElementById("noProducts");
    const sortProducts = document.getElementById("sortProducts");
    const searchInput = document.getElementById("shopSearchInput");
    const categoryFilters = document.querySelectorAll(".category-filter");
    const priceFilters = document.querySelectorAll(".price-filter");
    const ratingFilters = document.querySelectorAll(".rating-filter");

    function renderProducts(list) {
        shopGrid.innerHTML = "";
        list.forEach(function (product) {
            const card = document.createElement("article");
            card.className = "shop-product-card";
            card.dataset.category = product.category;
            card.dataset.price = product.price;
            card.dataset.rating = product.rating;
            card.dataset.date = product.date;

            const badge = product.badge
                    ? `<span class="product-badge ${product.badge.includes("-") || product.badge === "SALE" ? "sale-badge" : ""}">
                        ${product.badge}
                       </span>`
                    : "";

            const oldPrice = product.oldPrice
                    ? `<del>৳${product.oldPrice.toLocaleString()}</del>`
                    : "";

            card.innerHTML = `
                <div class="shop-product-image">
                    ${badge}
                    <button class="product-wishlist" data-id="${product.id}">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <button class="quick-view" data-id="${product.id}">
                        Quick View
                    </button>
                </div>

                <div class="product-info">
                    <p class="product-category">${getCategoryName(product.category)}</p>
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        <span>★★★★★</span>
                        <small>(${product.reviews})</small>
                    </div>
                    <div class="product-price">
                        <strong>৳${product.price.toLocaleString()}</strong>
                        ${oldPrice}
                    </div>
                    <button class="add-cart" data-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            `;
            shopGrid.appendChild(card);
        });

        attachProductEvents();
    }

    function getCategoryName(category) {
        if (category === "men") return "MEN'S WEAR";
        if (category === "women") return "WOMEN'S ISLAMIC WEAR";
        if (category === "kids") return "KIDS WEAR";
        if (category === "accessories") return "ACCESSORIES";
        return "FASHION";
    }

    function filterProducts() {
        const category = document.querySelector(".category-filter:checked")?.value || "all";
        const price = document.querySelector(".price-filter:checked")?.value || "all";
        const rating = document.querySelector(".rating-filter:checked")?.value || "all";
        const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

        let filtered = products.filter(function (product) {
            const categoryMatch = category === "all" || product.category === category;
            
            let priceMatch = true;
            if (price === "0-1500") priceMatch = product.price < 1500;
            if (price === "1500-2500") priceMatch = product.price >= 1500 && product.price <= 2500;
            if (price === "2500-4000") priceMatch = product.price > 2500 && product.price <= 4000;
            if (price === "4000+") priceMatch = product.price > 4000;

            let ratingMatch = true;
            if (rating === "4") ratingMatch = product.rating >= 4;
            if (rating === "4.5") ratingMatch = product.rating >= 4.5;

            const searchMatch = search === "" || product.name.toLowerCase().includes(search) || getCategoryName(product.category).toLowerCase().includes(search);

            return categoryMatch && priceMatch && ratingMatch && searchMatch;
        });

        const sort = sortProducts ? sortProducts.value : "default";

        if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
        if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
        if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
        if (sort === "newest") filtered.sort((a, b) => b.date - a.date);

        renderProducts(filtered);

        if (productCount) productCount.textContent = filtered.length;
        if (noProducts) noProducts.style.display = filtered.length === 0 ? "block" : "none";
    }

    function loadCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");

        if (category && ["men", "women", "kids", "accessories"].includes(category)) {
            const selected = document.querySelector(`.category-filter[value="${category}"]`);
            if (selected) selected.checked = true;
            updateShopHero(category);
        } else {
            const all = document.querySelector('.category-filter[value="all"]');
            if (all) all.checked = true;
            updateShopHero("all");
        }
    }

    function updateShopHero(category) {
        const title = document.getElementById("shopHeroTitle");
        const description = document.getElementById("shopHeroDescription");

        if (!title) return;

        const data = {
            all: { title: "All Products", description: "Discover premium fashion pieces carefully selected for your style." },
            men: { title: "Men's Collection", description: "Explore premium men's fashion made for everyday confidence." },
            women: { title: "Women's Islamic Collection", description: "Discover elegant Islamic and modest fashion designed with comfort and grace." },
            kids: { title: "Kids Collection", description: "Comfortable and stylish fashion made for little ones." },
            accessories: { title: "Accessories Collection", description: "Complete your look with carefully selected fashion accessories." }
        };

        if (data[category]) {
            title.textContent = data[category].title;
            if (description) description.textContent = data[category].description;
        }
    }

    categoryFilters.forEach(function (filter) {
        filter.addEventListener("change", function () {
            categoryFilters.forEach(function (item) {
                item.checked = item === filter;
            });
            updateShopHero(filter.value);
            const newURL = filter.value === "all" ? "shop.html" : `shop.html?category=${filter.value}`;
            window.history.replaceState({}, "", newURL);
            filterProducts();
        });
    });

    priceFilters.forEach(function (filter) {
        filter.addEventListener("change", filterProducts);
    });

    ratingFilters.forEach(function (filter) {
        filter.addEventListener("change", filterProducts);
    });

    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    if (sortProducts) {
        sortProducts.addEventListener("change", filterProducts);
    }

    function attachProductEvents() {
        /* WISHLIST */
        document.querySelectorAll(".product-wishlist").forEach(function (button) {
            let wl = JSON.parse(localStorage.getItem("modaWishlist")) || [];
            
            if(wl.includes(button.dataset.id)) {
                button.classList.add("active");
                button.querySelector("i").classList.replace("fa-regular", "fa-solid");
            }

            button.addEventListener("click", function (e) {
                e.preventDefault();
                let wl = JSON.parse(localStorage.getItem("modaWishlist")) || [];
                const icon = button.querySelector("i");
                button.classList.toggle("active");

                if (button.classList.contains("active")) {
                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");
                    if(!wl.includes(button.dataset.id)) wl.push(button.dataset.id);
                    showShopToast("Added to wishlist");
                } else {
                    icon.classList.remove("fa-solid");
                    icon.classList.add("fa-regular");
                    wl = wl.filter(id => id !== button.dataset.id);
                    showShopToast("Removed from wishlist");
                }
                
                localStorage.setItem("modaWishlist", JSON.stringify(wl));
                if(document.querySelector(".wishlist-count")) {
                    document.querySelector(".wishlist-count").textContent = wl.length;
                }
            });
        });

        /* ADD TO CART */
        document.querySelectorAll(".add-cart").forEach(function (button) {
            button.addEventListener("click", function () {
                const product = products.find(item => item.id == button.dataset.id);
                if (!product) return;

                let shopCart = JSON.parse(localStorage.getItem("modaCart")) || [];
                const existing = shopCart.find(item => item.id == product.id || item.name == product.name);

                if (existing) {
                    existing.quantity++;
                } else {
                    shopCart.push({
                        id: product.id,
                        name: product.name,
                        category: getCategoryName(product.category),
                        price: product.price,
                        image: product.image,
                        color: "Default",
                        size: "M",
                        quantity: 1
                    });
                }

                localStorage.setItem("modaCart", JSON.stringify(shopCart));
                
                updateCart(); 

                button.textContent = "Added!";
                setTimeout(function () {
                    button.textContent = "Add to Cart";
                }, 1200);
                showShopToast(`${product.name} added to cart`);
            });
        });

        /* QUICK VIEW & IMAGE FULLSCREEN */
        document.querySelectorAll(".quick-view, .shop-product-image img, .product-image img").forEach(function (element) {
            element.addEventListener("click", function (e) {
                e.preventDefault(); 
                const lightbox = document.getElementById("productLightbox");
                const lightboxImg = document.getElementById("lightboxImage");

                if (!lightbox || !lightboxImg) return;

                let imageSrc = "";
                if (element.tagName.toUpperCase() === "IMG") {
                    imageSrc = element.src;
                } else {
                    const card = element.closest(".shop-product-card, .product-card");
                    if (card) {
                        const img = card.querySelector("img");
                        if (img) imageSrc = img.src;
                    }
                }

                if (imageSrc) {
                    lightboxImg.src = imageSrc;
                    lightbox.classList.add("active");
                }
            });
        });

        const closeLightboxBtn = document.getElementById("closeLightbox");
        const lightbox = document.getElementById("productLightbox");
        if (closeLightboxBtn && lightbox) {
            closeLightboxBtn.addEventListener("click", function () {
                lightbox.classList.remove("active");
            });
            lightbox.addEventListener("click", function (e) {
                if (e.target === lightbox) lightbox.classList.remove("active");
            });
        }
    }

    const clearFilters = document.getElementById("clearFilters");
    if (clearFilters) {
        clearFilters.addEventListener("click", function () {
            const all = document.querySelector('.category-filter[value="all"]');
            const allPrice = document.querySelector('.price-filter[value="all"]');
            const allRating = document.querySelector('.rating-filter[value="all"]');

            categoryFilters.forEach(item => item.checked = false);

            if (all) all.checked = true;
            if (allPrice) allPrice.checked = true;
            if (allRating) allRating.checked = true;
            if (searchInput) searchInput.value = "";
            if (sortProducts) sortProducts.value = "default";

            updateShopHero("all");
            window.history.replaceState({}, "", "shop.html");
            filterProducts();
        });
    }

    function showShopToast(message) {
        let toast = document.getElementById("shopToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "shopToast";
            toast.className = "shop-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(window.shopToastTimer);
        window.shopToastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2200);
    }

    loadCategoryFromURL();
    filterProducts();
});


/* =========================================================
   STEP 4 - SHOPPING CART PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cartItemsContainer = document.getElementById("cartItems");
    if (!cartItemsContainer || !document.getElementById("cartLayout")) return;

    const cartLayout = document.getElementById("cartLayout");
    const emptyCart = document.getElementById("emptyCart");
    const subtotalElement = document.getElementById("cartSubtotal");
    const shippingElement = document.getElementById("cartShipping");
    const discountElement = document.getElementById("cartDiscount");
    const totalElement = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCartBtn");

    function renderPageCart() {
        let pageCart = JSON.parse(localStorage.getItem("modaCart")) || [];
        cartItemsContainer.innerHTML = "";

        if (pageCart.length === 0) {
            if (cartLayout) cartLayout.style.display = "none";
            if (emptyCart) emptyCart.classList.add("show");
            updatePageSummary();
            return;
        }

        if (cartLayout) cartLayout.style.display = "grid";
        if (emptyCart) emptyCart.classList.remove("show");

        pageCart.forEach(function (product, index) {
            const item = document.createElement("div");
            let cleanPrice = Number(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
            let itemTotal = cleanPrice * product.quantity;

            item.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee;">
                    <img src="${product.image}" alt="${product.name}" style="width: 70px; height: 70px; min-width: 70px; object-fit: cover; border-radius: 6px; border:1px solid #eaeaea;">
                    <div style="flex: 1; padding: 0 15px; display: flex; flex-direction: column; gap: 6px;">
                        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #222; line-height: 1.2;">${product.name}</h4>
                        <p style="margin: 0; font-size: 13px; color: #666;">৳${cleanPrice.toLocaleString()}</p>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                            <button class="cart-minus" data-index="${index}" style="padding: 2px 10px; border: 1px solid #ccc; cursor: pointer; background: #fff; font-size: 14px;">-</button>
                            <span style="font-size: 14px; font-weight: 600;">${product.quantity}</span>
                            <button class="cart-plus" data-index="${index}" style="padding: 2px 10px; border: 1px solid #ccc; cursor: pointer; background: #fff; font-size: 14px;">+</button>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; height: 70px;">
                        <span style="font-size: 15px; font-weight: 700; color: #000;">৳${itemTotal.toLocaleString('en-IN')}</span>
                        <button class="remove-item-page" data-index="${index}" style="background: none; border: none; color: #ff3b30; font-size: 13px; cursor: pointer; text-decoration: underline; padding: 0;">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(item);
        });

        attachPageCartEvents();
        updatePageSummary();
    }

    function attachPageCartEvents() {
        let pageCart = JSON.parse(localStorage.getItem("modaCart")) || [];

        document.querySelectorAll(".cart-minus").forEach(function (button) {
            button.addEventListener("click", function () {
                const index = parseInt(button.dataset.index);
                if (pageCart[index].quantity > 1) {
                    pageCart[index].quantity--;
                } else {
                    pageCart.splice(index, 1);
                }
                localStorage.setItem("modaCart", JSON.stringify(pageCart));
                updateCart();
                renderPageCart();
            });
        });

        document.querySelectorAll(".cart-plus").forEach(function (button) {
            button.addEventListener("click", function () {
                const index = parseInt(button.dataset.index);
                if (pageCart[index].quantity < 10) pageCart[index].quantity++;
                localStorage.setItem("modaCart", JSON.stringify(pageCart));
                updateCart();
                renderPageCart();
            });
        });

        document.querySelectorAll(".remove-item-page").forEach(function (button) {
            button.addEventListener("click", function () {
                const index = parseInt(button.dataset.index);
                pageCart.splice(index, 1);
                localStorage.setItem("modaCart", JSON.stringify(pageCart));
                updateCart();
                renderPageCart();
            });
        });
    }

    function updatePageSummary() {
        let pageCart = JSON.parse(localStorage.getItem("modaCart")) || [];
        let subtotal = 0;
        pageCart.forEach(function (product) {
            let cleanPrice = Number(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
            subtotal += cleanPrice * product.quantity;
        });

        let discount = 0;
        const coupon = localStorage.getItem("modaCoupon");
        if (coupon === "WELCOME10") discount = Math.round(subtotal * 0.10);

        const discountedSubtotal = subtotal - discount;
        let shipping = 0;
        if (discountedSubtotal > 0) shipping = discountedSubtotal >= 3000 ? 0 : 100;
        const total = discountedSubtotal + shipping;

        try {
            if (subtotalElement) subtotalElement.textContent = "৳" + subtotal.toLocaleString();
            if (shippingElement) shippingElement.textContent = shipping === 0 ? "FREE" : "৳" + shipping.toLocaleString();
            if (discountElement) discountElement.textContent = "- ৳" + discount.toLocaleString();
            if (totalElement) totalElement.textContent = "৳" + total.toLocaleString();
        } catch (error) {}
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to clear your cart?")) {
                localStorage.setItem("modaCart", JSON.stringify([]));
                updateCart();
                renderPageCart();
            }
        });
    }

    window.renderCart = renderPageCart;
    renderPageCart();

});


/* =========================================================
   STEP 5 - CHECKOUT (GOOGLE SHEETS INTEGRATION)
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    
    function calculateCheckoutFinal() {
        let cartData = JSON.parse(localStorage.getItem("modaCart")) || [];
        let subtotal = 0;

        cartData.forEach(function (product) {
            let cleanPrice = Number(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
            subtotal += cleanPrice * product.quantity;
        });

        let discount = 0;
        const coupon = localStorage.getItem("modaCoupon");
        if (coupon === "WELCOME10") discount = Math.round(subtotal * 0.10);

        const discountedSubtotal = subtotal - discount;
        let shipping = discountedSubtotal > 0 ? (discountedSubtotal >= 3000 ? 0 : 100) : 0;
        const total = discountedSubtotal + shipping;

        const subtotalEl = document.getElementById("checkoutSubtotal");
        const shippingEl = document.getElementById("checkoutShipping");
        const discountEl = document.getElementById("checkoutDiscount");
        const totalEl = document.getElementById("checkoutTotal");

        if(subtotalEl) subtotalEl.textContent = "৳" + subtotal.toLocaleString();
        if(shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : "৳" + shipping.toLocaleString();
        if(discountEl) discountEl.textContent = "- ৳" + discount.toLocaleString();
        if(totalEl) totalEl.textContent = "৳" + total.toLocaleString();

        const checkoutProducts = document.getElementById("checkoutProducts");
        if (checkoutProducts && cartData.length > 0) {
            checkoutProducts.innerHTML = "";
            cartData.forEach(function (product) {
                let p = Number(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
                
                checkoutProducts.innerHTML += `
                    <div class="checkout-product" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <img src="${product.image}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border:1px solid #eaeaea;" alt="${product.name}">
                            <div>
                                <h4 style="margin:0; font-size:14px; color:#111;">${product.name}</h4>
                                <small style="color:#666;">Qty: ${product.quantity}</small>
                            </div>
                        </div>
                        <strong style="color:#111;">৳${(p * product.quantity).toLocaleString()}</strong>
                    </div>
                `;
            });
        }
    }

    if (window.location.href.includes("checkout.html")) {
        calculateCheckoutFinal();
    }

    const paymentOptions = document.querySelectorAll(".payment-option");
    const mobilePaymentInfo = document.getElementById("mobilePaymentInfo");

    if(paymentOptions.length > 0) {
        paymentOptions.forEach(function (option) {
            option.addEventListener("click", function (e) {
                if(e.target.tagName.toLowerCase() !== 'input') {
                    e.preventDefault();
                    const radio = option.querySelector("input[type='radio']");
                    if (radio) radio.checked = true;
                }

                paymentOptions.forEach(opt => opt.classList.remove("active"));
                option.classList.add("active");

                const radio = option.querySelector("input[type='radio']");
                if (radio && mobilePaymentInfo) {
                    if (radio.value === "bKash") {
                        mobilePaymentInfo.innerHTML = `<p><strong>bKash:</strong> Payment instructions will be shown after placing the order.</p>`;
                    } else if (radio.value === "Nagad") {
                        mobilePaymentInfo.innerHTML = `<p><strong>Nagad:</strong> Payment instructions will be shown after placing the order.</p>`;
                    } else {
                        mobilePaymentInfo.innerHTML = `<p><strong>Cash on Delivery:</strong> Pay the delivery agent when your order arrives.</p>`;
                    }
                }
            });
        });
    }

    // Google Sheets Submission Logic
    const checkoutForm = document.getElementById("checkoutForm");
    if(checkoutForm) {
        checkoutForm.addEventListener("submit", function(e){
            e.preventDefault(); // ফর্ম রিলোড হওয়া বন্ধ করে
            
            let finalCart = JSON.parse(localStorage.getItem("modaCart")) || [];
            if(finalCart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // =======================================================
            // এখানে আপনার গুগল অ্যাপস স্ক্রিপ্ট (Web App) এর লিংকটি বসান
            // =======================================================
            const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4H4LF28uRyaELjbwVXPkKNN6Jnr3TChI6W4vTV-_6NXYT71bgf762gKGOZXsnsatY5A/exec"; 
            
            // "Place Order" বাটনের লেখা পরিবর্তন করে "Processing..." দেখানো
            const submitBtn = document.getElementById("placeOrderBtn") || checkoutForm.querySelector("button[type='submit']");
            if(submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
            }

            // কাস্টমারের তথ্য ও মোট দাম হিসাব
            let subtotal = 0;
            finalCart.forEach(p => subtotal += (Number(String(p.price).replace(/[^0-9.-]+/g, "")) || 0) * p.quantity);
            let discount = localStorage.getItem("modaCoupon") === "WELCOME10" ? Math.round(subtotal * 0.10) : 0;
            let shipping = (subtotal - discount) >= 3000 ? 0 : 100;
            let total = (subtotal - discount) + shipping;

            // ফর্মের ডেটা সংগ্রহ
            const name = document.getElementById("customerName").value;
            const phone = document.getElementById("customerPhone").value;
            const city = document.getElementById("city").value;
            const area = document.getElementById("area").value;
            const address = document.getElementById("address").value;
            const paymentMethodElement = document.querySelector("input[name='paymentMethod']:checked");
            const paymentMethod = paymentMethodElement ? paymentMethodElement.value : "Unknown";
            
            // প্রোডাক্টগুলোকে একটি লাইনে সাজানো
            const orderDetails = finalCart.map(item => `${item.name} (Qty: ${item.quantity})`).join(" | ");

            // ডাটা প্যাকিং
            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("address", city + ", " + area + " - " + address);
            formData.append("orderDetails", orderDetails);
            formData.append("totalPrice", total);
            formData.append("paymentMethod", paymentMethod);

            // ব্যাকগ্রাউন্ডে ডেটা পাঠানো (AJAX Fetch)
            fetch(SCRIPT_URL, {
                method: "POST",
                body: formData
            }).then(response => response.text())
              .then(data => {
                // সফল হলে কার্ট ক্লিয়ার করে পেজ পরিবর্তন
                localStorage.setItem("modaCart", JSON.stringify([]));
                updateCart();
                alert("Order Placed Successfully!");
                window.location.href = "index.html"; // অর্ডার সাকসেস পেজে পাঠাতে চাইলে এখানে "order-success.html" দেবেন
            }).catch(error => {
                console.error('Error!', error.message);
                alert("Something went wrong! Please try again.");
                if(submitBtn) {
                    submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Place Order';
                    submitBtn.disabled = false;
                }
            });
        });
    }
});


/* ==========================================
   PERFECT LIGHTBOX
========================================== */
document.addEventListener("click", function (e) {
    const lightbox = document.getElementById("productLightbox");
    if (!lightbox) return;

    const trigger = e.target.closest(".quick-view, .product-card img, .shop-product-card img");
    if (trigger) {
        e.preventDefault();
        const imgEl = trigger.tagName === "IMG" ? trigger : trigger.closest(".product-card, .shop-product-card").querySelector("img");
        if (imgEl) {
            const lightboxImg = document.getElementById("lightboxImage");
            if(lightboxImg) lightboxImg.src = imgEl.src;
            lightbox.classList.add("active");
        }
        return; 
    }

    if (lightbox.classList.contains("active")) {
        const clickedOnImage = e.target.closest("#lightboxImage");
        if (!clickedOnImage) {
            lightbox.classList.remove("active");
        }
    }
});
