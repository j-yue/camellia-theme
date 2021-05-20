document.addEventListener("DOMContentLoaded", (e) => {
  const dropdowns = document.querySelectorAll(".quickview__option-dropdown");
  dropdowns.forEach((dropdown) =>
    dropdown.addEventListener("change", (e) => {
      const variant = getVariant();
      console.log(variant);
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
      updateMaxQuantity(variant.id);
    })
  );

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

function updateMaxQuantity(id) {
  document
    .querySelector(".quantity__input")
    .setAttribute("max", Camellia.quickview.quantities[id]);
}
