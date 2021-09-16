import BaseComponent from '../component.js';

export default class Options extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <form class="nes-field">
                <div class="nes-field">
                    <label for="your-name">Your name</label>
                    <input type="text" id="your-name" class="nes-input margin-bottom-small"></input>
                </div>
                <div class="nes-field">
                    <label for="room-name">Room name</label>
                    <input type="text" id="room-name" class="nes-input margin-bottom-small"></input>
                </div>
                <button type="submit" class="nes-btn is-primary">Create</button>
            </form>
        `);
    }

    setup() {
        this.optionsForm = this.querySelector('form');
        this.playerNameInput = this.querySelector('#your-name');
        this.roomNameInput = this.querySelector('#room-name');
        this.optionsSubmit = this.querySelector('button');


        this.roomNameInput.addEventListener('input', (e) => {
            this.dispatchInputEvent(e.target.value);
        });

        this.optionsForm.addEventListener('submit', (e) => {
            const room = this.roomNameInput.value;
            const player = this.playerNameInput.value;

            if (room != '' && player != '') {
                const event = new Event('options-enter');
                event.variables = { room, player };
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
        } else {
            this.optionsSubmit.textContent = 'Create';
        }
    }

    getTitle() {
        return 'Options';
    }
}
