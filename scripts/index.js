// 1 Сделать свой стиль и создать проект
// 2 Перебрать массив котов и отобразить их на странице
import { Card } from './card.js';
import { Popup } from './popup.js';
import { PopupImage } from './popup-image.js';
import { CatsInfo } from './cats-info.js';
import { api } from './api.js';
import { serializeForm, setDataRefrash } from './utils.js';

//при нажатии на плюсик(кнопка с классом add) вешаем слушатель, который будет открывать popup. Т.к popup это класс, нужно создать экземпляр этого класса и у него вызвать эту функцию
const btnOpenPopupForm = document.querySelector('#add');
//кнопка для открытия Cookie (псевдо регистрация)
const btnLoginOpenPopup = document.querySelector('#login');
//получайм доступ к форме popup
const formAddCat = document.querySelector('#popup-form-cat');
//получайм доступ к форме popup Cookie (псевдо регистрация)
const formLogin = document.querySelector('#popup-form-login');
//получаем доступ к карточке
const sectionCard = document.querySelector('.cards');

const popupAddCat = new Popup("popup-add-cats");
popupAddCat.setEventListener();

// Перебрать массив котов и отобразить их на странице
// for(let i=0; i< cats.length; i++){
//     const cat = new Card(cats[i], '#card-template')
//     const firstCat = cat.getElement();
//     sectionCard.append(firstCat);
// }

//создали экземпляр класса и повесили слушателя
const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();

const popupLoginEdit = new Popup('popup-login');
popupLoginEdit.setEventListener();

const popupCatInfo = new Popup('popup-cat-info');
popupCatInfo.setEventListener();

const popupImage = new PopupImage('popup-image');
popupImage.setEventListener();

const catsInfoInstance = new CatsInfo('#cats-info-template', handleEditCatInfo, handleDeleteCat);
const catsInfoElement = catsInfoInstance.getElement();

//добавляем кота в DOM -дерево
function createCat(dataCat) {
    const cardInstance = new Card(dataCat, '#card-template', handleCatImage, handleCatTitle);//handleLikeCat важен порядок передачи аргументов, так же как в конструкторе класса Card
    const newCardElement = cardInstance.getElement();
    sectionCard.append(newCardElement);
}

// Проверяет нужно ли взять котов из сервера (api) или Local Storage
function checkLocalStorage() {
    //в переменную сохраняем данные, хронящиеся в Local Storage с кот.далее будем работать ('cats' - ячейка памяти)
    const localData = JSON.parse(localStorage.getItem('cats'));
    //выносим в переменную время через которое мы должны обновить данные
    const getTimeExpires = localStorage.getItem('catsRefrash')
// если данных в Local Storage нет, то с базы нужно положить в  Local Storage, а если есть то берем их из Local Storage и их отрисовываем
// если Local Storage есть и у нее есть длина, то идем циклом по Local Storage и добавляем котов а также в приоритете (если текущее время меньше чем дата указанная при вхождении в базу данных)
    if (localData && localData.length && (new Date() < new Date(getTimeExpires))) {
        localData.forEach(catData => {
            createCat(catData);
            })
    //иначе мы идем на сервер и берем данные от туда
    } else {
        api.getAllCats().then((data) => {
            data.forEach(catData => {
            createCat(catData);
            })
         updateLocalStorage(data, {type: 'ALL_CATS'})
        })
     }
}
//хендлер для сбора данных из формы и отправки их на сервер
function handleFormAddCat(e) {
    //preventDefault() — метод события. Этот метод отменяет поведение браузера по умолчанию, которое происходит при обработке события (убрать перезагрузку страницы)
    e.preventDefault();

    //распарсиваем данные из formAddCat (приходят в виде DomNode) в массив, кот. затем переберем и из него сформируем объект 
    const elementsFromCat = [...formAddCat.elements];
    const dataFormCat = serializeForm(elementsFromCat)
    //если сервер ответил успехом, то мы положили данные в D0M-дерево
    api.addNewCat(dataFormCat).then(() => {
        createCat(dataFormCat);
        updateLocalStorage(dataFormCat, {type: 'ADD_CAT'});//чтобы при перезагрузке страницы данные нового кота сразу отображались
    })
     //закрываем мод. окно
    popupAddCat.close();
}

function handleFormLogin(e) {//собираем данные, пишем в куку(псевдо-авторизация)
    e.preventDefault();

    const loginData = [...formLogin.elements];
    const serializeData = serializeForm(loginData);

    //создаем куку
    Cookies.set('email', `email=${serializeData.email}`);
    // удаляем у кнопки (плюсик) класс и показываем ее 
    btnOpenPopupForm.classList.remove('visually-hidden');
    // добавляем кнопке (Войти) класс и скрываем ее
    btnLoginOpenPopup.classList.add('visually-hidden');

    formLogin.addEventListener('submit', handleFormLoginEdit);
    //закрываем куку
    popupLogin.close();
}

