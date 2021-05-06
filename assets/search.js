// =====================================================
// initialize event handlers for search bar
// =====================================================
initializeSearchBar();

/**
 * Add event handlers to search bar
 */
function initializeSearchBar() {
  document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector(".search__input");
    const results = document.querySelector(".search__results");
    const submit = document.querySelector(".search__submit");
    const clear = document.querySelector(".search__clear");
    const searchBar = document.querySelector(".search__wrapper");

    // Reset input value
    clear.addEventListener("click", () => {
      search.value = "";
    });

    // Hide search results and submit when user clicks outside search input
    document.body.addEventListener("click", (e) => {
      const path = e.path;
      if (!path.includes(searchBar)) udpateUI(null, results, submit);
    });

    // Go to results page
    submit.addEventListener("click", (e) => {
      goToSearchResults(search.value);
    });

    //Go to results page
    search.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) goToSearchResults(search.value);
    });

    // Fetch results and preview them
    // Update apperance based whether or not there are results
    search.addEventListener("input", (e) => {
      const query = e.target.value;

      udpateUI(query, results, submit, clear);

      const queryStr = `/search/suggest.json?q=${query}&resources[type]=product,page,collection&resources[limit]=4&resources[options][unavailable_products]=last`;

      fetch(queryStr)
        .then((response) => response.json())
        .then((suggestions) => {
          const {
            products,
            collections,
            pages,
          } = suggestions.resources.results;
          return { products, collections, pages };
        })
        .then((data) => {
          let html = "";

          Object.entries(data).forEach((type) => {
            // ignore types with no results
            if (type[1].length === 0) return;

            html += renderResult(type);
          });

          if (!html) {
            html = "No results";
            updateSubmitState(
              submit,
              true,
              "btn--default",
              "btn--disabled",
              `No results for '${query}'`
            );
          } else {
            updateSubmitState(
              submit,
              false,
              "btn--disabled",
              "btn--default",
              `Search all results for '${query}'`
            );
          }

          results.innerHTML = html;
        })
        .catch((err) => console.log(err));
    });
  });
}

/**
 * Hide search bar components if user search query is blank, otherwise show them
 * @param {String} query - User search input
 * @param {Node} results - Search results
 * @param {Node} submit - Submit button
 * @param {Clear} clear - Clera button (optional)
 */
function udpateUI(query, results, submit, clear = null) {
  const hiddenClasses = {
    results: "results--hidden",
    submit: "search__submit--hidden",
    clear: "search__clear--hidden",
  };

  const components = {
    results,
    submit,
    clear,
  };

  Object.entries(components).map(([type, el]) => {
    if (el) {
      const selector = hiddenClasses[type];
      query ? el.classList.remove(selector) : el.classList.add(selector);
    }
  });
}

/**
 * Change state and appearance of submit button
 * @param {Node} submit - Submit button
 * @param {Boolean} isDisabled - State of button
 * @param {String} removeClass - Class name of current button state
 * @param {String} addClass - Classname of new button state
 * @param {String} text - Submit button new inner text
 */
function updateSubmitState(submit, isDisabled, removeClass, addClass, text) {
  submit.disabled = isDisabled;
  submit.classList.remove(removeClass);
  submit.classList.add(addClass);
  submit.innerText = text;
}

/**
 * Convert results data to HTML
 * @param {Array} results - Array of size 2 containing the name of result type and an object representation of result
 * @returns {String} String representation of HTML converted from results data
 */
function renderResult(results) {
  const [type, data] = results;

  let html = `
    <section class="results__${type}">
        <h3 class="results__title">${type}</h3>
        <ul class="results__list">
    `;
  data.forEach((result) => {
    let img = "";
    if (type === "products") {
      const media = result.featured_image;
      img = `
        <img class="results__img" src=${media.url} alt=${media.alt}>
        `;
    }
    html += `
        <li class="results__list-item">
            <a class="link results__link" href=${result.url}>
                ${img}
                ${result.title}
            </a>
        </li>
        `;
  });
  html += "</ul></section>";
  return html;
}

/**
 * Redirect user to search results
 * @param {String} value - Search value
 */
function goToSearchResults(value) {
  if (value) window.location = `${window.location.origin}/search?q=${value}`;
}
