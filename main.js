const root = document.querySelector('.root');

const pizzasData = [
    {id: 1, name: "Чизбургер-пицца", price: 395, category: 1, rating: 5, img: "images/image-2.png"},
    {id: 2, name: "Сырная", price: 450, category: 2, rating: 5, img: "images/image-7.png"},
    {id: 3, name: "Креветки по-азиатски", price: 290, category: 3, rating: 4, img: "images/image-6.png"},
    {id: 4, name: "Сырный цыпленок", price: 385, category: 1, rating: 4, img: "images/image-5.png"},
    {id: 5, name: "Чизбургер-пицца", price: 395, category: 1, rating: 4, img: "images/image-2.png"},
    {id: 6, name: "Сырная", price: 450, category: 2, rating: 4, img: "images/image-7.png"},
    {id: 7, name: "Креветки по-азиатски", price: 290, category: 3, rating: 3, img: "images/image-6.png"},
    {id: 8, name: "Сырный цыпленок", price: 385, category: 1, rating: 3, img: "images/image-5.png"}
];

// 2. ПАРАМЕТРЫ 
const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];
const types = ['тонкое', 'традиционное'];
const sizes = [26, 30, 40];

// 3. СОСТОЯНИЕ
let state = {
    activeCategory: 0,
    sortBy: 'rating',
    cart: [],
    selectedParams: {},
    isSortOpen: false,
    isCartOpen: false
};

// 4. ЛОГИКА (ACTIONS)
const setCategory = (i) => { state.activeCategory = i; render(); };

const setParam = (id, key, val) => {
    if (!state.selectedParams[id]) state.selectedParams[id] = { type: 0, size: 0 };
    state.selectedParams[id][key] = val;
    render();
};

const addToCart = (id) => {
    const pizza = pizzasData.find(p => p.id === Number(id));
    const p = state.selectedParams[id] || { type: 0, size: 0 };
    state.cart.push({ ...pizza, tName: types[p.type], sVal: sizes[p.size], uid: Date.now() + Math.random() });
    render();
};

const updateCount = (id, type, size, delta) => {
    id = Number(id);
    size = Number(size);
    delta = Number(delta);

    if (delta > 0) {
        const item = state.cart.find(i => i.id === id && i.tName === type && i.sVal === size);
        if (item) state.cart.push({ ...item, uid: Date.now() + Math.random() });
    } else {
        if (Math.abs(delta) === 1) {
            const index = state.cart.findIndex(i => i.id === id && i.tName === type && i.sVal === size);
            if (index !== -1) state.cart.splice(index, 1);
        } else {
            state.cart = state.cart.filter(i => 
                !(i.id === id && i.tName === type && i.sVal === size)
            );
        }
    }
    render();
};

const toggleCart = (val) => {
    state.isCartOpen = val === 'true';
    document.body.classList.toggle('no-scroll', state.isCartOpen);
    render();
};

const toggleSort = () => { state.isSortOpen = !state.isSortOpen; render(); };
const setSort = (val) => { state.sortBy = val; state.isSortOpen = false; render(); };

const getCount = (id) => state.cart.filter(item => item.id === id).length;

// --- ЕДИНЫЙ ОБРАБОТЧИК СОБЫТИЙ ---
root.addEventListener('click', (e) => {
    if (e.target.closest('.cart-modal') && !e.target.closest('[data-action]')) {
        return;
    }

    const btn = e.target.closest('[data-action]');

    if (state.isSortOpen && (!btn || btn.dataset.action !== 'toggleSort')) {
        state.isSortOpen = false;
        render();
        if (!btn) return; 
    }
    if (!btn) return;

    const { action, id, val, type, size, delta } = btn.dataset;

    if (action === 'setCategory') setCategory(Number(val));
    if (action === 'setParam') setParam(id, type, Number(val));
    if (action === 'addToCart') addToCart(id);
    if (action === 'toggleCart') toggleCart(val);
    if (action === 'updateCount') {
        updateCount(
            Number(id), 
            type, 
            Number(size), 
            Number(delta)
        );
    }

    if (action === 'toggleSort') toggleSort();
    if (action === 'setSort') setSort(val);
    if (action === 'clearCart') { if(confirm('Очистить корзину?')) { state.cart = []; render(); } }
});

