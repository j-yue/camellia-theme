document.addEventListener("DOMContentLoaded", (e) => {
  const leftArrow = document.querySelector(".quickview__arrow--left");
  const rightArrow = document.querySelector(".quickview__arrow--right");
  leftArrow.addEventListener("click", (e) => updateSelectedMedia(true));
  rightArrow.addEventListener("click", (e) => updateSelectedMedia(false));
  console.log("registered event listeners");
});

function updateSelectedMedia(goLeft) {
  const parent = document.querySelector(".quickview__slideshow");

  const thumbnails = document.querySelectorAll(".quickview__thumbnail");
  //update parent data attributes and get the new current index
  const newIndex = updateSlideshowIndexes(parent, goLeft);
  console.log(newIndex);
  const newCurrentImg = createNewImage(thumbnails[newIndex].dataset.html);
  updateSelectedThumbnail(thumbnails[newIndex]);
  parent.replaceChild(newCurrentImg, parent.children[0]);
}

function updateSlideshowIndexes(parent, goLeft) {
  const keys = ["slideshowCurrent", "slideshowLeft", "slideshowRight"];
  const divisor = parseInt(parent.dataset.slideshowLast) + 1;
  keys.forEach((key) => {
    const oldValue = parseInt(parent.dataset[key]);
    const newValue = goLeft
      ? normalizeIndex(oldValue - 1, divisor)
      : normalizeIndex(oldValue + 1, divisor);
    parent.dataset[key] = newValue;
  });
  return parseInt(parent.dataset.slideshowCurrent);
}

function normalizeIndex(index, divider) {
  return (index + divider) % divider;
}

function createNewImage(htmlString) {
  const newCurrentImg = document.createElement("div");
  newCurrentImg.classList.add("quickview__current-img-wrapper");
  newCurrentImg.innerHTML = htmlString;
  return newCurrentImg;
}

function updateSelectedThumbnail(thumbnail) {
  const thumbnailClass = "quickview__thumbnail--selected";
  document.querySelector(`.${thumbnailClass}`).classList.toggle(thumbnailClass);
  thumbnail.classList.add(thumbnailClass);
}

// used when variant with featured media selected
// hacky way - go about it like a left click happened by adding +1 offset to index and updating data attributes
function setSelectedMedia(position, divisor) {
  const parent = document.querySelector(".quickview__slideshow");
  const newValues = [
    { key: "slideshowCurrent", value: position },
    { key: "slideshowLeft", value: normalizeIndex(position - 1, divisor) },
    { key: "slideshowRight", value: normalizeIndex(position + 1, divisor) },
  ];
  newValues.forEach((pair) => (parent.dataset[pair.key] = pair.value));
  updateSelectedMedia(true);
}
