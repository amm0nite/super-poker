import BaseComponent from '../component.js';

export default class Spinner extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div>
                <p>Loading...</p>
            </div>
        `);
    }
}
