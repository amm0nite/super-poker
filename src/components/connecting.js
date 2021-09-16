import BaseComponent from '../component.js';

export default class Connecting extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div>
                <p>Loading...</p>
            </div>
        `);
    }

    setup() {

    }

    refresh(state) {

    }

    getTitle() {
        return 'Connecting';
    }
}
