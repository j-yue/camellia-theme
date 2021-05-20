document.addEventListener("DOMContentLoaded", (e) => {
  const dropdowns = document.querySelectorAll(".quickview__option-dropdown");
  dropdowns.forEach((dropdown) =>
    dropdown.addEventListener("change", (e) => {
      if (e.target.value) {
        const variant = getVariant();
        updatePrice(variant.price);
        //update media if variant has media
        const mediaPosition = variant.featured_media.position; //position is index +1
        console.log("trying to update to variant media");
        if (mediaPosition)
          setSelectedMedia(
            mediaPosition,
            Camellia.quickview.product.media.length
          );

        // udpdate max quantity availble
        updateQuantityRange(variant.id);
      }
    })
  );

  document
    .querySelector(".quantity__inputs-wrapper")
    .addEventListener("click", (e) => {
      const name = e.target.className;

      if (name.includes("decrement")) updateQuantity(-1);
      if (name.includes("increment")) updateQuantity(1);
    });

  //   const quantity = document.querySelector(".quantity");
  //   quantity.addEventListener("click", (e) => {
  //     const targetName = e.target.className;

  //     if (targetName.includes("decrement")) {
  //       console.log("trying to decrease");
  //     }
  //   });
});

function getVariant() {
  const dropdowns = document.querySelectorAll(".quickview__option-dropdown");
  const options = [...dropdowns].map((dropdown) => dropdown.value);
  const variants = Camellia.quickview.product.variants;
  const matches = variants.filter((variant) =>
    isMatch(options, variant.options)
  );
  return matches[0];
}

function isMatch(options, variantOptions) {
  let bool = true;
  options.map((option, index) => {
    if (option != variantOptions[index]) bool = false;
  });
  return bool;
}

function updatePrice(newPrice) {
  const convertedPrice = `$${(parseInt(newPrice) / 100).toFixed(2)}`;
  document.querySelector(".quickview__price").innerText = convertedPrice;
}

function updateQuantityRange(id) {
  const qty = Camellia.quickview.quantities[id];
  const changes = { min: 0, max: 0, value: 0 };

  if (qty > 0) {
    changes.min = 1;
    changes.max = qty;
    changes.value = 1;
  }

  const quantity = document.querySelector(".quantity__input");

  Object.entries(changes).forEach(([key, value]) =>
    quantity.setAttribute(key, value)
  );
}

// -1 (decrement) or 1(increment)
function updateQuantity(change) {
  const quantity = document.querySelector(".quantity__input");

  const [value, min, max] = [
    parseInt(quantity.value),
    parseInt(quantity.getAttribute("min")),
    parseInt(quantity.getAttribute("max")),
  ];

  console.log(typeof min);

  let newQuantity = value + change;

  if (change < 0 && newQuantity < min) newQuantity = value;
  if (change > 0 && newQuantity > max) newQuantity = value;

  quantity.setAttribute("value", newQuantity);
}
