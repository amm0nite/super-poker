import BaseComponent from '../component.js';

export default class ActionButton extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <p class="text-align-center margin-top-big">
                <button class="nes-btn" action="none"></button>
            </p>
        `);
    }

    setup() {
        this.button = this.querySelector('button');

        this.button.addEventListener('click', (e) => {
            const action = this.button.getAttribute('action');
            const event = new Event('action-' + action);
            return document.dispatchEvent(event);
        });
    }

    refresh(state) {
        this.button.classList.remove('is-success');
        this.button.classList.remove('is-warning');

        if (state.someoneIsHiding()) {
            this.button.classList.add('is-success');
            this.button.setAttribute('action', 'reveal');
            this.button.textContent = 'Show cards';
        } else {
            if (state.howManyVoted() > 0) {
                this.button.classList.add('is-warning');
                this.button.setAttribute('action', 'reset');
                this.button.textContent = 'Reset';
            } else {
                this.button.setAttribute('action', 'none');
                this.button.textContent = 'Voting...';
            }
        }
    }
}
