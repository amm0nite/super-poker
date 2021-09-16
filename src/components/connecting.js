import BaseComponent from '../component.js';

export default class Connecting extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div>
                <p>Connecting...</p>
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
