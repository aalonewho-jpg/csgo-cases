let tg = window.Telegram.WebApp;
tg.expand();

// Баланс пользователя
let balance = 1000;
let inventory = [];

// Предметы для выпадения
const items = [
    { name: "P2000 | Изумруд", price: 800, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLJTitH_si3moWKm_bLP7rCqWdY78RwlNbN9JmjjgLk8xFpZjunJ9ORIAZrYg3R_1a9wO-7hZW07czAm3M37nNwn2fJ20uWjQ", rarity: "blue" },
    { name: "AK-47 | Красная линия", price: 1500, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Rd6dd2j6eT94剪2lQx6uREd2mvdoPAcAA4YgvY8wG6yLvshcO77p7IzHMy7iN3znLdm0e3g0xtGMA", rarity: "purple" },
    { name: "AWP | Древлянка", price: 2500, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJB496klb-GkvP9JvaBx1Rd6dd2j6eT94ik2wKx8kFvYz2nJtKUJAc4ZQ7Vq1O6l7vshcO77p7IzHMy7iN3znLdm0e3g0xtGMA", rarity: "pink" },
    { name: "Нож | Клык", price: 5000, image: "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20kfjjIa_umGpf4dV8j6eT94is3wO3r0s_ZWvxJI7HJgE7NVuC8wLtyL_shcO77p7IzHMy7iN3znLdm0e3g0xtGMA", rarity: "gold" }
];

// Функция обновления баланса
function updateBalanceDisplay() {
    document.getElementById('balance').textContent = balance;
}

// Функция добавления предмета в инвентарь
function addToInventory(item) {
    inventory.push(item);
    renderInventory();
    
    // Сохраняем в Telegram Cloud Storage
    tg.CloudStorage.setItem('inventory', JSON.stringify(inventory));
    tg.CloudStorage.setItem('balance', balance.toString());
}

// Функция отображения инвентаря
function renderInventory() {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';
    
    inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `inventory-item rarity-${item.rarity}`;
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <span class="item-price">${item.price} 💎</span>
        `;
        inventoryDiv.appendChild(itemElement);
    });
}

// Функция открытия кейса
function openCase() {
    if (balance < 250) {
        tg.showAlert('❌ Недостаточно средств!');
        return;
    }
    
    balance -= 250;
    updateBalanceDisplay();
    
    // Анимация открытия
    const btn = document.getElementById('openCaseBtn');
    btn.disabled = true;
    btn.innerHTML = '⏳ ОТКРЫВАЕМ...';
    
    setTimeout(() => {
        // Рандомный предмет (шансы)
        const rand = Math.random();
        let selectedItem;
        
        if (rand < 0.6) { // 60% синие
            selectedItem = {...items[0], price: Math.floor(items[0].price * 0.8)};
        } else if (rand < 0.8) { // 20% фиолетовые
            selectedItem = {...items[1], price: Math.floor(items[1].price * 0.9)};
        } else if (rand < 0.95) { // 15% розовые
            selectedItem = items[2];
        } else if (rand < 0.99) { // 4% красные
            selectedItem = items[3];
        } else { // 1% ножи
            selectedItem = items[4];
        }
        
        // Показываем результат
        showResult(selectedItem);
        
        btn.disabled = false;
        btn.innerHTML = '🔓 ОТКРЫТЬ КЕЙС';
    }, 2000);
}

// Функция показа результата
function showResult(item) {
    const modal = document.getElementById('resultModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="rarity-${item.rarity}">
        <h3>${item.name}</h3>
        <p>${item.price} 💎</p>
    `;
    
    modal.style.display = 'flex';
    
    // Обработчик продажи
    document.getElementById('sellBtn').onclick = () => {
        const sellPrice = Math.floor(item.price * 0.5);
        balance += sellPrice;
        updateBalanceDisplay();
        
        modal.style.display = 'none';
        tg.showAlert(`✅ Предмет продан за ${sellPrice} 💎`);
        
        // Сохраняем баланс
        tg.CloudStorage.setItem('balance', balance.toString());
    };
    
    // Добавляем предмет в инвентарь
    addToInventory(item);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем данные из Telegram Cloud Storage
    tg.CloudStorage.getItem('inventory', (error, value) => {
        if (value) {
            inventory = JSON.parse(value);
            renderInventory();
        }
    });
    
    tg.CloudStorage.getItem('balance', (error, value) => {
        if (value) {
            balance = parseInt(value);
            updateBalanceDisplay();
        }
    });
    
    // Обработчики
    document.getElementById('openCaseBtn').addEventListener('click', openCase);
    
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('resultModal').style.display = 'none';
    });
    
    // Закрытие модального окна по клику вне его
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('resultModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Сохраняем баланс при закрытии
    window.addEventListener('beforeunload', () => {
        tg.CloudStorage.setItem('balance', balance.toString());
        tg.CloudStorage.setItem('inventory', JSON.stringify(inventory));
    });
});