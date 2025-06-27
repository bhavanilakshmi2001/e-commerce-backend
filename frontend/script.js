// Backend URL

const API_URL = "http://localhost:8080";

// Login user
async function loginUser(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    });

    const text = await res.text();
    alert(text);
    if (res.ok) window.location.href = "products.html";
    return res.ok;
}

// Register user
async function registerUser(user, adminKey) {
    const res = await fetch(`${API_URL}/auth/register?adminKey=${adminKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: 'include'
    });
    const text = await res.text();
    alert(text);
    if (res.ok) window.location.href = "login.html";
    return res.ok;
}

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const { email, password } = e.target;
    loginUser(email.value, password.value)
        .then(success => {
            if (success)
                form.reset();
        });
});

document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const { name, email, password, adminKey } = e.target;
    registerUser({ name: name.value, email: email.value, password: password.value }, adminKey.value)
        .then(() => {
            form.reset();

        });
});

// Logout user
async function logout() {
    await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
    alert("Logged out.");
    window.location.href = "login.html";
}

// Load product list
// async function loadProducts() {
//     const userRes = await fetch(`${API_URL}/auth/currentUser`, { credentials: 'include' });
//     if (!userRes.ok) {
//         alert("You must log in first.");
//         window.location.href = "login.html";
//         return;
//     }

//     const user = await userRes.json();
//     const isAdmin = user.role?.toLowerCase() === "admin";

//     if (isAdmin && !document.getElementById("addProductBtn")) {
//         const addBtn = document.createElement("button");
//         addBtn.textContent = "Add Product";
//         addBtn.id = "addProductBtn";
//         addBtn.onclick = function () {
//             window.location.href = "form.html";
//         };
//         document.body.prepend(addBtn);
//     }

//     if (!isAdmin && !document.getElementById("viewCartBtn")) {
//         const cartBtn = document.createElement("button");
//         cartBtn.textContent = "View Cart";
//         cartBtn.id = "viewCartBtn";
//         cartBtn.onclick = function () {
//             window.location.href = "cart.html";
//         };
//         document.body.prepend(cartBtn);
//     }

//     const res = await fetch(`${API_URL}/products`, { credentials: 'include' });
//     const products = await res.json();
//     const list = document.getElementById("productList");
//     list.innerHTML = "";

//     products.forEach(function (p) {
//         const div = document.createElement("div");
//         div.className = "product-card";
//         div.innerHTML = `
//             <img src="${p.imageUrl}" alt="${p.name}" width="150" height="150" />
//             <h3>${p.name}</h3>
//             <p>${p.description}</p>
//             <p>Price: $${p.price}</p>
//             <p>Stock: ${p.quantity}</p>
//             <button onclick="window.location.href='productView.html?view=1&productId=${p.productId}'">View</button>
//             ${isAdmin ? `
//                 <button onclick="window.location.href='form.html?productId=${p.productId}'">Edit</button>
//                 <button onclick="deleteProduct(${p.productId})">Delete</button>
//             ` : `
//                 <button onclick="addToCart(${p.productId})">Add to Cart</button>
//             `}
//         `;
//         list.appendChild(div);
//     });
// }

async function loadProducts() {
    const userRes = await fetch(`${API_URL}/auth/currentUser`, { credentials: 'include' });
    if (!userRes.ok) {
        alert("You must log in first.");
        window.location.href = "login.html";
        return;
    }

    const user = await userRes.json();
    const isAdmin = user.role?.toLowerCase() === "admin";
    const actionButtonsDiv = document.getElementById("actionButtons");
    actionButtonsDiv.innerHTML = ""; // clear old buttons

    if (isAdmin) {
        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Product";
        addBtn.id = "addProductBtn";
        addBtn.onclick = () => window.location.href = "form.html";
        actionButtonsDiv.appendChild(addBtn);
    } else {
        const cartBtn = document.createElement("button");
        cartBtn.textContent = "View Cart";
        cartBtn.id = "viewCartBtn";
        cartBtn.onclick = () => window.location.href = "cart.html";
        actionButtonsDiv.appendChild(cartBtn);
    }

    const res = await fetch(`${API_URL}/products`, { credentials: 'include' });
    const products = await res.json();
    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
            <img src="${p.imageUrl}" alt="${p.name}" />
            <div class="product-content">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-description">${p.description}</p>
                 <p class="product-price">$${p.price.toFixed(2)}</p>
                 <p class="product-stock">Stock:${p.quantity}</p>
                 <div class="button-group">
                    <button class="view-btn" onclick="window.location.href='productView.html?view=1&productId=${p.productId}'">View</button>
                    ${isAdmin ? `
                        <button class="edit-btn" onclick="window.location.href='form.html?productId=${p.productId}'">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${p.productId})">Delete</button>
                    ` : `
                        <button class="add-cart-btn" onclick="addToCart(${p.productId})">Add to Cart</button>
                    `}
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}


// Add to cart
async function addToCart(productId) {
    const res = await fetch(`${API_URL}/cart/add/${productId}?quantity=1`, {
        method: "POST",
        credentials: 'include'
    });
    alert(await res.text());
}

// Delete product
async function deleteProduct(productId) {
    const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        credentials: 'include'
    });
    alert(await res.text());
    location.reload();
}

