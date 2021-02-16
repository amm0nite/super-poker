
export default class Options {
    constructor() {
        this.name = 'options';
    }

    init() {
        const optionsForm = document.createElement('form');
        optionsForm.className = 'nes-field view hidden';
        this.optionsForm = optionsForm;

        const playerInput = this.createInput('your-name', 'Your name');
        this.playerNameInput = playerInput.input;

        const roomInput = this.createInput('room-name', 'Room name');
        this.roomNameInput = roomInput.input;

        const optionsSubmit = document.createElement('button');
        optionsSubmit.type = 'submit';
        optionsSubmit.className = 'nes-btn is-primary';
        optionsSubmit.textContent = 'Create';
        this.optionsSubmit = optionsSubmit;

        optionsForm.append(playerInput.field);
        optionsForm.append(roomInput.field);
        optionsForm.append(optionsSubmit);

        return optionsForm;
    }

    createInput(id, labelText) {
        const field = document.createElement('div');
        field.className = 'nes-field';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.className = 'nes-input margin-bottom-small';

        field.append(label);
        field.append(input);

        return { field, input };
    }

    activate() {
        this.optionsForm.addEventListener('submit', (e) => {
            if (this.roomNameInput.value != '' && this.playerNameInput.value != '') {
                const event = new Event('enter');
                event.variables = {
                    room: this.roomNameInput.value,
                    player: this.playerNameInput.value,
                };
                document.dispatchEvent(event);
            }
            e.preventDefault();
        });
    }

    update(options) {
        this.roomNameInput.value = options.room;
        this.playerNameInput.value = options.player;
        if (options.room) {
            this.optionsSubmit.textContent = 'Continue';
        }
        this.playerNameInput.focus();
    }

    getTitle(options) {
        return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }

    hide() {
        if (!this.optionsForm.classList.contains('hidden')) {
            this.optionsForm.classList.add('hidden');
        }
    }

    show() {
        if (this.optionsForm.classList.contains('hidden')) {
            this.optionsForm.classList.remove('hidden');
        }
    }
}
