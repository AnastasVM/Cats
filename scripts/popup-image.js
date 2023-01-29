//нужно переопределить метод окрытия общего попапа (кроме открытия должен передать картинку)
import { Popup } from "./popup.js";

export class PopupImage extends Popup {//extends Popup - в нем есть все, что есть в классе попап, но дополнительно можно переопределить любой метод, у нас это open
    open(data) {
        const imagePopup = this.popup.querySelector('.popup__image');
        imagePopup.src = data.image;
        super.open();//ключевое слово super (способен вызвать любую функцию из родительского класса)
     }
}