// Load cart
// async function loadCart() {
//     const res = await fetch(`${API_URL}/cart`, { credentials: 'include' });
//     const cart = await res.json();
//     const container = document.getElementById("cartItems");
//     container.innerHTML = "";

//     cart.forEach(function (item) {
//         const div = document.createElement("div");
//         div.className = "product-card";
//         div.innerHTML = `
//             <h3>${item.product.name}</h3>
//             <p>Qty:
//                 <button onclick="updateQuantity(${item.product.productId}, -1)">-</button>
//                 ${item.quantity}
//                 <button onclick="updateQuantity(${item.product.productId}, 1)">+</button>
//             </p>
//             <p>Total: $${item.totalPrice}</p>
//         `;
//         container.appendChild(div);
//     });

//     if (cart.length > 0) {
//         const buyBtn = document.createElement("button");
//         buyBtn.textContent = "Buy";
//         buyBtn.onclick = placeOrder;
//         container.appendChild(buyBtn);
//     }
// }

async function loadCart() {
    const res = await fetch(`${API_URL}/cart`, { credentials: 'include' });
    const cart = await res.json();
    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    cart.forEach(function (item) {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
           <img src="${item.product.imageUrl}" alt="${item.product.name}" width=150px />
            <h3>${item.product.name}</h3>
            <div class="product-controls">
                <button onclick="updateQuantity(${item.product.productId}, -1)">-</button>
                <div class="quantity-number">${item.quantity}</div>
                <button onclick="updateQuantity(${item.product.productId}, 1)">+</button>
              <div class="total-price">$${item.totalPrice.toFixed(2)}</div>
             </div>
        `;
        container.appendChild(div);
    });

    if (cart.length > 0) {
        const buyBtn = document.createElement("button");
        buyBtn.textContent = "Buy";
        buyBtn.onclick = placeOrder;
        container.appendChild(buyBtn);
    }
}


// Update cart item quantity
async function updateQuantity(productId, change) {
    const res = await fetch(`${API_URL}/cart/update/${productId}?change=${change}`, {
        method: "POST",
        credentials: 'include'
    });
    loadCart();
    const text = await res.text();
    alert(text);
}

// Place order
async function placeOrder() {
    const res = await fetch(`${API_URL}/orders/place`, {
        method: "POST",
        credentials: 'include'
    });

    const text = await res.text();
    alert(text);

    if (res.ok) {
        loadCart();
    }
}

// Load product into form for editing
function loadEditProductIfNeeded() {
    var params = new URLSearchParams(window.location.search);
    if (params.has("productId")) {
        var productId = params.get("productId");

        fetch(`${API_URL}/products/${productId}`, { credentials: 'include' })
            .then(function (res) { return res.json(); })
            .then(function (product) {
                document.getElementById("formTitle").innerText = "Edit Product";
                document.getElementById("productId").value = product.productId;
                document.getElementById("productImageUrl").value = product.imageUrl || "";
                document.getElementById("productName").value = product.name;
                document.getElementById("productDescription").value = product.description || "";
                document.getElementById("productPrice").value = product.price;
                document.getElementById("productQuantity").value = product.quantity;
            });
    } else {
        // Add mode
        document.getElementById("formTitle").innerText = "Add Product";
        document.getElementById("productForm").reset();
    }
}


// Show add form
function showAddForm() {
    document.getElementById("formTitle").innerText = "Add Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productFormContainer").style.display = "block";
}

document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var id = document.getElementById("productId").value;

    var product = {
        imageUrl: document.getElementById("productImageUrl").value,
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        price: parseFloat(document.getElementById("productPrice").value),
        quantity: parseInt(document.getElementById("productQuantity").value)
    };

    var method = id ? "PUT" : "POST";
    var url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(product)
    })
        .then(function (res) { return res.text(); })
        .then(function (message) {
            alert(message);
            window.location.href = "products.html";
        });
});


// Cancel form
function cancelForm() {
    document.getElementById("productFormContainer").style.display = "none";
}

// async function loadProductView() {
//     var params = new URLSearchParams(window.location.search);
//     if (!params.has("productId")) {
//         alert("Product ID missing.");
//         return;
//     }

//     var productId = params.get("productId");
//     var res = await fetch(`${API_URL}/products/${productId}`, { credentials: 'include' });

//     if (!res.ok) {
//         alert("Product not found.");
//         return;
//     }

//     var product = await res.json();
//     var div = document.getElementById("productDetails");
//     div.innerHTML = `
//         <img src="${product.imageUrl}" width="150" height="150" />
//         <h3>${product.name}</h3>
//         <p>${product.description}</p>
//         <p>Price: $${product.price}</p>
//         <p>Stock: ${product.quantity}</p>
//     `;
// }
async function loadProductView() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    if (!productId) return;

    const res = await fetch(`${API_URL}/products/${productId}`, { credentials: 'include' });
    const product = await res.json();

    const container = document.getElementById('productDetails');
    container.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" />
        <div class="product-info">
            <h3>${product.name}</h3>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.quantity}</p>
            <button class="btn-cart" onclick="addToCart(${product.productId})">Add to Cart</button>
        </div>
    `;
}


