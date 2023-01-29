export class Popup {
    constructor(className) {
        this._className = className;
        this.popup = document.querySelector(`.${className}`)
        // бандим контекст вызова this
        this._handleEscUp = this._handleEscUp.bind(this);
    }

    _handleEscUp(evt) {//если нажали кнопку esc, то мы вызовем метод close и закроем popup
        if (evt.key === 'Escape') {
            this.close()
        }
    }

    open() {//добавляем класса activ к popup и открываем его
        this.popup.classList.add('popup_active');
        //вешаем обработчик, когда открыто модальное окно и будет нажата кнопка esc, то вызовется функция _handleEscUp и окно закроется// т.к.контекст his забандили выше this.close() в условии отработает и вызовется именно close() этого экземпляра popup
        document.addEventListener('keyup', this._handleEscUp);
    }

    close() {//удаляем метод activ и закрываем popup
        this.popup.classList.remove('popup_active')
        //удаляем обработчик события, когда мод. окно закроется//keyup - нажатая клавиша была отпущена
        document.removeEventListener('keyup', this._handleEscUp)
    }

    setContent(contentNode) {
        const containerContent = this.popup.querySelector('.popup__content');//достаем див контент, куда затем будем передавать данные о коте
        containerContent.innerHTML = '';//чтобы при открытии на другом коте контейнер с контентом был чист
        containerContent.append(contentNode);//записывать в нее Node которая пришла
    }

    setEventListener(){
        this.popup.addEventListener('click', (evt) => {
            //event. target – это элемент, на котором произошло событие, наш клик по чему бы то ни было; classList.contains("class") – проверка наличия класса, возвращает true/false
            //Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору или null
            // если мы кликаем по элементу, содержащему this._className, то окно не закрывается, а иначе закрыть popup или если мы нажали на элемент с классом (.popup__close) - кнопку, тоже закрыть popup
            if (evt.target.classList.contains(this._className) || evt.target.closest('.popup__close')) {
                this.close();
            }
        })
    }
}