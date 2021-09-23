import BaseComponent from '../component.js';

export default class ChoiceCards extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div class="flex">
            </div>
        `);

        this.deck = '';
    }

    setup() {

    }

    addChoices() {
        const choicesDiv = this.querySelector('div');
        choicesDiv.innerHTML = '';

        let choices = this.deck.split(',').map((s) => s.trim());
        choices.push('?');
        choices.push(null);

        for (let i=0; i<choices.length; i++) {
            const value = choices[i];
            const choiceButton = document.createElement('button');
            choiceButton.className = 'nes-btn card choice-button';
            choiceButton.textContent = value;

            if (value === null) {
                choiceButton.classList.add('is-error');
                choiceButton.textContent = 'x';
            }

            choicesDiv.append(choiceButton);
            this.activateChoice(choiceButton);
        }
    }

    activateChoice(choiceButton) {
        choiceButton.addEventListener('click', (e) => {
            const event = new Event('choice');
            let vote = choiceButton.textContent;
            if (vote === 'x') {
                vote = null;
            }
            event.variables = { vote };
            document.dispatchEvent(event);
        });
    }

    refresh(state) {
        if (state.deck && state.deck !== this.deck) {
            this.deck = state.deck;
            this.addChoices();
        }

        const choiceButtons = this.querySelectorAll('button');
        for (let choiceButton of choiceButtons) {
            const value = choiceButton.textContent;
            if (choiceButton.classList.contains('is-success')) {
                choiceButton.classList.remove('is-success');
            }
            if (state.vote !== null && state.vote === value) {
                choiceButton.classList.add('is-success');
            }
        }
    }
}
