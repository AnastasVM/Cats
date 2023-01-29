export class CatsInfo {
    constructor(selectorTemplate, handleDeleteCat) {//, handleLikeCat, handleEditCatInfo
        this._selectorTemplate = selectorTemplate;
        this._handleDeleteCat = handleDeleteCat;//hendle - слушает

        // this.__handleLikeCat = handleLikeCat;//слушать лайки
        // this.__handleEditCatInfo = handleEditCatInfo;
       
        this._data = {};//есть пустой объект кот. потом будет наполняться
    }

    _getTemplate() { // возвращает содержимое шаблона в виде DOM узла
        return document.querySelector(this._selectorTemplate).content.children[0];
    
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true);//клонирование объекта

        this.buttonEdited = this.element.querySelector('.cat-info__edited');//редактировать
        // this.buttonSeved = this.element.querySelector('.cat-info__saved');//сохранить
        // this.buttonLiked = this.element.querySelector('.cat-info__favourite');
        this.buttonDeleted = this.element.querySelector('.cat-info__deleted');//удалить
        this.catImage = this.element.querySelector('.cat-info__image');

        // this.catImage = this.element.querySelector('.cat-info__id'); 
        // this.catImage = this.element.querySelector('.cat-info__name'); 
        // this.catImage = this.element.querySelector('.cat-info__rate'); 
        // this.catImage = this.element.querySelector('.cat-info__age-val');
        // this.catImage = this.element.querySelector('.cat-info__desc'); 

        this.setEventListener();
        return this.element;
    }

    setData(cardInstance) {//наполняет наш пустой объект this._data, получить данные в параметр и эти данные наполнить
        this._cardInstance = cardInstance;//положили ее в контекст, чтобы она была доступна в других методах
        this._data = this._cardInstance.getData();

        this.catImage.src = this._data.image;
    }

    setEventListener() {
        this.buttonDeleted.addEventListener('click', () => this._handleDeleteCat(this._cardInstance))
    }
}
