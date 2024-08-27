document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const ordersPanel = document.getElementById("ordersPanel");
  let orders = [];
  const toggleOrdersButton = document.getElementById("toggleOrdersButton");

  toggleOrdersButton.addEventListener("click", () => {
    ordersPanel.classList.toggle("hidden");
  });

  fetch("menu.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const menuItem = createMenuItem(item);
        menu.appendChild(menuItem);
      });
    });

  function createMenuItem(item) {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    menuItem.innerHTML = `
          <img src="${item.imgSrc}" alt="${item.name}">
          <h2>${item.name}</h2>
          
          <div class="quantityControls">
            <button class="decrementButton">-</button>
            <input type="number" value="0" min="0" class="quantityInput">
            <button class="incrementButton">+</button>
          </div>
          <button class="addToOrderButton">Add to Order</button>
        `;
    menuItem
      .querySelector(".addToOrderButton")
      .addEventListener("click", () => {
        const quantity = parseInt(
          menuItem.querySelector(".quantityInput").value
        );
        if (quantity > 0) {
          addToOrder(item.name, quantity);
        }
      });
    menuItem.querySelector(".incrementButton").addEventListener("click", () => {
      const quantityInput = menuItem.querySelector(".quantityInput");
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    menuItem.querySelector(".decrementButton").addEventListener("click", () => {
      const quantityInput = menuItem.querySelector(".quantityInput");
      const newQuantity = parseInt(quantityInput.value) - 1;
      quantityInput.value = newQuantity >= 0 ? newQuantity : 0;
    });
    return menuItem;
  }

  function addToOrder(name, quantity) {
    const existingOrderIndex = orders.findIndex((order) => order.name === name);
    if (existingOrderIndex !== -1) {
      orders[existingOrderIndex].quantity += quantity;
    } else {
      orders.push({ name, quantity });
    }
    renderOrders();
  }

  function renderOrders() {
    const ordersList = document.getElementById("ordersList");
    ordersPanel.classList.toggle("hidden");

    ordersList.innerHTML = "";
    orders.forEach((order, index) => {
      const listItem = document.createElement("li");
      const quantityControls = document.createElement("div");
      quantityControls.classList.add("quantityControls");

      const decrementButton = document.createElement("button");
      decrementButton.textContent = "-";
      decrementButton.addEventListener("click", () => {
        updateQuantity(index, order.quantity - 1);
      });
      quantityControls.appendChild(decrementButton);

      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.value = order.quantity;
      quantityInput.min = "0";
      quantityInput.addEventListener("change", (e) => {
        updateQuantity(index, parseInt(e.target.value));
      });
      quantityControls.appendChild(quantityInput);

      const incrementButton = document.createElement("button");
      incrementButton.textContent = "+";
      incrementButton.addEventListener("click", () => {
        updateQuantity(index, order.quantity + 1);
      });
      quantityControls.appendChild(incrementButton);

      listItem.textContent = `${order.name} จำนวน: `;
      listItem.appendChild(quantityControls);

      ordersList.appendChild(listItem);
    });
    if (orders.length > 0) {
      ordersPanel.classList.remove("hidden");
    }
  }
  orderButton.addEventListener("click", handleOrderButtonClick);

  function handleOrderButtonClick() {
    if (orders.length === 0) {
      alert("ไม่มีรายการอาหาร");
    } else {
      alert("สั่งอาหารเรียบร้อย! โปรดรอสักครู่");
    }
    ordersPanel.classList.toggle("hidden");
  }
  function updateQuantity(index, quantity) {
    if (quantity <= 0) {
      orders.splice(index, 1);
    } else {
      orders[index].quantity = quantity;
    }
    renderOrders();
  }
  document.getElementById("orderButton").addEventListener("click", () => {
    orders = [];
    renderOrders();
  });

  document.getElementById("clearButton").addEventListener("click", () => {
    orders = [];
    renderOrders();
  });
});
