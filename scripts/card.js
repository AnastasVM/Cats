// Класс для работы с карточкой
class Card {
    constructor(dataCat, selectorTemplate) {
        this.dataCat = dataCat;
        this.selectorTemplate = selectorTemplate;
    }

    _getTemplate() { // возвращает содержимое шаблона (<template>) в виде DOM узла/т.к. у temlate есть вложенность document.querySelector(this.selectorTemplate) возвращает фрагмент документа, который нужно распаковать(достать внутреннюю структуру), для этого используем свойство .content.querySelector('.card'), получаем DOM Node/скрытый метод, из вне его не используем
        return document.querySelector(this.selectorTemplate).content.querySelector('.card');
    
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true); // клонируем полученное содержимое из шаблона, чтобы не перезаписывать его много раз
        // получаем содержимое элемента
        this.cardTitle = this.element.querySelector('.card__name');
        this.cardImage = this.element.querySelector('.card__image');
        this.cardLike = this.element.querySelector('.card__like');
        
        this.cardTitle.textContent = this.dataCat.name;
        this.cardImage.src = this.dataCat.img_link;

        if(this.dataCat.favourite) {
            this.cardLike.classList.toggle("card__like_active");
        }


        return this.element
    }

    setElement() {

    }
    
}
