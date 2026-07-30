// --- ХРАНИЛИЩЕ ПОЛЬЗОВАТЕЛЕЙ (в памяти) ---
const registeredUsers = [
    {
        name: "Александр",
        surname: "Петров",
        email: "alex@example.com",
        phone: "+7 (999) 123-45-67",
        password: "password123"
    },
    {
        name: "Елена",
        surname: "Смирнова",
        email: "elena@example.com",
        phone: "+7 (999) 234-56-78",
        password: "password123"
    },
    {
        name: "Михаил",
        surname: "Иванов",
        email: "mikhail@example.com",
        phone: "+7 (999) 345-67-89",
        password: "password123"
    }
];

// --- ХРАНИЛИЩЕ ПРАЙС-ЛИСТОВ (в памяти) ---
const pricelists = [
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
        date: "2026-07-29", 
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

// --- ТЕКУЩИЙ АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ ---
let currentUser = null;

// --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ---
const logoBtn = document.getElementById('logoBtn');
const loginViewBtn = document.getElementById('loginViewBtn');
const registerViewBtn = document.getElementById('registerViewBtn');
const buyerSection = document.getElementById('buyerSection');
const sellerSection = document.getElementById('sellerSection');
const pricelistContainer = document.getElementById('pricelistContainer');
const authForm = document.getElementById('authForm');
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');

// --- ФУНКЦИЯ СБРОСА АКТИВНЫХ КНОПОК ---
function resetNavButtons() {
    loginViewBtn.classList.remove('active');
    registerViewBtn.classList.remove('active');
}

// --- ПЕРЕКЛЮЧЕНИЕ НА ГЛАВНУЮ (при клике на логотип) ---
logoBtn.addEventListener('click', () => {
    buyerSection.classList.remove('hidden');
    sellerSection.classList.add('hidden');
    resetNavButtons();
});

// --- ПЕРЕКЛЮЧЕНИЕ НА ВХОД ---
loginViewBtn.addEventListener('click', () => {
    buyerSection.classList.add('hidden');
    sellerSection.classList.remove('hidden');
    resetNavButtons();
    loginViewBtn.classList.add('active');
    // Показываем форму входа
    loginForm.classList.remove('hidden');
    authForm.classList.add('hidden');
    dashboard.classList.add('hidden');
});

// --- ПЕРЕКЛЮЧЕНИЕ НА РЕГИСТРАЦИЮ ---
registerViewBtn.addEventListener('click', () => {
    buyerSection.classList.add('hidden');
    sellerSection.classList.remove('hidden');
    resetNavButtons();
    registerViewBtn.classList.add('active');
    // Показываем форму регистрации
    authForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    dashboard.classList.add('hidden');
});

// --- ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ФОРМАМИ (по ссылкам внутри форм) ---
document.getElementById('showLoginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    authForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    resetNavButtons();
    loginViewBtn.classList.add('active');
});

document.getElementById('showRegisterBtn').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    authForm.classList.remove('hidden');
    resetNavButtons();
    registerViewBtn.classList.add('active');
});

// --- ОТОБРАЖЕНИЕ ПРАЙС-ЛИСТОВ (отсортированных по дате, новые сверху) ---
function renderPricelists() {
    pricelistContainer.innerHTML = '';
    
    // Сортируем прайс-листы по дате (новые сверху)
    const sortedPricelists = [...pricelists].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedPricelists.forEach(list => {
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

// --- РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ---
document.getElementById('registerBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const surname = document.getElementById('surnameInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;
    const password = document.getElementById('passwordInput').value;
    const verifyPassword = document.getElementById('verifyPasswordInput').value;
    
    // Проверка заполнения всех полей
    if (!name || !surname || !email || !phone || !password || !verifyPassword) {
        document.getElementById('authMessage').textContent = 'Пожалуйста, заполните все поля';
        return;
    }
    
    // Проверка совпадения паролей
    if (password !== verifyPassword) {
        document.getElementById('authMessage').textContent = 'Пароли не совпадают';
        return;
    }
    
    // Проверка длины пароля
    if (password.length < 6) {
        document.getElementById('authMessage').textContent = 'Пароль должен содержать минимум 6 символов';
        return;
    }
    
    // Проверка, не зарегистрирован ли уже этот email
    const existingUser = registeredUsers.find(user => user.email === email);
    if (existingUser) {
        document.getElementById('authMessage').textContent = 'Пользователь с таким email уже зарегистрирован';
        return;
    }
    
    // Добавляем нового пользователя
    const newUser = {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        password: password
    };
    
    registeredUsers.push(newUser);
    
    // Очищаем форму и сообщения
    document.getElementById('nameInput').value = '';
    document.getElementById('surnameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('verifyPasswordInput').value = '';
    document.getElementById('authMessage').textContent = '';
    
    alert(`Регистрация успешна!\n\nДобро пожаловать, ${name} ${surname}!\nТеперь вы можете войти в систему.`);
    
    // Переключаемся на форму входа
    authForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    resetNavButtons();
    loginViewBtn.classList.add('active');
});

// --- ВХОД ПОЛЬЗОВАТЕЛЯ ---
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('loginEmailInput').value;
    const password = document.getElementById('loginPasswordInput').value;
    
    // Проверка заполнения полей
    if (!email || !password) {
        document.getElementById('loginMessage').textContent = 'Пожалуйста, введите email и пароль';
        return;
    }
    
    // Поиск пользователя в базе зарегистрированных
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
        document.getElementById('loginMessage').textContent = 'Неверные данные для входа. Проверьте email и пароль.';
        return;
    }
    
    // Успешный вход
    currentUser = user;
    
    // Очищаем форму входа и сообщения
    document.getElementById('loginEmailInput').value = '';
    document.getElementById('loginPasswordInput').value = '';
    document.getElementById('loginMessage').textContent = '';
    
    // Показываем панель продавца
    loginForm.classList.add('hidden');
    authForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('sellerName').textContent = `${user.name} ${user.surname}`;
    resetNavButtons();
});

// --- ПУБЛИКАЦИЯ ПРАЙС-ЛИСТА ---
document.getElementById('postPricelistBtn').addEventListener('click', () => {
    const text = document.getElementById('pricelistInput').value;
    
    if (!text) {
        alert('Пожалуйста, введите прайс-лист');
        return;
    }
    
    if (!currentUser) {
        alert('Ошибка: вы не авторизованы');
        return;
    }
    
    // Получаем текущую дату
    const today = new Date().toISOString().split('T')[0];
    
    // Создаём новый прайс-лист
    const newPricelist = {
        name: currentUser.name,
        surname: currentUser.surname,
        phone: currentUser.phone,
        date: today,
        items: text
    };
    
    // Добавляем в массив прайс-листов
    pricelists.push(newPricelist);
    
    // Очищаем поле ввода
    document.getElementById('pricelistInput').value = '';
    
    alert('Прайс-лист успешно опубликован!');
    
    // Обновляем отображение прайс-листов на главной странице
    renderPricelists();
});

// --- ВЫХОД ИЗ СИСТЕМЫ ---
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUser = null;
    dashboard.classList.add('hidden');
    loginForm.classList.remove('hidden');
    document.getElementById('sellerName').textContent = '';
    resetNavButtons();
    loginViewBtn.classList.add('active');
});

// Инициализация
renderPricelists();
