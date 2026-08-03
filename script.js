const products = [
    // --- Жидкости ---
    {
        id: 1,
        name: 'Малиновый лед',
        price: 550,
        brand: 'HQD',
        flavor: 'Фруктовый',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/ff6b00/FFFFFF?text=Malina+Led',
        volume: '30 мл',
        strength: '3 мг'
    },
    {
        id: 2,
        name: 'Табак Карамель',
        price: 600,
        brand: 'Elf',
        flavor: 'Табачный',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/db7a00/FFFFFF?text=Tobacco',
        volume: '30 мл',
        strength: '6 мг'
    },
    {
        id: 3,
        name: 'Арбузный бриз',
        price: 520,
        brand: 'HQD',
        flavor: 'Фруктовый',
        inStock: false,
        image: 'https://via.placeholder.com/300x200/00b894/FFFFFF?text=Watermelon',
        volume: '30 мл',
        strength: '0 мг'
    },
    {
        id: 4,
        name: 'Мятный холод',
        price: 580,
        brand: 'Salt',
        flavor: 'Ментоловый',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/00cec9/FFFFFF?text=Mint',
        volume: '30 мл',
        strength: '3 мг'
    },
    {
        id: 5,
        name: 'Персик нектар',
        price: 490,
        brand: 'Elf',
        flavor: 'Фруктовый',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/fdcb6e/FFFFFF?text=Peach',
        volume: '30 мл',
        strength: '6 мг'
    },
    {
        id: 6,
        name: 'Кофе с молоком',
        price: 650,
        brand: 'Salt',
        flavor: 'Десертный',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/e17055/FFFFFF?text=Coffee',
        volume: '30 мл',
        strength: '3 мг'
    },
    // --- Картриджи ---
    {
        id: 7,
        name: 'Картридж HQD 1.2 Ом',
        price: 350,
        brand: 'HQD',
        flavor: 'Картриджи',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/6c5ce7/FFFFFF?text=Cartridge+HQD',
        volume: '1 шт',
        strength: '-'
    },
    {
        id: 8,
        name: 'Картридж Elf 0.8 Ом',
        price: 400,
        brand: 'Elf',
        flavor: 'Картриджи',
        inStock: true,
        image: 'https://via.placeholder.com/300x200/a29bfe/FFFFFF?text=Cartridge+Elf',
        volume: '1 шт',
        strength: '-'
    },
    {
        id: 9,
        name: 'Картридж Salt 1.0 Ом',
        price: 380,
        brand: 'Salt',
        flavor: 'Картриджи',
        inStock: false,
        image: 'https://via.placeholder.com/300x200/fdcb6e/FFFFFF?text=Cartridge+Salt',
        volume: '1 шт',
        strength: '-'
    }
];

// ============================================================
// 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И СОСТОЯНИЕ
// ============================================================
let currentFlavor = 'all';
let currentBrand = 'all';
let showInStockOnly = false;
let cart = [];

// Элементы DOM
const container = document.getElementById('goodsContainer');
const categoryTitle = document.getElementById('categoryTitle');
const productCount = document.getElementById('productCount');
const flavorFilter = document.getElementById('flavorFilter');
const brandFilter = document.getElementById('brandFilter');
const inStockCheckbox = document.getElementById('inStockOnly');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const closeCartBtn = document.getElementById('closeCart');
const cartToggleBtn = document.getElementById('cartToggle');
const sendOrderBtn = document.getElementById('sendOrderBtn');
const toast = document.getElementById('toast');

// ============================================================
// 3. ПОЛУЧЕНИЕ УНИКАЛЬНЫХ ЗНАЧЕНИЙ ДЛЯ ФИЛЬТРОВ
// ============================================================
function getUniqueValues(key) {
    const values = products.map(p => p[key]).filter(v => v);
    return ['all', ...new Set(values)];
}

// ============================================================
// 4. ОТРИСОВКА ФИЛЬТРОВ
// ============================================================
function renderFilters() {
    // Вкусы
    const flavors = getUniqueValues('flavor');
    flavorFilter.innerHTML = flavors.map(f => `
        <li>
            <button class="filter-btn ${f === currentFlavor ? 'active' : ''}" data-filter="flavor" data-value="${f}">
                ${f === 'all' ? 'Все вкусы' : f}
            </button>
        </li>
    `).join('');

    // Бренды
    const brands = getUniqueValues('brand');
    brandFilter.innerHTML = brands.map(b => `
        <li>
            <button class="filter-btn ${b === currentBrand ? 'active' : ''}" data-filter="brand" data-value="${b}">
                ${b === 'all' ? 'Все бренды' : b}
            </button>
        </li>
    `).join('');

    // События на кнопках фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filter;
            const value = btn.dataset.value;
            if (filterType === 'flavor') {
                currentFlavor = value;
            } else if (filterType === 'brand') {
                currentBrand = value;
            }
            renderFilters(); // обновить активные классы
            renderProducts();
        });
    });
}

