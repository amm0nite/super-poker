export default class BaseComponent extends HTMLElement {
    constructor() {
        super();
    }

    setHtml(html) {
        this.innerHTML = html;
    }

    connectedCallback() {
        this.setup();
    }

    setup() {

    }
}
