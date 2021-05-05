function udpateUI(query, results, submit, clear) {
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
    const selector = hiddenClasses[type];
    query ? el.classList.remove(selector) : el.classList.add(selector);
  });
}

function updateSubmitState(submit, isDisabled, removeClass, addClass, text) {
  submit.disabled = isDisabled;
  submit.classList.remove(removeClass);
  submit.classList.add(addClass);
  submit.innerText = text;
}

document.addEventListener("DOMContentLoaded", () => {
  const search = document.querySelector(".search__input");
  const results = document.querySelector(".search__results");
  const submit = document.querySelector(".search__submit");
  const clear = document.querySelector(".search__clear");

  clear.addEventListener("click", () => {
    search.value = "";
  });

  search.addEventListener("focusout", () => {
    udpateUI(null, results, submit, clear);
  });

  submit.addEventListener("click", () => {
    const url = `${window.location.origin}/search?q=${search.value}`;
    window.location = url;
  });

  search.addEventListener("input", (e) => {
    const query = e.target.value;

    udpateUI(query, results, submit, clear);

    const queryStr = `/search/suggest.json?q=${query}&resources[type]=product,page,collection&resources[limit]=4&resources[options][unavailable_products]=last`;

    fetch(queryStr)
      .then((response) => response.json())
      .then((suggestions) => {
        const { products, collections, pages } = suggestions.resources.results;
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
