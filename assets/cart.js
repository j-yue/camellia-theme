document.addEventListener("DOMContentLoaded", (e) => {
  console.log("pink");

  const cartBtns = document.querySelectorAll(".product-card__btn--cart");

  cartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      addToCart(btn);
    });
  });
});

function addToCart(btn) {
  const formData = {
    items: [
      {
        id: btn.dataset.variantId,
        quantity: 1,
      },
    ],
  };

  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => console.log("Updated cart"))
    .then(() => getCartData())
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getCartData() {
  fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => console.log(data.items));
}
