import BaseComponent from '../component.js';

export default class Options extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <form class="nes-field margin-bottom-small">
                <div class="nes-field">
                    <label for="your-name">Your name</label>
                    <input type="text" id="your-name" class="nes-input"></input>
                </div>
                <div class="nes-field margin-bottom-small">
                    <label for="room-name">Room name</label>
                    <input type="text" id="room-name" class="nes-input"></input>
                </div>
                <div class="nes-field margin-bottom-small">
                    <label for="card-deck">Card deck</label>
                    <div class="nes-select">
                        <select id="card-deck">
                            <option value="1,2,3,5,8,13,21,34" selected>Fibonacci small</option>
                            <option value="1,2,3,5,8,13,21,34,55,89,144">Fibonacci long</option>
                            <option value="XXS,XS,S,M,L,XL,XXL">Clothing size</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="nes-btn is-primary">Create</button>
            </form>
        `);
    }

    setup() {
        this.optionsForm = this.querySelector('form');
        this.playerNameInput = this.querySelector('#your-name');
        this.roomNameInput = this.querySelector('#room-name');
        this.cardDeckSelect = this.querySelector('#card-deck');
        this.optionsSubmit = this.querySelector('button');

        const cardDeckOptions = this.cardDeckSelect.querySelectorAll('option');
        for (const cardDeckOption of cardDeckOptions) {
            cardDeckOption.innerText = cardDeckOption.innerText + ` (${cardDeckOption.value})`;
        }

        this.roomNameInput.addEventListener('input', (e) => {
            this.dispatchInputEvent(e.target.value);
        });

        this.optionsForm.addEventListener('submit', (e) => {
            const room = this.roomNameInput.value;
            const player = this.playerNameInput.value;
            const deck = this.cardDeckSelect.value;

            if (room != '' && player != '') {
                const event = new Event('options-enter');
                event.variables = { room, player, deck };
                console.log(event.variables);
                document.dispatchEvent(event);
            }
            e.preventDefault();
        });
    }

    dispatchInputEvent(room) {
        const event = new Event('options-input');
        event.variables = { room };
        document.dispatchEvent(event);
    }

    refresh(state) {
        if (this.roomNameInput.value === '') {
            this.roomNameInput.value = state.room;
        }
        if (this.playerNameInput.value === '') {
            this.playerNameInput.value = state.player;
        }

        if (state.exists) {
            this.optionsSubmit.textContent = 'Join';
            this.cardDeckSelect.disabled = true;
            this.cardDeckSelect.value = state.deck;
        } else {
            this.optionsSubmit.textContent = 'Create';
            this.cardDeckSelect.disabled = false;
        }
    }

    getTitle() {
        return 'Options';
    }

    show() {
        if (this.classList.contains('hidden')) {
            this.classList.remove('hidden');
            this.dispatchInputEvent(this.roomNameInput.value);
            this.playerNameInput.focus();
        }
    }
}