function handleFormLoginEdit(e) {//собираем данные, пишем в куку(псевдо-авторизация)
    e.preventDefault();

    const loginData = [...formLogin.elements];
    const serializeData = serializeForm(loginData);

    //создаем куку
    Cookies.set('emailEdit', `email=${serializeData.email}`);
   
    //закрываем куку
    popupLoginEdit.close();
}

function handleCatImage(dataCat) {
    popupImage.open(dataCat);
}

function handleCatTitle(cardInstance) {//хранится объект карточки со всеми данныеми
    catsInfoInstance.setData(cardInstance);//пробросим новые данные
    popupCatInfo.setContent(catsInfoElement);//пробросили элемент в контент открывшейся карточки 

    const isEdit= Cookies.get('emailEdit');
    if(isEdit) {
        popupCatInfo.open();//открывается окно и все данные от туда пробрасываются

    } else {
        popupLoginEdit.open();
    }
}

function handleDeleteCat(cardInstance) {

    api.deleteCatById(cardInstance.getId()).then(() => { //запрос к api к конкретной карточке по айди
        cardInstance.deleteView(); //вызываем метод удаления, удалим из дом дерева
        updateLocalStorage(cardInstance.getId(), {type: 'DELETE_CAT'}); //чистим локал стораж
        popupCatInfo.close(); //закрываем мод. окно
    })
}

function handleEditCatInfo(cardInstance, data) {
    const {age, description, name, id} = data;

    api.updateCatById(id, {age, description, name}).then(() => {

         // обновляем данные в карточки, которая отображается на странице
         cardInstance.setData(data);
         cardInstance.updateView();

         updateLocalStorage(data, {type: 'EDIT_CAT'});
         popupCatInfo.close(); 
    })
}

function updateLocalStorage(data, action) { // {type: 'ADD_CATS'} - функция обновления локал стоража
    //переменная, содержащая предыдущие данные хранящиеся в локал сториж
    const oldStorage = JSON.parse(localStorage.getItem('cats'));

    switch (action.type) {//добавить новых котов
        case 'ADD_CAT':
            oldStorage.push(data);//в старый массив добавили новых котов
            localStorage.setItem('cats', JSON.stringify(data)); //данные полученные от сервера (data) перезаписываем в Local Storage, где 'cats' - ключ
            return;
        case 'ALL_CATS'://взять всех котов
            localStorage.setItem('cats', JSON.stringify(data));
            setDataRefrash(5, 'catsRefrash');
            return;
        case 'DELETE_CAT':
            console.log('DELETE_CAT', data);
            const newStorage = oldStorage.filter(cat => cat.id !== data); //cat - это каждый элемент/метод фильтр создает новый массив: ищет каждого кода и если не будет совпадать с тем котом, который мы будем пробрасывать, то этот кот сюда не вернется
            localStorage.setItem('cats', JSON.stringify(newStorage)); //перезаписываем новым массив
            return;
        case 'EDIT_CAT'://редактирование котов
            const updateStorage = oldStorage.map(cat => cat.id === data.id ? data : cat);//map возвращает новый массив
            localStorage.setItem('cats', JSON.stringify(updateStorage));
            return;
        default:
            break;
    }
}

checkLocalStorage();
   
//по клику на кнопку (плюсик) откроется модальное окно
btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());
//по клику на кнопку вышаем слушатель по клику, мод.окно открывается
btnLoginOpenPopup.addEventListener('click', () => popupLogin.open());
//submit - обработчик отправки формы
formAddCat.addEventListener('submit', handleFormAddCat);
//повесили слушатели на форму, чтобы по submitу она отправлялась
formLogin.addEventListener('submit', handleFormLogin);

// is... - переменные в которых хранится булевый тип(да/нет) начинать с is/получили в переменную куку
const isAuth = Cookies.get('email');

// если этой кука нет (false), то нужно открыть popupLogin и дабавляя класс скрываем кнопку (плюсик)
if (!isAuth) {
    popupLogin.open();
    btnOpenPopupForm.classList.add('visually-hidden');
} else {
    btnOpenPopupForm.classList.add('visually-hidden');
}

// Cookies
// document.cookie = 'email=sber@sb.ru;samesite=strict;max-age=360'
//Cookies.set('cook', 'res');
//console.log(Cookies.get('cook'));
// Cookies.remove('cook');

// localStorage
// запись (ключ, значение)
// localStorage.setItem('name', 'Вася'); 
// получить значение по ключу
// console.log(localStorage.getItem('name'));
// переводим данные в строку методом JSON.stringify
// localStorage.setItem('tel', JSON.stringify({sass: '+79863576', mess: 'yydydydy'}))
// console.log(JSON.parse(localStorage.getItem('tel')));
// localStorage.removeItem('tel');
// localStorage.clear()