// Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand();

// Состояние
let state = {
    balance: 1250,
    inventory: []
};

// Скины
const skins = [
    { name: "AK-47 | Redline", price: 2500, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%238a2be2' rx='15'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='12'%3EAK-47%3C/text%3E%3C/svg%3E" },
    { name: "AWP | Dragon Lore", price: 150000, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ffd700' rx='15'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='black' font-size='12'%3EAWP%3C/text%3E%3C/svg%3E" },
    { name: "M4A4 | Howl", price: 80000, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ff4444' rx='15'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='12'%3EM4A4%3C/text%3E%3C/svg%3E" },
    { name: "Butterfly Knife", price: 45000, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ffaa00' rx='15'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='12'%3EKNIFE%3C/text%3E%3C/svg%3E" },
    { name: "USP-S | Orion", price: 3500, image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%238a2be2' rx='15'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='12'%3EUSP%3C/text%3E%3C/svg%3E" }
];

// Обновление баланса
function updateBalance() {
    document.getElementById('balanceDisplay').textContent = state.balance;
    if (document.getElementById('casesBalance')) {
        document.getElementById('casesBalance').textContent = state.balance;
    }
}

// Навигация
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-page="${pageId.replace('Page', '')}"]`).classList.add('active');
}

// Открытие кейса
function openCase(price, name) {
    if (state.balance < price) {
        alert('Недостаточно средств!');
        return;
    }
    
    state.balance -= price;
    updateBalance();
    
    // Рандомный скин
    setTimeout(() => {
        const skin = skins[Math.floor(Math.random() * skins.length)];
        const wonSkin = {
            ...skin,
            price: Math.floor(skin.price * (0.5 + Math.random() * 0.5))
        };
        
        document.getElementById('resultImage').src = wonSkin.image;
        document.getElementById('resultName').textContent = wonSkin.name;
        document.getElementById('resultPrice').textContent = wonSkin.price + ' 💎';
        
        document.getElementById('resultModal').style.display = 'flex';
        
        document.getElementById('sellBtn').onclick = () => {
            const sellPrice = Math.floor(wonSkin.price * 0.5);
            state.balance += sellPrice;
            updateBalance();
            
            state.inventory.push({
                ...wonSkin,
                price: sellPrice,
                sold: true
            });
            
            document.getElementById('resultModal').style.display = 'none';
            renderInventory();
        };
    }, 500);
}

// Рендер инвентаря
function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (state.inventory.length === 0) {
        grid.innerHTML = '<div style="grid-column:span 3; text-align:center; padding:40px; color:#7bb9ff;">Инвентарь пуст</div>';
        return;
    }
    
    state.inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `
            <img src="${item.image}">
            <span>${item.name}</span>
            <span style="color:#4da6ff;">${item.price} 💎</span>
        `;
        grid.appendChild(div);
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    renderInventory();
    
    // Навигация по кнопкам
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            showPage(page + 'Page');
        });
    });
    
    // Логотип на главную
    document.getElementById('header').addEventListener('click', () => {
        showPage('homePage');
    });
    
    // Кейсы
    document.querySelectorAll('.case-item').forEach(item => {
        item.addEventListener('click', () => {
            const price = parseInt(item.dataset.price);
            const name = item.dataset.name;
            openCase(price, name);
        });
    });
    
    // Пополнение
    document.getElementById('refillBtn').addEventListener('click', () => {
        state.balance += 1000;
        updateBalance();
    });
    
    // Разное -> Кейсы
    document.querySelector('[data-page="cases"]').addEventListener('click', () => {
        showPage('casesPage');
    });
    
    // Закрыть модалку
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('resultModal').style.display = 'none';
    });
    
    // Фильтры инвентаря
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderInventory();
        });
    });
    
    // Закрытие модалки по клику вне
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('resultModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
