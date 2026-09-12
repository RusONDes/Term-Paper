import { pinsData } from "./data.js";
import {
  boards,
  pinID,
  handlePinClick,
  handleDeleteBoard,
  handleAddPinToBoard,
} from "./storage.js";

const checkIcon = `
  <svg class="menu-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
  </svg>
`;

const pinsContainer = document.querySelector("#pins");
const searchInput = document.querySelector("#search");

const boardModal = document.getElementById("boardModal");
const closeBoardModalButton = document.getElementById("closeModal");
const boardsList = document.getElementById("boardsList");
const boardInput = document.getElementById("boardInput");
const createBoardButton = document.getElementById("createBoard");
let boardName;
//создаём объект структуры доски - возможно вынести из функции???
// const boardStructure = {
//   boardName,
//   listID: [], //сюда будут добавляться ID пинов для прорисовки
// };
// let bList = "";

function getBoardList() {
  boards.length = 0;
  for (let index = 0; index < localStorage.length; index++) {
    const elementKey = localStorage.key(index);

    boards.push(localStorage.key(index));
  }
  return boards;
}

console.log(getBoardList());

function updateBoardsList() {
   if (boards.length === 0) {
      boardsList.innerHTML = '<p class="empty">Пока досок нет</p>';
      return;
   }
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

    // const boardName = document.createElement("p");
    // const boardName = document.createElement("span");
    // boardName.textContent = `📌 ${name}`;
    // board.append(boardName);

    const deleteBoardButton = document.createElement("button");
    deleteBoardButton.className = "delete-item";
    deleteBoardButton.textContent = "✕";

    //переписать на отдельную функцию с .removeItem(key)
    deleteBoardButton.onclick = function () {
      const index = boards.indexOf(name);
      if (index !== -1) {
        boards.splice(index, 1);
        updateBoardsList();
      }
    };

      board.append(deleteBoardButton);
      boardsList.append(board);
   }
      board.append(deleteBoardButton);
      boardsList.append(board);
   }
}

// function createBoard() {
//   const name = boardInput.value.trim();
//   if (!name) {
//     alert("Введите название");
//     return;
//   }

//   boards.push(name);
//   boardInput.value = "";
//   boardInput.focus();
//   updateBoardsList();
// }

function createBoard() {
  getBoardList();

  boardName = boardInput.value.trim();
  // const boardName = boardInput.value.trim();
  if (!boardName) {
    alert("Пожалуйста, введите название доски!");
    return;
  }

  //проверяем существование ключа
  if (localStorage.getItem(boardName) !== null) {
    alert(`Доска с названием ${boardName} уже существует!`);
    boardInput.value = "";
    return;
  }

  // //создаём объект структуры доски - возможно вынести из функции???
  const currentBoardStructure = {
    boardName,
    listID: [], //сюда будут добавляться ID пинов для прорисовки
  };

  //сохраняем структуру в формате JSON
  localStorage.setItem(boardName, JSON.stringify(currentBoardStructure));

  alert(`Доска ${boardName} успешно создана!`);

  boards.push(boardName);
  boardInput.value = "";
  boardInput.focus();
  updateBoardsList();
}

function openBoardModal() {
   boardModal.showModal();
   updateBoardsList();
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

let currentReportCard = null;

nextButton.addEventListener('click', function () {
   currentReportCard.remove();
   reportForm.reset();
   nextButton.disabled = true;
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

function createHashtags(hashtags) {
   let result = "";
   let result = "";

   for (const hashtag of hashtags) {
      result += `<span>#${hashtag}</span>`;
   }
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
    console.log(`pinID: ${pinID}`);
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

fetch('https://6aa264b7ccb3db9689a66f26.mockapi.io/api/pins')
   .then((response) => {
      if (!response.ok) {
         throw new Error('Ошибка запроса. Статус ' + response.status);
      }

      return response.json();
   })

   .then((pins) => {
      showPins(pins);
   })
   .catch((error) => {
      console.error(error);
   });

fetch('https://6aa264b7ccb3db9689a66f26.mockapi.io/api/pins')
   .then((response) => {
      if (!response.ok) {
         throw new Error('Ошибка запроса. Статус ' + response.status);
      }

      return response.json();
   })

   .then((pins) => {
      showPins(pins);
   })
   .catch((error) => {
      console.error(error);
   });

function showPins(pins) {
   pinsContainer.innerHTML = "";

   for (const pin of pins) {
      pinsContainer.append(createPin(pin));
   }

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
showPins(pinsData);

const selectBoardBtn = document.getElementById("selectBoardBtn");
const boardDropdownList = document.getElementById("boardDropdownList");

selectBoardBtn.addEventListener("click", (event) => {
  event.stopPropagation(); 
  boardDropdownList.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  boardDropdownList.classList.add("hidden");
});

boardDropdownList.querySelectorAll(".board-dropdown__item").forEach((item) => {
  item.addEventListener("click", () => {
    console.log("Выбрана:", item.textContent);
    boardDropdownList.classList.add("hidden");
  });
});

// Назначаем эту функцию в качестве обработчика
pinsContainer.addEventListener("click", handlePinClick);

// Назначаем эту функцию в качестве обработчика
// Слушаем клик на всем списке досок
boardsList.addEventListener("click", function (e) {
  // Если кликнули на кнопку с классом .delete-item
  if (e.target.closest(".delete-item")) {
    handleDeleteBoard(e);
    return;
  }

  // Если кликнули на кнопку с классом .board-item
  if (e.target.closest(".board-item")) {
    handleAddPinToBoard(e);
  }
});
