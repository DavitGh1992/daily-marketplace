// --- ДЕМО ДАННЫЕ (позже заменим на Firebase) ---
const mockPricelists = [
    { 
        name: "Александр",
        surname: "Петров",
        phone: "+7 (999) 123-45-67",
        date: "2026-07-30", 
        items: "Chanel No.5: 15000₽\nDior Sauvage: 12000₽\nTom Ford Black Orchid: 18000₽" 
    },
    { 
        name: "Елена",
        surname: "Смирнова",
        phone: "+7 (999) 234-56-78",
        date: "2026-07-30", 
        items: "YSL Libre: 11000₽\nVersace Eros: 9500₽\nGucci Bloom: 10500₽" 
    },
    { 
        name: "Михаил",
        surname: "Иванов",
        phone: "+7 (999) 345-67-89",
        date: "2026-07-30", 
        items: "Creed Aventus: 25000₽\nAcqua di Gio: 8500₽\nBleu de Chanel: 13000₽" 
    }
];

// --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ---
const homeViewBtn = document.getElementById('homeViewBtn');
const sellerViewBtn = document.getElementById('sellerViewBtn');
const buyerSection = document.getElementById('buyerSection');
const sellerSection = document.getElementById('sellerSection');
const pricelistContainer = document.getElementById('pricelistContainer');
const authForm = document.getElementById('authForm');
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');

// --- ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ---
homeViewBtn.addEventListener('click', () => {
    buyerSection.classList.remove('hidden');
    sellerSection.classList.add('hidden');
    homeViewBtn.classList.add('active');
    sellerViewBtn.classList.remove('active');
});

sellerViewBtn.addEventListener('click', () => {
    buyerSection.classList.add('hidden');
    sellerSection.classList.remove('hidden');
    sellerViewBtn.classList.add('active');
    homeViewBtn.classList.remove('active');
    // Показываем форму регистрации по умолчанию
    authForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// --- ПЕРЕКЛЮЧЕНИЕ МЕЖДУ РЕГИСТРАЦИЕЙ И ВХОДОМ ---
document.getElementById('showLoginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    authForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

document.getElementById('showRegisterBtn').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    authForm.classList.remove('hidden');
});

// --- ОТОБРАЖЕНИЕ ПРАЙС-ЛИСТОВ ---
function renderPricelists() {
    pricelistContainer.innerHTML = '';
    mockPricelists.forEach(list => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>Прайс-лист</h3>
            <p class="seller-info">${list.name} ${list.surname}</p>
            <p class="seller-phone">📞 ${list.phone}</p>
            <pre>${list.items}</pre>
        `;
        pricelistContainer.appendChild(card);
    });
}

// --- ДЕЙСТВИЯ ПРОДАВЦА (ДЕМО) ---
document.getElementById('registerBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const surname = document.getElementById('surnameInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;
    const password = document.getElementById('passwordInput').value;
    const verifyPassword = document.getElementById('verifyPasswordInput').value;
    
    // Простая валидация
    if (!name || !surname || !email || !phone || !password || !verifyPassword) {
        document.getElementById('authMessage').textContent = 'Пожалуйста, заполните все поля';
        return;
    }
    
    if (password !== verifyPassword) {
        document.getElementById('authMessage').textContent = 'Пароли не совпадают';
        return;
    }
    
    if (password.length < 6) {
        document.getElementById('authMessage').textContent = 'Пароль должен содержать минимум 6 символов';
        return;
    }
    
    // Демо: показываем что регистрация прошла успешно
    alert(`Регистрация успешна!\n\nИмя: ${name} ${surname}\nEmail: ${email}\nТелефон: ${phone}`);
    
    // Очищаем форму
    document.getElementById('nameInput').value = '';
    document.getElementById('surnameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('verifyPasswordInput').value = '';
    document.getElementById('authMessage').textContent = '';
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('loginEmailInput').value;
    const password = document.getElementById('loginPasswordInput').value;
    
    if (!email || !password) {
        document.getElementById('loginMessage').textContent = 'Пожалуйста, введите email и пароль';
        return;
    }
    
    // Демо: имитируем вход
    authForm.classList.add('hidden');
    loginForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('sellerName').textContent = 'Продавец';
});

document.getElementById('postPricelistBtn').addEventListener('click', () => {
    const text = document.getElementById('pricelistInput').value;
    if (text) {
        alert('Прайс-лист успешно опубликован!');
        document.getElementById('pricelistInput').value = '';
    } else {
        alert('Пожалуйста, введите прайс-лист');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    dashboard.classList.add('hidden');
    authForm.classList.remove('hidden');
    document.getElementById('sellerName').textContent = '';
});

// Инициализация
renderPricelists();