// ============================================================
// 5. ФИЛЬТРАЦИЯ И ОТРИСОВКА ТОВАРОВ
// ============================================================
function getFilteredProducts() {
    let filtered = [...products];

    // Фильтр по вкусу
    if (currentFlavor !== 'all') {
        filtered = filtered.filter(p => p.flavor === currentFlavor);
    }

    // Фильтр по бренду
    if (currentBrand !== 'all') {
        filtered = filtered.filter(p => p.brand === currentBrand);
    }

    // Фильтр по наличию
    if (showInStockOnly) {
        filtered = filtered.filter(p => p.inStock);
    }

    return filtered;
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const total = filtered.length;

    // Обновляем заголовок и счетчик
    let title = 'Все товары';
    if (currentFlavor !== 'all' && currentBrand !== 'all') {
        title = `${currentFlavor} · ${currentBrand}`;
    } else if (currentFlavor !== 'all') {
        title = currentFlavor;
    } else if (currentBrand !== 'all') {
        title = currentBrand;
    }
    if (showInStockOnly && total > 0) {
        title += ' (в наличии)';
    }
    categoryTitle.textContent = title;
    productCount.textContent = `${total} ${declension(total, 'товар', 'товара', 'товаров')}`;

    if (total === 0) {
        container.innerHTML = `<p class="empty-catalog">😕 Товаров по этим фильтрам не найдено</p>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const statusClass = p.inStock ? 'status-in-stock' : 'status-out-of-stock';
        const statusText = p.inStock ? '✅ В наличии' : '❌ Нет в наличии';
        const btnDisabled = !p.inStock ? 'disabled' : '';
        
        return `
            <div class="product-card">
                <div class="product-img">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-brand">${p.brand}</div>
                    <div class="product-flavor">${p.flavor}</div>
                    <div class="product-details">
                        <span>${p.volume}</span>
                        <span>${p.strength}</span>
                    </div>
                    <div class="product-price">${p.price} ₽</div>
                    <span class="product-status ${statusClass}">${statusText}</span>
                    <button class="add-to-cart-btn" ${btnDisabled} data-id="${p.id}">
                        ${p.inStock ? '🛒 В корзину' : 'Нет в наличии'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // События на кнопки "В корзину"
    document.querySelectorAll('.add-to-cart-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// ============================================================
// 6. КОРЗИНА
// ============================================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast('✅ Товар добавлен в корзину');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartUI() {
    const total = getCartTotal();
    const totalItems = getTotalItems();

    // Обновляем иконку
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Обновляем содержимое корзины
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Корзина пуста</p>`;
        cartTotal.textContent = 'Итого: 0 ₽';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = `Итого: ${total} ₽`;
}

// ============================================================
// 7. ОТПРАВКА В TELEGRAM (ВАРИАНТ 1)
// ============================================================
function sendOrderToTelegram() {
    if (cart.length === 0) {
        showToast('⚠️ Корзина пуста! Добавьте товары.');
        return;
    }

    // Ваш Telegram username (ЗАМЕНИТЕ НА СВОЙ!)
    const telegramUsername = 'seisil'; // <-- СЮДА ВАШ НИКНЕЙМ

    let message = '🐉 *НОВЫЙ ЗАКАЗ (DragonVape)*\n\n';
    message += '📦 *Состав заказа:*\n';
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} — ${item.price}₽ × ${item.quantity} шт = ${item.price * item.quantity}₽\n`;
    });

    const total = getCartTotal();
    message += `\n💰 *Итого:* ${total} ₽`;
    message += `\n\n📱 *Клиент:* @${telegramUsername}`;

    // Кодируем для ссылки
    const encodedMessage = encodeURIComponent(message);
    const telegramLink = `https://t.me/${telegramUsername}?text=${encodedMessage}`;

    // Открываем Telegram
    window.open(telegramLink, '_blank');
    
    // Показываем уведомление
    showToast('📤 Открываем Telegram...');
}

// ============================================================
// 8. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================
function declension(num, one, two, five) {
    const n = Math.abs(num) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return five;
    if (n1 > 1 && n1 < 5) return two;
    if (n1 === 1) return one;
    return five;
}

function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// 9. УПРАВЛЕНИЕ КОРЗИНОЙ (открыть/закрыть)
// ============================================================
function toggleCart() {
    cartPanel.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

cartToggleBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// ============================================================
// 10. ЧЕКБОКС "ТОЛЬКО В НАЛИЧИИ"
// ============================================================
inStockCheckbox.addEventListener('change', () => {
    showInStockOnly = inStockCheckbox.checked;
    renderProducts();
});

// ============================================================
// 11. КНОПКА ОТПРАВКИ ЗАКАЗА
// ============================================================
sendOrderBtn.addEventListener('click', sendOrderToTelegram);

// ============================================================
// 12. ЗАПУСК
// ============================================================
renderFilters();
renderProducts();
updateCartUI();
