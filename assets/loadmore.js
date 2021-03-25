const ATTR_NAME = "data-next-page";

//converts text to html
function textToHTML(text) {
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}

//update btn attribute as user loads more products
function updateBtn(btn, maxPages) {
  const currentPage = parseInt(btn.getAttribute(ATTR_NAME));
  const nextPage = currentPage + 1;
  btn.setAttribute(ATTR_NAME, nextPage);
  if (nextPage > maxPages) btn.classList.add("collection__load-btn--hidden");
  return currentPage;
}

//add products from next page created by paginate tag
function appendProducts(btn, maxPages) {
  const QUERY = "?page=";
  const container = document.querySelector(".collection__products");

  const currentPage = updateBtn(btn, maxPages);
  fetch(QUERY + currentPage)
    .then((response) => response.text())
    .then((data) => textToHTML(data))
    .then((html) =>
      container.append(...html.querySelectorAll(".collection__product"))
    );
}
