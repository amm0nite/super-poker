import BaseComponent from '../component.js';

export default class ProgressBar extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <progress class="nes-progress is-primary margin-top-big margin-bottom-small" value="0" max="1"></progress>
        `);
    }

    setup() {
        this.progress = this.querySelector('progress');
    }

    refresh(state) {
        this.progress.value = state.howManyVoted();
        this.progress.max = state.getVotes().length;
    }
}
