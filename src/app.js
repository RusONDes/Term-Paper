import { pinsData } from "./data.js";

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
const boards = [];

function updateBoardsList() {
   if (boards.length === 0) {
      boardsList.innerHTML = '<p class="empty">Пока досок нет</p>';
      return;
   }

   boardsList.innerHTML = "";

   for (const name of boards) {
      const board = document.createElement("div");
      board.className = "board-item";

      const boardName = document.createElement("span");
      boardName.textContent = `📌 ${name}`;
      board.append(boardName);

      const deleteBoardButton = document.createElement("button");
      deleteBoardButton.className = "delete-item";
      deleteBoardButton.textContent = "✕";
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
}

function createBoard() {
   const name = boardInput.value.trim();
   if (!name) {
      alert("Введите название");
      return;
   }

   boards.push(name);
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
boardModal.onclick = (event) => event.target === boardModal && closeBoardModal();
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
      <button>•••</button>

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

   for (const pin of pinsData) {
      const pinText = `${pin.title}${pin.description}${pin.author}${pin.hashtags.join(" ")}`.toLowerCase();
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
