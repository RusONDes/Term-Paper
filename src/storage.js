export const boards = [];
export let pinID;

// 1. Создаем отдельную функцию для обработки клика на menuButton
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
  console.log(`pinID: ${pinID}`);
}

//функция для добавления ПИНа на доску (по аналогии с handlePinClick)
export function handleAddPinToBoard(e) {
  // Ищем кнопку
  const boarditem = e.target.closest(".board-item");

  // Проверяем найденный id
  const boardName = boarditem.id;
  // pinID = parent.id;
  console.log(`boardName: ${boarditem.id}`);
  console.log(`pinID: ${pinID}`);

  const boardData = localStorage.getItem(boardName);

  if (!boardData) {
    alert(`Доска не найдена!`);
    return [];
  }

  try {
    const currentBoardData = JSON.parse(boardData);

    // Проверяем, существует ли в объекте массив listID. Если нет — создаем его.
    if (!currentBoardData.listID) {
      currentBoardData.listID = [];
    }

    //добавляем выбранный ПИН на выбранную доску
    currentBoardData.listID.push(pinID);
    console.log("Обновленная структура доски:", currentBoardData);

    //сохраняем структуру в формате JSON
    localStorage.setItem(boardName, JSON.stringify(currentBoardData));

    alert(`Пин успешно добавлен на доску!`);
  } catch (error) {
    console.error("Ошибка при парсинге JSON или сохранении:", error);
    return [];
  }
}

//функция для удаления доски (по аналогии с handlePinClick)
export function handleDeleteBoard(e) {
  // Ищем кнопку
  const deleteitem = e.target.closest(".delete-item");

  // Защита: если кликнули мимо или элемент не найден, выходим из функции
  if (!deleteitem) {
    console.error("Элемент .delete-item не найден");
    return;
  }

  //находим ближайшего родителя
  const parent = deleteitem.closest(".board-item");
  //не нашли родителя - выходим
  if (!parent) {
    return;
  }

  // Проверяем найденный id
  const boardName = parent.id;
  console.log(`boardName: ${parent.id}`);

  if (!localStorage.getItem(boardName)) {
    // if (!boardData) {
    alert(`Доска не найдена!`);
    return;
  }

  //удаляем найденного родителя
  parent.remove();

  localStorage.removeItem(boardName);
  alert(`Доска удалена!`);
}
