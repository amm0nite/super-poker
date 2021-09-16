import BaseComponent from '../component.js';

export default class ChoiceCards extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div class="flex">
            </div>
        `);
    }

    setup() {
        this.addChoices();
        this.choiceButtons = this.querySelectorAll('button');

        for (let choiceButton of this.choiceButtons) {
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
    }

    addChoices() {
        const choicesDiv = this.querySelector('div');
        choicesDiv.innerHTML = '';

        let choices = [1,2,3,5,8,13,21,34,'?'];
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
        }
    }

    refresh(state) {
        for (let choiceButton of this.choiceButtons) {
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
