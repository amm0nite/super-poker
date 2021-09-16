import BaseComponent from '../component.js';

export default class InGame extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <p>InGame</p>
        `);
    }

    setup() {

    }

    refresh(state) {

    }

    getTitle() {
        return '$player@$room';
    }
}
