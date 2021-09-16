import BaseComponent from '../component.js';

export default class InGame extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <choice-cards></choice-cards>
            <vote-cards></vote-cards>
            <action-button></action-button>
            <progress-bar></progress-bar>
            <room-link></room-link>
        `);
    }

    setup() {
        this.components = [
            this.querySelector('choice-cards'),
            this.querySelector('vote-cards'),
            this.querySelector('action-button'),
            this.querySelector('progress-bar'),
            this.querySelector('room-link'),
        ];
    }

    refresh(state) {
        for (const component of this.components) {
            component.refresh(state);
        }
    }

    getTitle() {
        return '$player@$room';
    }
}
