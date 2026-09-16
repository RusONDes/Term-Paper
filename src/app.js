import {
  boardsStorageKey,
  getData,
  handlePinClick,
  handleDeleteBoard,
  handleAddPinToBoard,
} from "./storage.js";

let boardName;
let pinsData = [];
let boards = [];

// получаем список досок при загрузке страницы
let boardListLS = getData();

const checkIcon = `
  <svg class="menu-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
  </svg>
`;

// получаем данные из mockapi
fetch("https://6aa264b7ccb3db9689a66f26.mockapi.io/api/pins")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка запроса. Статус " + response.status);
    }

    return response.json();
  })

  .then((pins) => {
    pinsData = pins;
    searchPins();
  })
  .catch((error) => {
    console.error(error);
  });

// функция фильтрации и отображения пинов для выбранной доски
// вызывайте эту функцию, когда пользователь кликает на доску
function showPinsForBoard(targetBoard) {
  // проверяем, загрузились ли уже пины с сервера
  if (pinsData.length === 0) {
    return;
  }

  // фильтруем массив всех пинов, оставляя только те, чьи ID есть в targetBoard.listID
  const filteredPins = pinsData.filter((pin) => {
    return targetBoard.listID.map(String).includes(String(pin.id));
  });

  // отрисовываем ПИНы с выбранной доски
  showPins(filteredPins);
}

const pinsContainer = document.querySelector("#pins");
const searchInput = document.querySelector("#search");
const boardModal = document.getElementById("boardModal");
const closeBoardModalButton = document.getElementById("closeModal");
const boardsList = document.getElementById("boardsList");
const boardInput = document.getElementById("boardInput");
const createBoardButton = document.getElementById("createBoard");
const mainLogo = document.getElementById("mainLogo");

// перезагружаем страницу по клику на лого
mainLogo.addEventListener("click", () => {
  location.reload();
});

function getBoardList() {
  boardListLS = getData();

  boards = boardListLS.map((item) => item.boardName);

  return boards;
}

function updateBoardsList() {
  boards = [];
  boards = getBoardList();

  if (boards.length === 0) {
    boardsList.innerHTML = '<p class="empty">Пока досок нет</p>';
    return;
  }

  boardsList.innerHTML = "";

  for (const name of boards) {
    const board = document.createElement("div");
    board.className = "board-item";
    board.id = name;
    board.textContent = `📌 ${name}`;

    const deleteBoardButton = document.createElement("button");
    deleteBoardButton.className = "delete-item";
    deleteBoardButton.textContent = "✕";

    board.append(deleteBoardButton);
    boardsList.append(board);
  }
}

function createBoard() {
  getBoardList();

  boardName = boardInput.value.trim();
  if (!boardName) {
    alert("Пожалуйста, введите название доски!");
    return;
  }

  // проверяем существование ключа
  if (boards.includes(boardName)) {
    alert(`Доска с названием ${boardName} уже существует!`);
    boardInput.value = "";
    boardInput.focus();
    return;
  }

  // создаём объект структуры доски - возможно вынести из функции???
  const currentBoardStructure = {
    boardName,
    listID: [], //сюда будут добавляться ID пинов для прорисовки
  };

  boardListLS.push(currentBoardStructure);

  // сохраняем структуру в формате JSON
  localStorage.setItem(boardsStorageKey, JSON.stringify(boardListLS));

  alert(`Доска ${boardName} успешно создана!`);

  boards.push(boardName);
  boardInput.value = "";
  boardInput.focus();
  updateBoardsList();
}

function openBoardModal() {
  boardModal.showModal();
  updateBoardsList();
}

function closeBoardModal() {
  boardModal.close();
}

closeBoardModalButton.onclick = closeBoardModal;
boardModal.onclick = (event) =>
  event.target === boardModal && closeBoardModal();
createBoardButton.onclick = createBoard;

const cancelButton = document.getElementById("cancel");
const reportDialog = document.getElementById("reportDialog");
const claimScroll = document.querySelector(".claim-scroll");
const claimHeader = document.querySelector(".claim-header");
const claimActions = document.querySelector(".claim-actions");
const nextButton = document.getElementById("nextButton");
const reportForm = document.querySelector("#reportDialog form");

cancelButton.addEventListener("click", function () {
  reportDialog.close();
});

claimScroll.addEventListener("scroll", function () {
  const hasScrollOffset = claimScroll.scrollTop > 0;
  claimHeader.classList.toggle("shadow", hasScrollOffset);
  claimActions.classList.toggle("shadow", hasScrollOffset);
});

reportForm.addEventListener("change", function (event) {
  if (event.target.matches('input[type="radio"]')) {
    nextButton.disabled = false;
  }
});

reportDialog.addEventListener('close', function() {
  reportForm.reset();
  nextButton.disabled = true;
});

let currentReportCard = null;

nextButton.addEventListener('click', function () {
  const isReportConfirmed = confirm('Вы уверены, что хотите пожаловаться на пин?');

  if (isReportConfirmed === true) {
     currentReportCard.remove();

  }
});

