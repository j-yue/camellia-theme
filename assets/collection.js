// =====================================================
// initialize empty product total and tag count elements
// handle and update changes made to form
// handle form submit
// add event listeners to desktop and mobile filter forms
// register events via Event Delegator
// dependencies: EventDelegator and Shopify.CamelliaTheme
// =====================================================

EventDelegator.batchUpdateWatchlist([
  ["DOMContentLoaded", "collection__product-total", initializeProductTotal],
  ["DOMContentLoaded", "category__tag-count", initializeTagCounts],
  ["DOMContentLoaded", "filter__form", saveInitialFormState],
  ["click", "collection__filter-btn", toggleOpen],
  ["click", "collection__filter-close", toggleClose],
  ["change", "filter__form", (e) => updateFormUI(e)],
  [
    "submit",
    "filter__form",
    (e) => handleSubmit(e, Shopify.CamelliaTheme.collection.url),
  ],
]);

/**
 * Initialize empty elements (product total count and tag product counts)
 * Initialize handlers for form
 * @param {String} allProducts - Stringified JSON of list of collection's products given by {{collection.all_products | json}} from liquid
 * @param {String} desktopForm - Selector for desktop form
 * @param {String} mobileForm - Selector for mobile form
 * @param {String} collectionPath - Path of collection
 */
function initializeEverything(
  allProducts,
  desktopForm,
  mobileForm,
  collectionPath
) {
  initializeEmptyElements(allProducts);
  addFormHandlers(desktopForm, collectionPath);
  addFormHandlers(mobileForm, collectionPath);
  handleMobileFormToggle();
}

/**
 * Initialize product total
 */
function initializeProductTotal() {
  document.querySelector(".collection__product-total").innerText = `${
    document.querySelectorAll(".product-card").length
  } products`;
}

/**
 * For each tag, initialize the number of products containing that tag
 */
function initializeTagCounts() {
  const tagCounts = document.querySelectorAll(".category__tag-count");
  const allProducts = Shopify.CamelliaTheme.collection.products;

  tagCounts.forEach((tag) => {
    const matchingProducts = allProducts.filter((product) =>
      product.tags.includes(tag.dataset.tag)
    );
    tag.innerText = `(${matchingProducts.length})`;
  });
}

// =====================================================
// add handlers to form
// =====================================================
/**
 *
 * @param {String} formSelector -Selector for form
 * @param {String} collectionPath - Path of collection
 */
function addFormHandlers(formSelector, collectionPath) {
  const form = document.querySelector(formSelector);
  updateFormUI(form);
  handleSubmit(form, collectionPath);
}

// =====================================================
// Update fiter and sort form appearance when changes made
// =====================================================
/**
 * Whenever changes made to form, check to see if changes match initial selected inputs and update state
 * Disabled - initial and current selected input values match
 * Not disabled - initial and current select input values don't match
 * @param {Node} form - The form element
 */
function updateFormUI(e) {
  const form = e.path.filter((ancestor) => ancestor.tagName === "FORM")[0];
  const submitBtn = form.querySelector(".filter__submit");

  const newState = getState(form);
  const hasChanged = hasFormChanged(newState);

  hasChanged
    ? changeSubmitBtnState(submitBtn, "btn--disabled", "btn--default", false)
    : changeSubmitBtnState(submitBtn, "btn--default", "btn--disabled", true);
}

/**
 * Generate object containing the selected sort and tag inputs
 * @param {Node} form - Form element
 * @returns {Object} - Object containing the selected sort (Node) and selected tags (NodeList)
 */
function getState(form) {
  return {
    sort: form.querySelector(".category__radio:checked"),
    tags: form.querySelectorAll(".category__checkbox:checked"),
  };
}

function saveInitialFormState() {
  const form = document.querySelector(".filter__form");
  Shopify.CamelliaTheme.collection.initialFormState = getState(form);
}

/**
 * Check if form values have changed
 * @param {Object} newState - Selected sort and tags when form submitted
 * @returns {Boolean} - newState does not match initialState
 */
function hasFormChanged(newState) {
  const initialState = Shopify.CamelliaTheme.collection.initialFormState;

  if (initialState.sort.value !== newState.sort.value) return true;

  const [initialTags, newTags] = [initialState.tags, newState.tags];
  if (initialTags.length !== newTags.length) return true;

  for (let i = 0; i < initialTags.length; i++) {
    if (initialTags[i] !== newTags[i]) return true;
  }

  return false;
}

/**
 * Update submit btn appearance and state
 * @param {Node} submitBtn - Submit button element
 * @param {String} oldState - Class name matching old state
 * @param {String} newState - Class name matching new state
 * @param {Boolean} disabledState - Should submitBtn be disabled or not
 */
function changeSubmitBtnState(submitBtn, oldState, newState, disabledState) {
  submitBtn.classList.remove(oldState);
  submitBtn.classList.add(newState);
  submitBtn.disabled = disabledState;
}

// =====================================================
// Handle visibility of mobile filter form
// =====================================================
/**
 * Toggle visibility of mobile filter
 */
// function handleMobileFormToggle() {
//   toggleOpen();
//   toggleClose();
// }

/**
 * Toggle filter open
 */
function toggleOpen() {
  const filter = document.querySelector(".collection__filter-wrapper--mobile");
  filter.style.zIndex = 2;
  filter.style.visibility = "visible";
}

/**
 * Toggle filter closed
 */
function toggleClose() {
  const filter = document.querySelector(".collection__filter-wrapper--mobile");
  filter.style.zIndex = -1;
  filter.style.visibility = "hidden";
}

// =====================================================
// Handle form submit
// =====================================================
/**
 * Generate a path given the form's selected inputs
 * @param {Node} form - Form element
 * @param {String} collectionPath - Path of collection
 * @returns {String} - Path generated by the submitted selected inputs
 */
function generatePath(form, collectionPath) {
  const { sort, tags } = getState(form);
  const joinedTagHandles = [...tags].map((tag) => tag.dataset.handle).join("+");
  let result = collectionPath.concat("/", joinedTagHandles);
  return result.concat("?sort_by=", sort.value);
}

/**
 * Navigate user to path generated from selected inputs
 * @param {Event} e - Event
 * @param {String} collectionPath - Path of collection
 */
function handleSubmit(e, collectionPath) {
  e.preventDefault();
  window.location.href = generatePath(e.target, collectionPath);
}
