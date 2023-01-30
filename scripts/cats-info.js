import { printNumerals, generateRating } from "./utils.js";

export class CatsInfo {
    constructor(
        selectorTemplate,
        handleEditCatInfo,
        handleDeleteCat
        ) {//, handleLikeCat
        this._selectorTemplate = selectorTemplate;
        this.__handleEditCatInfo = handleEditCatInfo;
        this._handleDeleteCat = handleDeleteCat;//hendle - слушает
        // this.__handleLikeCat = handleLikeCat;//слушать лайки
        this._data = {};//есть пустой объект кот. потом будет наполняться
    }

    _getTemplate() { // возвращает содержимое шаблона в виде DOM узла
        return document.querySelector(this._selectorTemplate).content.children[0];
    
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true);//клонирование объекта

        this.buttonEdited = this.element.querySelector('.cat-info__edited');//редактировать
        this.buttonSaved = this.element.querySelector('.cat-info__saved');//сохранить
        this.buttonLiked = this.element.querySelector('.cat-info__favourite');
        this.buttonDeleted = this.element.querySelector('.cat-info__deleted');//удалить
        this.catImage = this.element.querySelector('.cat-info__image');

        this.catId = this.element.querySelector('.cat-info__id'); 
        this.catName = this.element.querySelector('.cat-info__name'); 
        this.catRate = this.element.querySelector('.cat-info__rate'); 
        this.catAge = this.element.querySelector('.cat-info__age-val');
        this.catAgeText = this.element.querySelector('.cat-info__age-text');
        this.catDesc = this.element.querySelector('.cat-info__desc'); 

        this.setEventListener();//внутри методов можно вызвать другие методы только через this
        return this.element;
    }

    setData(cardInstance) {//наполняет наш пустой объект this._data, получить данные в параметр и эти данные наполнить
        this._cardInstance = cardInstance;//положили ее в контекст, чтобы она была доступна в других методах
        this._data = this._cardInstance.getData();

        this.catImage.src = this._data.image;

        this.catDesc.textContent = this._data.description;
        this.catName.textContent = this._data.name;
        this.catAge.textContent = this._data.age;
        this.catId.textContent = this._data.id;

        this.catAgeText.textContent = printNumerals(this._data.age, ["год", "года", "лет"]);

        this.catRate.innerHTML = generateRating(this._data.rate);
    }
      
    _toggleContentEditable = () => {// Функция редактирования карточки

        this.buttonEdited.classList.toggle('cat-info__edited_hidden');//кнопка редактирования
        this.buttonSaved.classList.toggle('cat-info__saved_hidden');//кнопка сохранения

        // Свойство HTMLElement.isContentEditable только для чтения возвращает логическое значение, которое является true если содержимое элемента доступно для редактирования; в противном случае возвращается false .
        // Свойство HTMLElement.contentEditable элемента - признак, указывающий можно или нет редактировать содержимое элемента. Свойство может принимать следующие значения:
        // true или пустая строка - содержимое элемента доступно для редактирования.
        // false - содержимое элемента не доступно для редактирования.
        // inherit - наследуется значение данного свойства от родительского элемента.
        // contentEditable - атрибут, который м. добавить любому тегу и в значении истина можно редактировать этот элемент
        this.catDesc.contentEditable = !this.catDesc.isContentEditable;
        this.catName.contentEditable = !this.catName.isContentEditable;
        this.catAge.contentEditable = !this.catAge.isContentEditable;

    }

    _savedDataCats = () => { //обновить данные карточки, если они были изменены
        
        this._toggleContentEditable(); // что нужно делать при нажатии на кнопку сохранить

        // обновить данные, которые хранятся в textContent/перезаписать их после изменения
        this._data.name = this.catName.textContent;
        this._data.age = Number(this.catAge.textContent); //возраст возвращал число, а не строку
        this._data.description = this.catDesc.textContent;

        this.__handleEditCatInfo(this._cardInstance, this._data);
    
    }

    setEventListener() {
        this.buttonDeleted.addEventListener('click', () => this._handleDeleteCat(this._cardInstance));

        this.buttonEdited.addEventListener('click', this._toggleContentEditable);
        this.buttonSaved.addEventListener('click', this._savedDataCats);
    }
}
