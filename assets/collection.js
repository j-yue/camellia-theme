// =====================================================
// initialize empty product total and tag count elements
// add event listeners to desktop and mobile filter forms
// =====================================================
function initializeEverything(
  allProducts,
  desktopForm,
  mobileForm,
  collectionPath
) {
  document.addEventListener("DOMContentLoaded", (e) => {
    initializeEmptyElements(allProducts);
    addFormHandlers(desktopForm, collectionPath);
    addFormHandlers(mobileForm, collectionPath);
    handleMobileFormToggle();
  });
}

// =====================================================
// initialize empty product total and tag count elements
// =====================================================
function initializeEmptyElements(allProducts) {
  initializeProductTotal();
  initializeTagCounts(allProducts);
}

function initializeElement(el, text) {
  el.innerText = text;
}

function initializeProductTotal() {
  initializeElement(
    document.querySelector(".collection__product-total"),
    `${document.querySelectorAll(".product-card").length} products`
  );
}

function initializeTagCounts(allProducts) {
  const tagCounts = document.querySelectorAll(".category__tag-count");

  tagCounts.forEach((tag) => {
    const matchingProducts = allProducts.filter((product) =>
      product.tags.includes(tag.dataset.tag)
    );
    initializeElement(tag, `(${matchingProducts.length})`);
  });
}

// =====================================================
// add handlers to form
// =====================================================
function addFormHandlers(formSelector, collectionPath) {
  const form = document.querySelector(formSelector);
  updateFormUI(form);
  handleSubmit(form, collectionPath);
}

// =====================================================
// Update fiter and sort form appearance when changes made
// =====================================================
// collection__filter-wrapper--desktop or mobile
function updateFormUI(form) {
  const submitBtn = form.querySelector(".filter__submit");
  const initialState = getState(form);

  form.addEventListener("change", (e) => {
    const newState = getState(form);
    const hasChanged = hasFormChanged(initialState, newState);
    hasChanged
      ? changeSubmitBtnState(submitBtn, "btn--disabled", "btn--default", false)
      : changeSubmitBtnState(submitBtn, "btn--default", "btn--disabled", true);
  });
}

function getState(form) {
  return {
    sort: form.querySelector(".category__radio:checked"),
    tags: form.querySelectorAll(".category__checkbox:checked"),
  };
}

function hasFormChanged(initialState, newState) {
  if (initialState.sort !== newState.sort) return true;

  const [initialTags, newTags] = [initialState.tags, newState.tags];
  if (initialTags.length !== newTags.length) return true;

  for (let i = 0; i < initialTags.length; i++) {
    if (initialTags[i] !== newTags[i]) return true;
  }

  return false;
}

function changeSubmitBtnState(submitBtn, oldState, newState, disabledState) {
  submitBtn.classList.remove(oldState);
  submitBtn.classList.add(newState);
  submitBtn.disabled = disabledState;
}

// =====================================================
// Handle visibility of mobile filter form
// =====================================================
function handleMobileFormToggle() {
  toggleOpen();
  toggleClose();
}

function toggleOpen() {
  const filterBtn = document.querySelector(".collection__filter-btn");
  filterBtn.addEventListener("click", () => {
    const filter = document.querySelector(
      ".collection__filter-wrapper--mobile"
    );
    filter.style.zIndex = 2;
    filter.style.visibility = "visible";
  });
}

function toggleClose() {
  const close = document.querySelector(".collection__filter-close");
  close.addEventListener("click", () => {
    const filter = document.querySelector(
      ".collection__filter-wrapper--mobile"
    );
    filter.style.zIndex = -1;
    filter.style.visibility = "hidden";
  });
}

// =====================================================
// Handle form submit
// =====================================================
function generatePath(form, collectionPath) {
  const { sort, tags } = getState(form);
  const joinedTagHandles = [...tags].map((tag) => tag.dataset.handle).join("+");
  let result = collectionPath.concat("/", joinedTagHandles);
  result = result.concat("?sort_by=", sort.value);
  return result;
}

function handleSubmit(form, collectionPath) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let result = generatePath(form, collectionPath);
    window.location.href = result;
  });
}
