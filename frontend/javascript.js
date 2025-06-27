const API_URL = "http://localhost:8080";

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

async function registerUser(user, adminKey) {
    const res = await fetch(`${API_URL}/auth/register?adminKey=${adminKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: 'include'
    });
    const text = await res.text();
    alert(text);
    if (res.ok) window.location.href = "index.html";
    return res.ok;
}

document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const { email, password } = e.target;
    loginUser(email.value, password.value)
        .then(success => {
            if(success)
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

async function logout() {
    await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
    alert("Logged out.");
    window.location.href = "index.html";
}

async function loadProducts() {
    const userRes = await fetch(`${API_URL}/auth/currentUser`, { credentials: 'include' });
    if (!userRes.ok) {
        alert("You must log in first.");
        window.location.href = "index.html";
        return;
    }

    const user = await userRes.json();
    const isAdmin = user.role?.toLowerCase() === "admin";
 
    
    if (isAdmin && !document.getElementById("addProductBtn")) {
        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Product";
        addBtn.id = "addProductBtn";
        addBtn.onclick = () => {
            window.location.href = "form.html";
        };
        document.body.prepend(addBtn); 
    }

    
    if (!isAdmin && !document.getElementById("viewCartBtn")) {
        const cartBtn = document.createElement("button");
        cartBtn.textContent = "View Cart";
        cartBtn.id = "viewCartBtn";
        cartBtn.onclick = () => {
            window.location.href = "cart.html"; 
        };
        document.body.prepend(cartBtn);
    }

    const res = await fetch(`${API_URL}/products`, { credentials: 'include' });
    const products = await res.json();
    const list = document.getElementById("productList");
    list.innerHTML = ""; 

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
         <img src="${p.imageUrl}" alt="${p.name}" width="150" height="150" />
         <h3>${p.name}</h3>
           <p>${p.description}</p>
            <p>Price: $${p.price}</p>
            <p>Stock: ${p.quantity}</p>
           <button onclick="window.location.href='productView.html?view=1&productId=${p.productId}'">View</button>

            ${isAdmin ? `
              <button onclick="window.location.href='form.html?productId=${p.productId}'">Edit</button>
              <button onclick="deleteProduct(${p.productId})">Delete</button>
            ` : `
                <button onclick="addToCart(${p.productId})">Add to Cart</button>
            `}
        `;
        list.appendChild(div);
    });
}


async function addToCart(productId) {
    const res = await fetch(`${API_URL}/cart/add/${productId}?quantity=1`, {
        method: "POST",
        credentials: 'include'
    });
    alert(await res.text());
}

async function deleteProduct(productId) {
    const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        credentials: 'include'
    });
    alert(await res.text());
    location.reload();
}

async function loadCart() {
    const res = await fetch(`${API_URL}/cart`, { credentials: 'include' });
    const cart = await res.json();
    const container = document.getElementById("cartItems");
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "product-card";
        div.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.product.name}" width="150" height="150" />
            <h3>${item.product.name}</h3>
          <p>Qty:
                <button onclick="updateQuantity(${item.product.productId}, -1)">-</button>
                        ${item.quantity}
                <button onclick="updateQuantity(${item.product.productId}, 1)">+</button>
                    </p>
            <p> Total: $${item.totalPrice}</p>
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

async function updateQuantity(productId, change) {
    const res = await fetch(`${API_URL}/cart/update/${productId}?change=${change}`, {
        method: "POST",
        credentials: 'include'
    });
    loadCart();
    const text = await res.text();
    alert(text);

}

async function searchProducts() {
    const query = document.getElementById("searchInput").value.trim();

    const res = await fetch(`${BASE_URL}/products/search?query=${encodeURIComponent(query)}`, {
        credentials: 'include'
    });

    const products = await res.json();
    renderProducts(products);  // reuse existing function
}


function showAddForm() {
    document.getElementById("formTitle").innerText = "Add Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productFormContainer").style.display = "block";
}


function editProduct(productId) {
    fetch(`${API_URL}/products/${productId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(product => {
            document.getElementById("formTitle").innerText = "Edit Product";
            document.getElementById("productId").value = product.productId;
            document.getElementById("productImageUrl").value = product.imageUrl || "";
            document.getElementById("productName").value = product.name;
            document.getElementById("productDescription").value = product.description || "";
            document.getElementById("productPrice").value = product.price;
            document.getElementById("productQuantity").value = product.quantity;
            document.getElementById("productFormContainer").style.display = "block";
        });
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const product = {
        imageUrl: document.getElementById("productImageUrl").value,
        name: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        price: parseFloat(document.getElementById("productPrice").value),
        quantity: parseInt(document.getElementById("productQuantity").value)
    };

    let res;
    if (id) {
        // Edit
        res = await fetch(`${API_URL}/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
            credentials: 'include'
        });
    } else {
        // Add
        res = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
            credentials: 'include'
        });
    }

    alert(await res.text());
    document.getElementById("productFormContainer").style.display = "none";
    // loadProducts();
    if (res.ok) {
        window.location.href = "products.html";
    }

});

function cancelForm() {
    document.getElementById("productFormContainer").style.display = "none";
}

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
