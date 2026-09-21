const searchInput = document.getElementById("searchInput");
const items = document.querySelectorAll(".card, .track");

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  items.forEach((item) => {
    const text = item.dataset.search.toLowerCase();
    item.hidden = !text.includes(keyword);
  });
});
