const extendCart = pxValue => document.querySelector(".cart").style.height = `${pxValue}px`;

extendCart("220");
// 320 max

const animation = (tagName, pxValue, position) => {
    document.querySelector(tagName).style.transition = `all .3s`;
    document.querySelector(tagName).style.transform = `translate${position}(${pxValue}px)`;
}

// theme switcher
const switcher = document.querySelector(".switcher");
switcher.addEventListener("change", themeSwitcher);
let i = 0
function themeSwitcher(event) {
    if (event.target.checked) {
        document.querySelector("body").style.transition = "all .4s"
        document.querySelector("body").style.background = "#121212"
        document.querySelector("body").style.color = "#D7D7D7"
        document.querySelector("header").style.background = "#1F1F1F"
        document.querySelector("ul").className = "white-color";
    } else {
        document.querySelector("body").style.background = "#fff"
        document.querySelector("body").style.color = "#333333"
        document.querySelector("header").style.background = "#fff"
        document.querySelector("ul").className = "black-color";
    }
}

// menu functions, render categories
const nav = document.querySelector("nav");
nav.addEventListener("click", renderProductCategory);
function renderProductCategory(event = category) {
    const obj = [];
    const selected = document.querySelector(".selected");
    let categoryName = event.path[0].textContent;

    for (let i = 0; i < data.length; i++) {
        if (categoryName == "Todos") {
            obj.push(data[i]);
            selected.classList.remove("selected");
            event.path[0].classList.add("selected");
        } else if (data[i].tag[0] == categoryName) {
            obj.push(data[i]);
            selected.classList.remove("selected");
            event.path[0].classList.add("selected");
        }
    }
    obj.length > 0 ? renderProducts(obj) : false;
}

// render products in the showcase
const ulProducts = document.querySelector(".products");
function renderProducts(obj = data) {
    ulProducts.innerHTML = "";
    for (let i = 0; i < obj.length; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <li id="${obj[i].id}">
            <img src="${obj[i].img}" alt="${obj[i].nameItem} image">
            <div class="info-product">
                <span class="tag">${obj[i].tag[0]}</span>
                <h3 class="product-title">${obj[i].nameItem}</h3>
                <p>${obj[i].description}</p>
                <span>R$ ${obj[i].value},00</span>
                <button class="buy-btn">Adicionar ao carrinho</button>
            </div>
        </li>
        `;
        ulProducts.append(card);
    }
    titleLengthIsValid();
}
renderProducts()

function titleLengthIsValid() {
    const productTitle = document.querySelectorAll(".product-title");
    for (let i = 0; i < productTitle.length; i++) {
        if (productTitle[i].textContent.length > 22) {
            productTitle[i].style.fontSize = "16px";
        }
    }
}

// search and render products / search functions
const input = document.querySelector("#search-product");
input.addEventListener('input', capitalizeInputWord);

function capitalizeInputWord() {
    renderSearchedProduct(this.value)
}

function renderSearchedProduct(str) {
    const obj = [];
    for (let i = 0; i < data.length; i++) {
        let nameProduct = data[i].nameItem.toLowerCase();
        if (nameProduct.includes(str.toLowerCase())) {
            obj.push(data[i]);
        }
    }
    renderProducts(obj);
    document.querySelector(".selected").classList.remove("selected");
    document.querySelector("a").classList.add("selected");
}

// add products to cart / cart functions
const productUl = document.querySelector(".products")
const cart = document.querySelector(".cart");
let countProduct = 0;
let sumPrice = 0;

productUl.addEventListener("click", sendProductToCart);
function sendProductToCart(event) {
    if (event.path[0].className === "buy-btn") {
        cart.appendChild(productsSelectedUl);

        extendCart("280");
        renderProductsAtCart(event.path[2].id);
        renderAmountAndPrice();
    }
}

const productsSelectedUl = document.createElement("ul");
productsSelectedUl.classList.add("products-selected");

function renderProductsAtCart(idProduct) {
    const elementId = parseInt(idProduct);

    if (!verifyDuplicateProducts(elementId)) {
        popUpWarning(true, "Item adicionado!");
    } else {
        popUpWarning(false, "Item já adicionado!");
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === elementId && !verifyDuplicateProducts(elementId)) {
            countProduct++;
            sumPrice += data[i].value;
            const li = document.createElement("li");
            li.setAttribute("id", `cart-${data[i].id}`)
            li.innerHTML = `
            <div class="product-img">
                <img src="${data[i].img}" alt="${data[i].nameItem} image">
            </div>
            <div class="product-info">
                <h3>${data[i].nameItem}</h3>
                <span>R$ ${data[i].value},00</span>
                <button class="remove-btn"><span>Remover produto</span></button>
            </div>
            `;
            productsSelectedUl.appendChild(li);
            animation(`#cart-${data[i].id}`, -270, "x");

            setTimeout(function () {
                animation(`#cart-${data[i].id}`, 0, "x");
            }, 1)
        }
    }
    cartWarningBox();
}

function verifyDuplicateProducts(id) {
    let idCart = document.querySelector(`#cart-${id}`);
    if (idCart == null) return false;
    return true;
}

const footerCart = document.createElement("div");
footerCart.classList.add("footer-cart");
function renderAmountAndPrice() {
    footerCart.innerHTML = `
    <div class="amount-box">
        <h4>Quantidade:</h4>
        <span id="count-product">${countProduct}</span>
    </div>
    <div class="total">
        <h4>Total:</h4>
        <span id="price-value">R$ ${sumPrice},00</span>
    </div>
    <div class="payment">
        <button><span>Comprar</span></button>
    </div>
    `;
    cart.appendChild(footerCart);
}

function popUpWarning(bool, warning) {
    const divPopUp = document.querySelector(".pop-up");

    if (bool) {
        divPopUp.innerHTML = `<span><img draggable="false" src="./img/check.png">${warning}</span>`;
        animation(".pop-up", 70, "y");
        setTimeout(function () {
            animation(".pop-up", -40, "y");
        }, 700)
    } else {
        divPopUp.innerHTML = `<span><img draggable="false" src="./img/error.png">${warning}</span>`;
        animation(".pop-up", 70, "y");
        setTimeout(function () {
            animation(".pop-up", -40, "y");
        }, 900)
    }
}

cart.addEventListener("click", removeCartProducts);
function removeCartProducts(event) {
    if (event.path[1].className === "remove-btn") {
        countProduct--;
        sumPrice -= parseInt(event.path[2].children[1].textContent.replace(",00", "").substr(3));
        document.querySelector("#count-product").innerHTML = countProduct;
        document.querySelector("#price-value").innerHTML = `R$ ${sumPrice},00`;

        animation(`#${event.path[3].id}`, -270, "x");
        setTimeout(function () {
            event.path[3].remove();
        }, 300)
        cartWarningBox();
    }
}

function cartWarningBox() {
    const warningBox = document.createElement("div");
    warningBox.classList.add("warning-cart");
    if (countProduct === 0) {
        document.querySelector(".footer-cart").remove();
        document.querySelector(".products-selected").remove();

        warningBox.innerHTML = "<h3>Carrinho vázio</h3><span>Adicione itens</span>";
        extendCart("220");
        cart.appendChild(warningBox);
    } 
    else if (countProduct === 1 && document.querySelector(".warning-cart")) {
        document.querySelector(".warning-cart").remove();
    }
}