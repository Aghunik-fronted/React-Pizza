const root = document.querySelector('.root');

const pizzasData = [
    {id: 1, name: "Чизбургер-пицца", price: 395, category: 1, rating: 4, img: "images/image-2.png"},
    {id: 2, name: "Сырная", price: 450, category: 2, rating: 5, img: "images/image-7.png"},
    {id: 3, name: "Креветки по-азиатски", price: 290, category: 3, rating: 3, img: "images/image-6.png"},
    {id: 4, name: "Сырный цыпленок", price: 385, category: 1, rating: 5, img: "images/image-5.png"}
];

let state = {
    activeCaregory: 0,
    sortBy: 'rating',
    cart: [],
    selectedParams: {}
};

const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];
const types = ['тонкое', 'традиционное'];
const sizes = [26, 30, 40];

window.setCategory = (i) => {
    state.activeCaregory = i;
    render();
};

window.setSort = (val) => {
    state.sortBy = val;
    render();
};

window.setParam = (id, key, val) => {
    if (!state.selectedParams[id]) {
        state.selectedParams[id] = { type: 0, size: 0 };
    }
    state.selectedParams[id][key] = val;
    render();
};

window.addToCart = (id) => {
    const pizza = pizzasData.find(p => p.id === id);
    const params = state.selectedParams[id] || { type: 0, size: 0 };
    const cartItem = {
        ...pizza,
        type: types[params.type],
        size: sizes[params.size],
        uid: Date.now() + Math.random() 
    };
    state.cart.push(cartItem);
    render();
};

window.remove = (uid) => {
    state.cart = state.cart.filter(item => item.uid !== uid);
    render();
};

function render() {
    let filteredPizzas = state.activeCaregory === 0
        ? [...pizzasData]
        : pizzasData.filter(p => p.category === state.activeCaregory);

    filteredPizzas.sort((a, b) => {
        if (state.sortBy === 'price') return a.price - b.price;
        if (state.sortBy === 'rating') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
    });

    root.innerHTML = `
        <div class="header">
            <div class="categories">
                ${categories.map((cat, i) => `
                    <button class="${state.activeCaregory === i ? 'active' : ''}"
                        onclick="setCategory(${i})">${cat}</button>
                `).join('')}
            </div>
            <select onchange="setSort(this.value)">
                <option value="rating" ${state.sortBy === 'rating' ? 'selected' : ''}>по популярности</option>
                <option value="price" ${state.sortBy === 'price' ? 'selected' : ''}>по цене</option>
                <option value="name" ${state.sortBy === 'name' ? 'selected' : ''}>по алфавиту</option>
            </select>
        </div>

        <div class="pizza-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            ${filteredPizzas.map(pizza => {
                const current = state.selectedParams[pizza.id] || { type: 0, size: 0};
                return `
                <div class="pizza-card" style="border: 1px solid #ccc; padding: 10px;">
                    <img src="${pizza.img}" alt="${pizza.name}" style="width: 200px;">
                    <h3>${pizza.name}</h3>
                    <div class="selector">
                        <ul style="display:flex; list-style:none; padding:0; gap:10px;">
                            ${types.map((t, i) => `
                                <li class="${current.type === i ? 'active' : ''}"
                                    style="cursor:pointer; font-weight:${current.type === i ? 'bold' : 'normal'}"
                                    onclick="setParam(${pizza.id}, 'type', ${i})">${t}</li>
                            `).join('')}
                        </ul>
                        <ul style="display:flex; list-style:none; padding:0; gap:10px;">
                            ${sizes.map((s, i) => `
                                <li class="${current.size === i ? 'active' : ''}"
                                    style="cursor:pointer; font-weight:${current.size === i ? 'bold' : 'normal'}"
                                    onclick="setParam(${pizza.id}, 'size', ${i})">${s} см.</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="bottom">
                        <span>от ${pizza.price} ₽</span>
                        <button onclick="addToCart(${pizza.id})">+ Добавить</button>
                    </div>
                </div>
            `}).join('')}
        </div>

        <div class="cart" style="margin-top: 40px; border-top: 1px solid #000;">
            <h2>Корзина (${state.cart.length})</h2>
            ${state.cart.map(item => `
                <div class="cart-item">
                    ${item.name} (${item.type}, ${item.size} см) - ${item.price} ₽
                    <button onclick="remove(${item.uid})">x</button>
                </div>
            `).join('')}
        </div>
    `;
}

render();