function createHashtags(hashtags) {
  let result = "";

  for (const hashtag of hashtags) {
    result += `<span>#${hashtag}</span>`;
  }

  return result;
}

function createPin(pin) {
  const card = document.createElement("article");
  card.className = "pin";
  card.id = pin.id;
  card.innerHTML = `
    <div class="photo">
      <img src="${pin.image}" alt="${pin.title}">
      <button class="menuButton">•••</button>

      <div class="pin-menu" hidden>
        <button class="save-button">${checkIcon}<span>Добавить на доску</span></button>
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
  const saveButton = card.querySelector(".save-button");
  const hideButton = card.querySelector(".hide-button");
  const reportButton = card.querySelector(".report-button");

  menuButton.onclick = function () {
    const menuWasClosed = menu.hidden;
    closeMenus();
    menu.hidden = !menuWasClosed;
  };

  saveButton.onclick = function () {
    closeMenus();
    openBoardModal();
  };

  hideButton.onclick = function () {
    card.remove();
  };

  reportButton.onclick = function () {
    closeMenus();
    currentReportCard = card;
    reportDialog.showModal();
  };

  return card;
}

function showPins(pins) {
  pinsContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const pin of pins) {
    fragment.append(createPin(pin));
    // pinsContainer.append(createPin(pin));
  }
  pinsContainer.append(fragment);

  if (pins.length === 0) {
    pinsContainer.innerHTML = '<p class="empty-message">Ничего не найдено.</p>';
  }
}

function closeMenus() {
  for (const menu of document.querySelectorAll(".pin-menu")) {
    menu.hidden = true;
  }
}

function searchPins() {
  const searchText = searchInput.value.toLowerCase();
  const foundPins = [];

  for (const pin of pinsData) {
    const pinText =
      `${pin.title}${pin.description}${pin.author}${pin.hashtags.join(" ")}`.toLowerCase();
    if (pinText.includes(searchText)) {
      foundPins.push(pin);
    }
  }

  showPins(foundPins);
}

searchInput.oninput = searchPins;

// выпадающий список
const selectBoardBtn = document.getElementById("selectBoardBtn");
const boardDropdownList = document.getElementById("boardDropdownList");

// функция для заполнения списка досок в выпадающем списке
function updateDropdownList() {
  boards = [];
  boards = getBoardList();

  if (boards.length === 0) {
    boardDropdownList.innerHTML = '<p class="empty">Пока досок нет</p>';
    return;
  }

  // очищаем старый список
  boardDropdownList.innerHTML = "";

  // проходим циклом по каждой доске и создаем li
  boards.forEach((board) => {
    const li = document.createElement("li");
    li.className = "board-dropdown__item";

    // подставляем boardName из объекта (например: "Доска 2", "Доска 3")
    li.textContent = board;

    // записываем ID доски в специальный дата-атрибут data-id
    // li.dataset.id = board.listID;

    // добавляем созданный li внутрь ul
    boardDropdownList.appendChild(li);
  });

}

// вешаем обработчик событий на кнопку выпадающего списка
// selectBoardBtn.addEventListener("click", updateDropdownList());

// открываем выпадающий список
selectBoardBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  boardDropdownList.classList.toggle("hidden");
  updateDropdownList();
});

// вешаем обработчик события клика на весь список
boardDropdownList.addEventListener("click", (e) => {
  // находим ближайший элемент с классом board-dropdown__item, по которому кликнули
  const clickedItem = e.target.closest(".board-dropdown__item");

  // если кликнули мимо элемента списка (например, по пустому месту в ul), выходим
  if (!clickedItem) return;

  // получаем текст из кликнутого элемента li
  const boardName = clickedItem.textContent.trim();

  // ищем объект, у которого boardName равен id доски
  const targetBoard = getData().find((item) => item.boardName === boardName);

  // clickedItem.dataset.ID = targetBoard.listID;

  // проверяем, нашли ли мы доску и есть ли в её listID наш id
  if (!targetBoard) {
    alert(`Доска не найдена!`);
    return;
  }

  // получаем ID доски из дата-атрибута
  // const boardId = clickedItem.dataset.id;
  showPinsForBoard(targetBoard);
});

// скрываем выпадающий список по любому клику на странице
document.addEventListener("click", () => {
  boardDropdownList.classList.add("hidden");
});

// обрабатываем меню с досками
// назначаем функцию в качестве обработчика
pinsContainer.addEventListener("click", handlePinClick);

// назначаем функцию в качестве обработчика
// слушаем клик на всем списке досок
boardsList.addEventListener("click", function (e) {
  // если кликнули на кнопку с классом .delete-item
  if (e.target.closest(".delete-item")) {
    handleDeleteBoard(e);
    return;
  }

  // если кликнули на кнопку с классом .board-item
  if (e.target.closest(".board-item")) {
    handleAddPinToBoard(e);
  }
});
