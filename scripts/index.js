// 1 Сделать свой стиль и создать проект
// 2 Перебрать массив котов и отобразить их на странице

//при нажатии на плюсик(кнопка с классом add) вешаем слушатель, который будет открывать popup. Т.к popup это класс, нужно создать экземпляр этого класса и у него вызвать эту функцию
const btnOpenPopupForm = document.querySelector('#add');

//получайм доступ к форме popup
const formAddCat = document.querySelector('#popup-form-cat');

//получаем доступ к карточке
const sectionCard = document.querySelector('.cards');

const popupAddCat = new Popup("popup-add-cats");
popupAddCat.setEventListener();

for(let i=0; i< cats.length; i++){
    const cat = new Card(cats[i], '#card-template')
    const firstCat = cat.getElement();
    sectionCard.append(firstCat);
}

//const cat = new Card(cats[0], '#card-template')
//const firstCat = cat.getElement()
//sectionCard.append(firstCat);


function handleFormAddCat(e) {
    //preventDefault() — метод события. Этот метод отменяет поведение браузера по умолчанию, которое происходит при обработке события (убрать перезагрузку страницы)
    e.preventDefault()
    //закрываем мод. окно
    popupAddCat.close();
}
//по клику на кнопку (плюсик) откроется модальное окно
btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());

//submit - обработчик отправки формы
formAddCat.addEventListener('submit', handleFormAddCat);