// 5. ОТРИСОВКА
function renderPizzaCard(pizza) {
    const sel = state.selectedParams[pizza.id] || { type: 0, size: 0 };
    const count = getCount(pizza.id);
    return `
        <div style="text-align: center; max-width: 280px; width: 100%; padding: 0; margin: 0;">
            <img src="${pizza.img}" style="width: 260px; padding: 0; margin: 0;">
            <h3 style="padding: 11px 0 22px; box-sizing: border-box; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.01em; text-align: center;">${pizza.name}</h3>
            <div style="background: #f3f3f3; display: flex; flex-direction: column; gap: 7px; border-radius: 10px; padding: 7px 5px; box-sizing: border-box; margin: 0; height: 85px;">
                <ul style="display: flex; list-style: none; padding: 0; margin: 0;">
                    ${types.map((t, i) => `<li data-action="setParam" data-id="${pizza.id}" data-type="type" data-val="${i}" style="flex: 1; padding: 8px; box-sizing: border-box; margin: 0; cursor: pointer; font-size: 14px; font-weight: bold; border-radius: 5px; background: ${sel.type === i ? 'white' : 'transparent'}; box-shadow: ${sel.type === i ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};">${t}</li>`).join('')}
                </ul>
                <ul style="display: flex; list-style: none; padding: 0; margin: 0;">
                    ${sizes.map((s, i) => `<li data-action="setParam" data-id="${pizza.id}" data-type="size" data-val="${i}" style="flex: 1; padding: 8px; box-sizing: border-box; margin: 0; cursor: pointer; font-size: 14px; font-weight: bold; border-radius: 5px; background: ${sel.size === i ? 'white' : 'transparent'}; box-shadow: ${sel.size === i ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};">${s} см.</li>`).join('')}
                </ul>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 17px 0; box-sizing: border-box;">
                <b style="font-weight: 700; font-size: 22px; letter-spacing: 0.01em; color: #000;">от ${pizza.price} ₽</b>
                <button data-action="addToCart" data-id="${pizza.id}" style="background: white; border: 1px solid #fe5f1e; color: #fe5f1e; padding: 10px 18px; box-sizing: border-box; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    + Добавить ${count > 0 ? `<span style="background: #fe5f1e; color: #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700;">${count}</span>` : ''}
                </button>
            </div>
        </div>
    `;
}

