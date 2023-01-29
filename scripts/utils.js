// вынесем сюда функции, которые могут работать в других местах


export function serializeForm(elements) {//формирует данные из формы в объект для отправки на сервер
    const formData = {};
   
    elements.forEach(input => {
        // console.log(input.type); свойство по которому сделаем сортировку инпутов
        if (input.type === 'submit') return //если это кнопка, то выходим из этой итерации, кнопка нам не нужна

        if (input.type !== 'checkbox') {
                formData[input.name] = input.value;
        }
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked; //у checkbox поле value возвращает либо on/off, поэтому берем checked, кот.хранит булевый тип (true/false) включен или выключен
        }
    });
    return formData
}
// функция ставит интервал обновления данных в Local Storage
export function setDataRefrash(minutes, key) {//принимает из вне минуты и ключ
    //встроенная функция, new Date().getTime()//указываем время обновления данных 
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    //передаем в Local Storage ключ и значение(время обновления)
    localStorage.setItem(key, setTime);
}