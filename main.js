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
    selectedParams: {} 
};
window.toggleSort = () => {
    state.isSortOpen = !state.isSortOpen;
    render();
};
window.setSort = (val) => {
    state.sortBy = val;
    state.isSortOpen = false; 
    render();
};
// 4. ЛОГИКА (ACTIONS)
window.setCategory = (i) => { state.activeCategory = i; render(); };
window.setSort = (val) => { state.sortBy = val; render(); };
window.setParam = (id, key, val) => {
    if (!state.selectedParams[id]) state.selectedParams[id] = { type: 0, size: 0 };
    state.selectedParams[id][key] = val;
    render();
};
window.addToCart = (id) => {
    const pizza = pizzasData.find(p => p.id === id);
    const p = state.selectedParams[id] || { type: 0, size: 0 };
    state.cart.push({ ...pizza, tName: types[p.type], sVal: sizes[p.size], uid: Date.now() + Math.random() });
    render();
};

// Считаем, сколько штук этой пиццы в корзине
const getCount = (id) => state.cart.filter(item => item.id === id).length;

// 5. ОТРИСОВКА
function render() {
    if (!root) return;
    const totalAmount = state.cart.reduce((sum, item) => sum + item.price, 0);

    let filtered = state.activeCategory === 0 
        ? [...pizzasData] 
        : pizzasData.filter(p => p.category === state.activeCategory);

    filtered.sort((a, b) => state.sortBy === 'price' ? a.price - b.price : b.rating - a.rating);

    root.innerHTML = `
        <header class="header" style="display: flex; justify-content: space-between; align-items: center; padding: 92px 65px 40px; box-sizing: border-box;">
            <div class="logo-box" style="display: flex; align-items: center; padding: 0; margin: 0; gap: 15px;">
                <img src="images/image-1.png" style="width: 38px;">
                <div class="title-box">
                    <h1 style="margin:0; font-size: 24px; font-weight: 800; text-transform: uppercase;">React Pizza</h1>
                    <p style="margin:0; color: #7b7b7b;">самая вкусная пицца во вселенной</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; background: #fe5f1e; color: white; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; gap: 12px;">
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
                        onclick="setCategory(${i})"
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
                <span class="sort-label" onclick="window.toggleSort()">
                    ${state.sortBy === 'rating' ? 'популярности' : state.sortBy === 'price' ? 'по цене' : 'по алфавиту'}
                </span>
                ${state.isSortOpen ? `
                    <div class="sort-popup">
                        <ul>
                            <li class="${state.sortBy === 'rating' ? 'active' : ''}" onclick="setSort('rating')">попопулярности</li>
                            <li class="${state.sortBy === 'price' ? 'active' : ''}" onclick="setSort('price')">по цене</li>
                            <li class="${state.sortBy === 'name' ? 'active' : ''}" onclick="setSort('name')">по алфавиту</li>
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>

        <h2>Все пиццы</h2>

        <div class="pizza-list" style="padding: 0 65px; box-sizing: border-box; margin: 0;">
            ${filtered.map(pizza => {
                const sel = state.selectedParams[pizza.id] || { type: 0, size: 0 };
                const count = getCount(pizza.id);
                return `
                <div style="text-align: center; max-width: 280px; width: 100%; padding: 0; margin: 0;">
                    <img src="${pizza.img}" style="width: 260px; padding: 0; margin: 0;">
                    <h3 style="padding: 11px 0 22px; box-sizing: border-box; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.01em; text-align: center;">${pizza.name}</h3>
                    <div style="background: #f3f3f3; display: flex; flex-direction: column; gap: 7px; border-radius: 10px; padding: 7px 5px; box-sizing: border-box; margin: 0; height: 85px;">
                        <ul style="display: flex; list-style: none; padding: 0; margin: 0;">
                            ${types.map((t, i) => `<li onclick="setParam(${pizza.id}, 'type', ${i})" style="flex: 1; padding: 8px; box-sizing: margin: 0; border-box; cursor: pointer; font-size: 14px; font-weight: bold; border-radius: 5px; background: ${sel.type === i ? 'white' : 'transparent'}; box-shadow: ${sel.type === i ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};">${t}</li>`).join('')}
                        </ul>
                        <ul style="display: flex; list-style: none; padding: 0; margin: 0;">
                            ${sizes.map((s, i) => `<li onclick="setParam(${pizza.id}, 'size', ${i})" style="flex: 1; padding: 8px; box-sizing: margin: 0; border-box; cursor: pointer; font-size: 14px; font-weight: bold; border-radius: 5px; background: ${sel.size === i ? 'white' : 'transparent'}; box-shadow: ${sel.size === i ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};">${s} см.</li>`).join('')}
                        </ul>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 17px 0; box-sizing: border-box;">
                        <b style="font-weight: 700; font-size: 22px; letter-spacing: 0.01em; color: #000;">от ${pizza.price} ₽</b>
                        <button onclick="addToCart(${pizza.id})" style="background: white; border: 1px solid #fe5f1e; color: #fe5f1e; padding: 10px 18px; box-sizing: border-box; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            + Добавить ${count > 0 ? `<span style="background: #fe5f1e; color: #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700;">${count}</span>` : ''}
                        </button>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
}

render();