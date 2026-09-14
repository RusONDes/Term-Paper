// работа с LocalStorage

// ключ для localStorage
export const boardsStorageKey = "boards";

export const boardsLS = [];
export let pinID;

// функция для полученния данных из localSrorage
export function getData() {
  const boardsFromStorage = localStorage.getItem(boardsStorageKey);

  if (!boardsFromStorage) {
    console.log(`Parsing error: ключ не найден`);
    return [];
  }

  try {
    // console.log(JSON.parse(boardsFromStorage));
    return JSON.parse(boardsFromStorage);
  } catch (error) {
    console.log("Parsing error:", error);
    return [];
  }
}

// функция для записи данных в LocalStorage
export function setData(board) {
  localStorage.setItem(boardsStorageKey, JSON.stringify(board));
}

// функция для обработки клика по menuButton
export function handlePinClick(e) {
  // Ищем кнопку
  const menuButton = e.target.closest(".menuButton");
  // Не нашли кнопку - выходим
  if (!menuButton) {
    return;
  }

  // Находим ближайшего родителя
  const parent = menuButton.closest(".pin");
  // Не нашли родителя - выходим
  if (!parent) {
    return;
  }

  // Проверяем найденный id
  pinID = parent.id;
  // console.log(`pinID: ${pinID}`);
}

// функция для добавления ПИНа на доску (по аналогии с handlePinClick)
export function handleAddPinToBoard(e) {
  // ищем кнопку
  const boarditem = e.target.closest(".board-item");

  // проверяем найденный id
  const boardName = boarditem.id;
  // console.log(`boardName: ${boarditem.id}`);
  // console.log(`pinID: ${pinID}`);

  // получаем список досок при загрузке страницы
  const boardListLS = getData();
  // console.log(`boardListLS: ${boardListLS}`);
  // console.log("boardListLS:", boardListLS);

  // ищем объект, у которого boardName равен  выбранному boardName
  const targetBoard = boardListLS.find((item) => item.boardName === boardName);

  // проверяем, нашли ли мы доску и есть ли в её listID выбранный ПИН
  const hasValue = targetBoard ? targetBoard.listID.includes(pinID) : false;

  // console.log(hasValue); // true

  // проверяем существует выбранный ПИН на выбранной доске. Если да - выдаём alert и прерываем выполнение
  if (hasValue) {
    alert(`Пин уже существует на доске ${boardName}`);
    return;
  }

  // добавляем выбранный ПИН на выбранную доску (если ранее не нашли ПИН на доске)
  targetBoard.listID.push(pinID);
  // console.log("Обновленная структура доски:", targetBoard);
  // console.log(`Обновленная структура доски ${boardName}:", ${targetBoard}`);
  // СОХРАНЕНИЕ В LOCALSTORAGE:
  // передаем весь обновленный массив в вашу функцию setData
  localStorage.setItem(boardsStorageKey, JSON.stringify(boardListLS));

  alert(`Пин ${pinID} успешно добавлен на доску ${boardName}!`);
}

// функция для удаления доски (по аналогии с handlePinClick)
export function handleDeleteBoard(e) {
  // ищем кнопку
  const deleteitem = e.target.closest(".delete-item");

  // если кликнули мимо или элемент не найден, выходим из функции
  if (!deleteitem) {
    console.error("Элемент .delete-item не найден");
    return;
  }

  // находим ближайшего родителя
  const parent = deleteitem.closest(".board-item");
  // не нашли родителя - выходим
  if (!parent) {
    console.error("Родительский элемент .board-item не найден в DOM");
    return;
  }

  // проверяем найденный id
  const boardName = parent.id;
  // console.log(`boardName: ${parent.id}`);

  // получаем список досок при загрузке страницы
  const boardListLS = getData();

  // ищем объект, у которого boardName равен id доски
  const targetBoard = boardListLS.find((item) => item.boardName === boardName);

  // проверяем, нашли ли мы доску и есть ли в её listID наш id
  if (!targetBoard) {
    alert(`Доска не найдена!`);
    return;
  }

  // фильтруем массив, оставляя все доски, КРОМЕ удаляемой
  const updatedBoardsList = boardListLS.filter(
    (item) => item.boardName !== boardName,
  );

  // сохраняем в LS
  localStorage.setItem(boardsStorageKey, JSON.stringify(updatedBoardsList));

  // логируем и удаляем элемент из HTML
  // console.log("Удаляем из HTML элемент:", parent);
  parent.remove();

  alert(`Доска "${boardName}" успешно удалена!`);
}
