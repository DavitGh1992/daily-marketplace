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
let pricelists = [
    { 
        userEmail: "alex@example.com",
        name: "Александр",
        surname: "Петров",
        phone: "+7 (999) 123-45-67",
        date: "2026-07-30", 
        items: "Chanel No.5: 15000₽\nDior Sauvage: 12000₽\nTom Ford Black Orchid: 18000₽" 
    },
    { 
        userEmail: "elena@example.com",
        name: "Елена",
        surname: "Смирнова",
        phone: "+7 (999) 234-56-78",
        date: "2026-07-29", 
        items: "YSL Libre: 11000₽\nVersace Eros: 9500₽\nGucci Bloom: 10500₽" 
    },
    { 
        userEmail: "mikhail@example.com",
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
const pricelistInput = document.getElementById('pricelistInput');

// --- ФУНКЦИЯ СБРОСА АКТИВНЫХ КНОПОК ---
function resetNavButtons() {
    loginViewBtn.classList.remove('active');
    registerViewBtn.classList.remove('active');
}

// --- ФУНКЦИЯ УДАЛЕНИЯ СТАРЫХ ПРАЙС-ЛИСТОВ (старше 7 дней) ---
function removeOldPricelists() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    pricelists = pricelists.filter(list => {
        const listDate = new Date(list.date);
        return listDate >= sevenDaysAgo;
    });
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
    authForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    dashboard.classList.add('hidden');
});

// --- ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ФОРМАМИ ---
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

// --- ОТОБРАЖЕНИЕ ПРАЙС-ЛИСТОВ ---
function renderPricelists() {
    // Удаляем старые прайс-листы перед отображением
    removeOldPricelists();
    
    pricelistContainer.innerHTML = '';
    
    // Сортируем прайс-листы по дате (новые сверху)
    const sortedPricelists = [...pricelists].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedPricelists.forEach((list, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Проверяем, принадлежит ли этот прайс-лист текущему пользователю
        const isOwner = currentUser && currentUser.email === list.userEmail;
        
        card.innerHTML = `
            <h3>Прайс-лист</h3>
            <p class="seller-info">${list.name} ${list.surname}</p>
            <p class="seller-phone">📞 ${list.phone}</p>
            <pre>${list.items}</pre>
            <div class="card-actions">
                <button class="download-btn" data-index="${index}">📥 Скачать Excel</button>
                ${isOwner ? `<button class="delete-btn" data-index="${index}">🗑️ Удалить</button>` : ''}
            </div>
        `;
        pricelistContainer.appendChild(card);
    });
    
    // Добавляем обработчики событий для кнопок
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            downloadPricelist(sortedPricelists[index]);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deletePricelist(sortedPricelists[index]);
        });
    });
}

// --- ФУНКЦИЯ СКАЧИВАНИЯ ПРАЙС-ЛИСТА В EXCEL ---
function downloadPricelist(pricelist) {
    // Разбиваем текст прайс-листа на строки
    const items = pricelist.items.split('\n').filter(line => line.trim() !== '');
    
    // Создаём данные для Excel
    const data = [
        ['ПРАЙС-ЛИСТ'],
        [''],
        ['Продавец:', `${pricelist.name} ${pricelist.surname}`],
        ['Телефон:', pricelist.phone],
        ['Дата:', pricelist.date],
        [''],
        ['Товар', 'Цена'],
        // Разбиваем каждую строку на товар и цену
        ...items.map(item => {
            const parts = item.split(':');
            if (parts.length >= 2) {
                return [parts[0].trim(), parts.slice(1).join(':').trim()];
            }
            return [item.trim(), ''];
        })
    ];
    
    // Создаём рабочий лист
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Устанавливаем ширину колонок
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }];
    
    // Создаём рабочую книгу
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Прайс-лист");
    
    // Скачиваем файл
    const filename = `Прайс-лист_${pricelist.name}_${pricelist.surname}_${pricelist.date}.xlsx`;
    XLSX.writeFile(wb, filename);
}

// --- ФУНКЦИЯ УДАЛЕНИЯ ПРАЙС-ЛИСТА ---
function deletePricelist(pricelistToDelete) {
    if (!confirm('Вы уверены, что хотите удалить этот прайс-лист?')) {
        return;
    }
    
    pricelists = pricelists.filter(list => list !== pricelistToDelete);
    renderPricelists();
    alert('Прайс-лист успешно удалён');
}

// --- РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ---
document.getElementById('registerBtn').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value;
    const surname = document.getElementById('surnameInput').value;
    const email = document.getElementById('emailInput').value;
    const phone = document.getElementById('phoneInput').value;
    const password = document.getElementById('passwordInput').value;
    const verifyPassword = document.getElementById('verifyPasswordInput').value;
    
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
    
    const existingUser = registeredUsers.find(user => user.email === email);
    if (existingUser) {
        document.getElementById('authMessage').textContent = 'Пользователь с таким email уже зарегистрирован';
        return;
    }
    
    const newUser = {
        name: name,
        surname: surname,
        email: email,
        phone: phone,
        password: password
    };
    
    registeredUsers.push(newUser);
    
    document.getElementById('nameInput').value = '';
    document.getElementById('surnameInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('phoneInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('verifyPasswordInput').value = '';
    document.getElementById('authMessage').textContent = '';
    
    alert(`Регистрация успешна!\n\nДобро пожаловать, ${name} ${surname}!\nТеперь вы можете войти в систему.`);
    
    authForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    resetNavButtons();
    loginViewBtn.classList.add('active');
});

// --- ВХОД ПОЛЬЗОВАТЕЛЯ ---
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('loginEmailInput').value;
    const password = document.getElementById('loginPasswordInput').value;
    
    if (!email || !password) {
        document.getElementById('loginMessage').textContent = 'Пожалуйста, введите email и пароль';
        return;
    }
    
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
        document.getElementById('loginMessage').textContent = 'Неверные данные для входа. Проверьте email и пароль.';
        return;
    }
    
    currentUser = user;
    
    document.getElementById('loginEmailInput').value = '';
    document.getElementById('loginPasswordInput').value = '';
    document.getElementById('loginMessage').textContent = '';
    
    loginForm.classList.add('hidden');
    authForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    document.getElementById('sellerName').textContent = `${user.name} ${user.surname}`;
    resetNavButtons();
    
    // Перерисовываем прайс-листы, чтобы показать кнопки удаления для владельца
    renderPricelists();
});

// --- ПУБЛИКАЦИЯ ПРАЙС-ЛИСТА ---
document.getElementById('postPricelistBtn').addEventListener('click', () => {
    const text = pricelistInput.value;
    
    if (!text) {
        alert('Пожалуйста, введите прайс-лист');
        return;
    }
    
    if (!currentUser) {
        alert('Ошибка: вы не авторизованы');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const newPricelist = {
        userEmail: currentUser.email,
        name: currentUser.name,
        surname: currentUser.surname,
        phone: currentUser.phone,
        date: today,
        items: text
    };
    
    pricelists.push(newPricelist);
    
    pricelistInput.value = '';
    
    alert('Прайс-лист успешно опубликован!');
    
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
    
    // Перерисовываем прайс-листы, чтобы скрыть кнопки удаления
    renderPricelists();
});

// Инициализация
renderPricelists();
