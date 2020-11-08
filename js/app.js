'use strict';


class LiveTimer extends HTMLElement {

    renderElement() {
        let date = new Date(this.getAttribute('datetime') || Date.now());
        this.date = date; // запишем к экземпляр

        this.innerHTML = new Intl.DateTimeFormat('default', {
            year: this.getAttribute('year') || undefined,
            month: this.getAttribute('month') || undefined,
            day: this.getAttribute('day') || undefined,
            hour: this.getAttribute('hour') || undefined,
            minute: this.getAttribute('minute') || undefined,
            second: this.getAttribute('second') || undefined,
            timeZoneName: this.getAttribute('time-zone-name') || undefined,
        }).format(date)
    }
  
    connectedCallback() {
        // браузер вызывает этот метод при добавлении элемента в документ
        // (может вызываться много раз, если элемент многократно добавляется/удаляется)
        if (!this.rendered) {
            this.renderElement();
            this.startTime();
            this.rendered = true;
        }
    }
  
    disconnectedCallback() {
        // браузер вызывает этот метод при удалении элемента из документа
        // (может вызываться много раз, если элемент многократно добавляется/удаляется)
        // При удалении элемента, останавливаем таймер, чтобы он больше не вызывал обработчик и не нагружал память
        clearInterval(this.setIntervalTimer);
    }
  
    static get observedAttributes() {
        /* массив имён атрибутов для отслеживания их изменений */
        return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // вызывается при изменении одного из перечисленных выше атрибутов
        this.renderElement();
    }
  
    startTime() {
        this.setIntervalTimer = setInterval(() => {
            this.setAttribute('datetime', new Date());
            this.generateTickEvent(); // генерируем событие тика каждый раз
        }, 1000);
    }
    stopTime() {
        clearInterval(this.setIntervalTimer);
    }

    generateTickEvent() {
        // Будем хранить кастомное событие в свойстве экземпляра, чтобы в дальнейшем можно было его использовать
        this.tickEvent = new CustomEvent('tick', {
            bubbles: true,
            cancelable: true,
            detail: {
                currentDate: this.date
            }
        });
    }

    adoptedCallback() {
      // вызывается, когда элемент перемещается в новый документ
      // (происходит в document.adoptNode, используется очень редко)
    }
  
    // у элемента могут быть ещё другие методы и свойства
}

/*
    Зарегистрировани свой элемент, который обслуживает наш класс, а также имеет функционал обычных HTML элементов
*/
customElements.define('live-timer', LiveTimer);

const timer1 = document.querySelector('#live-timer1');



const buttonShadowRoot = document.querySelector('.button-shadow-root');
// Сделали элементу теневой DOM
buttonShadowRoot.attachShadow({mode: 'open'});
/*
    buttonShadowRoot.shadowRoot это входная точка в наш Shadow DOM, это как document,
    только наш собственный, привязанный к имеющемуся элементу.
    Из него мы можем получать элементы и панипулировать ими используя все доступные 
    методы из обычного DOM
*/
// Ссылка на Shadow DOM вынесена в эту переменную
const buttonShadowRootOM = buttonShadowRoot.shadowRoot;
// Мы можем создать подэлементы внутри shadowRoot с помощью innerHTML или других методов DOM.
buttonShadowRootOM.innerHTML = `
                <div class="button-wrapper">
                    <div class="custom-button">Click</div>
                </div>
`;
// Можем получать из нашего окружения любые элементы которые в нём есть
let buttonShadow = buttonShadowRootOM.querySelector('.custom-button');


const tm = document.querySelector('.tmp1');
const btnActivateTemp = document.querySelector('.actTemp');
btnActivateTemp.addEventListener('click', () => {
    document.body.append(tm.content.cloneNode(true));
}, {once: true});