function render() {
    if (!root) return;
    const totalAmount = state.cart.reduce((sum, item) => sum + item.price, 0);

    let filtered = state.activeCategory === 0 
        ? [...pizzasData] 
        : pizzasData.filter(p => p.category === state.activeCategory);

    filtered.sort((a, b) => {
        if (state.sortBy === 'price') return a.price - b.price;
        if (state.sortBy === 'name') return a.name.localeCompare(b.name);
        return b.rating - a.rating;
    });

    root.innerHTML = `
        <header class="header" style="display: flex; justify-content: space-between; align-items: center; padding: 92px 65px 40px; box-sizing: border-box;">
            <div class="logo-box" style="display: flex; align-items: center; padding: 0; margin: 0; gap: 15px;">
                <a style="cursor: pointer;"><img src="images/image-1.png" style="width: 38px;"></a>
                <div class="title-box">
                    <h1 style="margin:0; font-size: 24px; font-weight: 800; text-transform: uppercase;">React Pizza</h1>
                    <p style="margin:0; color: #7b7b7b;">самая вкусная пицца во вселенной</p>
                </div>
            </div>
            <div data-action="toggleCart" data-val="true" style="display: flex; align-items: center; background: #fe5f1e; color: white; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; gap: 12px;">
                <span>${totalAmount} ₽</span>
                <div style="width: 1px; height: 25px; background: rgba(255, 255, 255, 0.25);"></div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.56667 15.5667C6.30305 15.5667 6.9 14.9697 6.9 14.2333C6.9 13.4969 6.30305 12.9 5.56667 12.9C4.83029 12.9 4.23334 13.4969 4.23334 14.2333C4.23334 14.9697 4.83029 15.5667 5.56667 15.5667Z" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13.5667 15.5667C14.3031 15.5667 14.9 14.9697 14.9 14.2333C14.9 13.4969 14.3031 12.9 13.5667 12.9C12.8303 12.9 12.2333 13.4969 12.2333 14.2333C12.2333 14.9697 12.8303 15.5667 13.5667 15.5667Z" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.01336 4.23333H15.5667L14.4467 9.82666C14.3857 10.1336 14.2188 10.4093 13.975 10.6055C13.7312 10.8018 13.4262 10.906 13.1134 10.9H6.06669C5.74115 10.9028 5.42584 10.7863 5.18023 10.5726C4.93462 10.3589 4.77567 10.0628 4.73336 9.73999L3.72002 2.05999C3.678 1.73948 3.52097 1.44516 3.27816 1.23177C3.03534 1.01839 2.72328 0.900483 2.40002 0.899994H0.900024" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>${state.cart.length}</span>
                </div>
            </div>
        </header>
        <hr style="width: 100%; border: none; height: 1px; background: #f6f6f6;">

        <div style="display: flex; justify-content: space-between; padding: 40px 65px 0; box-sizing: border-box; align-items: center;">
            <div class="categories" style="display: flex; gap: 10px; padding: 0; margin: 0;">
                ${categories.map((c, i) => `
                    <button class="${state.activeCategory === i ? 'active' : ''}" 
                        data-action="setCategory" data-val="${i}"
                        style="border: none; padding: 10px 22px; box-sizing: border-box; border-radius: 30px; font-weight: bold; cursor: pointer; background: ${state.activeCategory === i ? '#282828' : '#f9f9f9'}; color: ${state.activeCategory === i ? 'white' : '#2c2c2c'};">
                        ${c}
                    </button>
                `).join('')}
            </div>
           <div class="sort">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z" fill="#2C2C2C" />
                </svg>
                <b>Сортировка по:</b>
                <span class="sort-label" data-action="toggleSort">
                    ${state.sortBy === 'rating' ? 'популярности' : state.sortBy === 'price' ? 'по цене' : 'по алфавиту'}
                </span>
                ${state.isSortOpen ? `
                    <div class="sort-popup">
                        <ul>
                            <li class="${state.sortBy === 'rating' ? 'active' : ''}" data-action="setSort" data-val="rating">попопулярности</li>
                            <li class="${state.sortBy === 'price' ? 'active' : ''}" data-action="setSort" data-val="price">по цене</li>
                            <li class="${state.sortBy === 'name' ? 'active' : ''}" data-action="setSort" data-val="name">по алфавиту</li>
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>

        <h2>Все пиццы</h2>

        <div class="pizza-list" style="padding: 0 65px; box-sizing: border-box; margin: 0;">
            ${filtered.map(pizza => renderPizzaCard(pizza)).join('')}
        </div

        ${state.isCartOpen ? renderCartModal(totalAmount) : ''}
    `;
}


function renderCartModal(totalAmount) {
  if (state.cart.length === 0) {
    return `
       <div class="cart-overlay open" data-action="toggleCart" data-val="false">
            <div class="cart-modal" style="height: 82vh;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <a style="cursor: pointer;"><img src="images/image-1.png" style="width: 38px;"></a>
                    <div>
                        <h1 style="margin:0; font-size: 24px; font-weight: 800; text-transform: uppercase;">React Pizza</h1>
                        <p style="margin:0; color: #7b7b7b; font-family: 'Proxima Nova', Arial, sans-serif;">самая вкусная пицца во вселенной</p>
                    </div>
                 </div>
                <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; margin-top: 100px;">
                    <h2 style="font-family: 'Proxima Nova', Arial, sans-serif; font-weight: 700; font-size: 32px; letter-spacing: 0.01em; color: #000; margin-bottom: 10px; padding: 0;">Корзина пустая 😕</h2>
                    <p style="font-family: 'Proxima Nova', Arial, sans-serif; font-size: 18px; color: #777; line-height: 145%; letter-spacing: 0.01em; text-align: center; margin: 0; padding: 0;">
                        Вероятней всего, вы не заказывали ещё пиццу.<br>
                        Для того, чтобы заказать пиццу, перейди на главную страницу.
                    </p>
                    <img src="images/empty-cart.png" alt="Пустая корзина" style="max-width: 300px; width:100%; max-height: 255px; padding-top: 47px; box-sizing: border-box; margin: 0;">
                    <button 
                        data-action="toggleCart" data-val="false"
                        style="font-family: 'Proxima Nova', Arial, sans-serif; margin-top: 74px; padding: 14px 30px 17px; justify-content: center; background: #282828; border-radius: 30px; width: 210px; height: 46px; color: white; font-size: 16px; cursor: pointer; font-weight: 700; letter-spacing: 0.01em; text-align: center; border: none;">
                        Вернуться назад
                    </button>
                </div>
            </div>
        </div>
    `;
  } 
  const grouped = Object.values(state.cart.reduce((acc, item) => {
    const key = `${item.id}-${item.tName}-${item.sVal}`;
    if (!acc[key]) acc[key] = { ...item, count: 0, totalPrice: 0 };
    acc[key].count++;
    acc[key].totalPrice = acc[key].price * acc[key].count;
    return acc;
  }, {}));

    grouped.sort((a, b) => {
        if (a.id !== b.id) return a.id - b.id;
        return a.tName.localeCompare(b.tName);
    });

    return `
    <div class="cart-overlay open" data-action="toggleCart" data-val="false" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; display: flex; justify-content: center; align-items: center;">
        <div class="cart-modal" style="background: white; width: 100%; max-width: 1333px; height: 82vh; border-radius: 10px; display: flex; flex-direction: column;">
            <div style="padding: 42px 65px 40px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <a style="cursor: pointer;"><img src="images/image-1.png" style="width: 38px;"></a>
                    <div>
                        <h1 style="margin:0; font-size: 24px; font-weight: 800; text-transform: uppercase;">React Pizza</h1>
                        <p style="margin:0; color: #7b7b7b;">самая вкусная пицца во вселенной</p>
                    </div>
                </div>
                <button data-action="toggleCart" data-val="false" style="background: none; border: none; font-size: 32px; cursor: pointer; color: #ccc;">&times;</button>
            </div>
            <hr style="width: 100%; border: none; height: 1px; background: #f6f6f6; margin: 0;">
            <div style="flex: 1; overflow-y: auto; padding: 40px 0;">
                <div style="max-width: 821px; margin: 0 auto; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <h3 style="font-size: 32px; margin: 0;">Корзина</h3>
                        <div data-action="clearCart" style="cursor: pointer; color: #b6b6b6;">Очистить корзину</div>
                    </div>
                    ${grouped.map(item => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-top: 1px solid #f6f6f6;">
                            <div style="display: flex; align-items: center; gap: 15px; width: 40%;">
                                <img src="${item.img}" style="width: 80px;">
                                <div><b style="font-size: 22px;">${item.name}</b><br><small style="color: #8d8d8d;">${item.tName} тесто, ${item.sVal} см.</small></div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <button data-action="updateCount" data-id="${item.id}" data-type="${item.tName}" data-size="${item.sVal}" data-delta="-1" style="width:32px; height:32px; border-radius:50%; border:2px solid #fe5f1e; background:none; color:#fe5f1e; cursor:pointer;">-</button>
                                <b style="font-size: 22px;">${item.count}</b>
                                <button data-action="updateCount" data-id="${item.id}" data-type="${item.tName}" data-size="${item.sVal}" data-delta="1" style="width:32px; height:32px; border-radius:50%; border:2px solid #fe5f1e; background:none; color:#fe5f1e; cursor:pointer;">+</button>
                            </div>
                            <b style="font-size: 22px;">${item.totalPrice} ₽</b>
                            <div data-action="updateCount" data-id="${item.id}" data-type="${item.tName}" data-size="${item.sVal}" data-delta="-${item.count}" style="cursor: pointer;">
                                <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="white" stroke="#D7D7D7" stroke-width="2"/><path d="M19 13l-6 6M13 13l6 6" stroke="#D0D0D0" stroke-width="2" stroke-linecap="round"/></svg>
                            </div>
                        </div>`).join('')}
                    <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 22px;">
                        <span>Всего пицц: <b>${state.cart.length} шт.</b></span>
                        <span>Сумма заказа: <b style="color: #fe5f1e;">${totalAmount} ₽</b></span>
                    </div>
                     <div style="padding: 40px 0; display: flex; justify-content: space-between; align-items: center; padding-bottom: 50px;">
                        <button data-action="toggleCart" data-val="false" style="
                            isplay: flex; align-items: center; gap: 12px;
                            background: #fff; border: 1px solid #D3D3D3; color: #D3D3D3;
                            padding: 16px 30px; border-radius: 30px; font-weight: 700; 
                            font-size: 16px; cursor: pointer; transition: all 0.2s;
                        " onmouseover="this.style.borderColor='#000'; this.style.color='#000'" 
                            onmouseout="this.style.borderColor='#D3D3D3'; this.style.color='#D3D3D3'">
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://w3.org">
                                <path d="M7 11L1 6L7 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round""")/>>
                            </svg>
                            Вернуться назад
                        </button>
                        <button style="
                            background: #fe5f1e; color: #fff; border: none;
                            padding: 16px 35px; border-radius: 30px; font-weight: 700;
                            font-size: 16px; cursor: pointer; transition: background 0.2s;
                        " onmouseover="this.style.background='#e2541a'" 
                            onmouseout="this.style.background='#fe5f1e'">
                                Оплатить сейчас
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
render();