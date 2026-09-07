import { pinsData } from "./data.js";

const checkIcon = `
  <svg class="menu-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
  </svg>
`;

const pinsContainer = document.querySelector("#pins");
const searchInput = document.querySelector("#search");

// Создаем надписи с хештегами.
function createHashtags(hashtags) {
  let result = "";

  for (let hashtag of hashtags) {
    result = result + "<span>#" + hashtag + "</span>";
  }

  return result;
}

function createPin(pin) {
  const card = document.createElement("article");
  card.className = "pin";
  card.id = pin.id;
  card.innerHTML = `

    <div class="photo" >
      <img src="${pin.image}" alt="${pin.title}">
      <button>•••</button>

      <div class="pin-menu" hidden>
        <button class="save-button" >${checkIcon}<span>Добавить на доску</span></button>
        <button class="hide-button">⊘ <span>Скрыть пин</span></button>
        <button class="report-button">⚑ <span>Пожаловаться</span></button>
      </div>
    </div>

    <div class="pin-content">
      <h2>${pin.title}</h2>
      <p class="description">${pin.description}</p>
      <div class="hashtags">${createHashtags(pin.hashtags)}</div>
      <div class="pin-footer">
        <img class="avatar" src="${pin.avatar}" alt="Аватар автора ${pin.author}">
        <span class="author">${pin.author}</span>
      </div>
    </div>

  `;

  const menu = card.querySelector(".pin-menu");
  const menuButton = card.querySelector(".photo > button");
  const saveButton = card.querySelector('.save-button');
  const hideButton = card.querySelector('.hide-button');
  const reportButton = card.querySelector('.report-button');

  menuButton.onclick = function () {
    const menuWasClosed = menu.hidden;
    closeMenus();
    menu.hidden = !menuWasClosed;
  };

  saveButton.onclick = function () {
    const text = saveButton.querySelector("span");
    text.textContent = "Добавлено на доску";
    closeMenus();
  };

  hideButton.onclick = function () {
    card.remove();
  };

  reportButton.onclick = function () {
    const text = reportButton.querySelector("span");
    text.textContent = "Жалоба отправлена";
    closeMenus();
  };

  return card;
}

// Показываем карточки на странице.
function showPins(pins) {
  pinsContainer.innerHTML = "";

  for (let pin of pins) {
    const card = createPin(pin);
    pinsContainer.append(card);
  }

  if (pins.length === 0) {
    pinsContainer.innerHTML = '<p class="empty-message">Ничего не найдено.</p>';
  }
}

// Закрываем все открытые меню.
function closeMenus() {
  const menus = document.querySelectorAll(".pin-menu");

  for (let menu of menus) {
    menu.hidden = true;
  }
}

// Ищем карточки по введенному тексту.
function searchPins() {
  const searchText = searchInput.value.toLowerCase();
  const foundPins = [];

  for (let pin of pinsData) {
    let pinText = pin.title + pin.description + pin.author;
    pinText = pinText + pin.hashtags.join(" ");
    pinText = pinText.toLowerCase();

    if (pinText.includes(searchText)) {
      foundPins.push(pin);
    }
  }

  showPins(foundPins);
}

searchInput.oninput = searchPins;

showPins(pinsData);
