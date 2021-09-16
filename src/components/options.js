import BaseComponent from '../component.js';

export default class Options extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <p>Options</p>
        `);
    }

    setup() {

    }

    refresh(state) {

    }

    getTitle() {
        return 'Options';
    }
}
