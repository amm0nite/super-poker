export default class Layout {
    constructor() {
        this.elts = {};
    }

    init() {
        this.elts.title = document.createElement('h1');
        this.elts.title.textContent = 'Super Poker';
        this.elts.title.className = 'margin-top-big';

        this.elts.mainDiv = document.createElement('div');
        this.elts.mainDiv.className = 'main-content';

        this.elts.containerDiv = document.createElement('div');
        this.elts.containerDiv.className = 'nes-container with-title';

        this.elts.containerTitle = document.createElement('p');
        this.elts.containerTitle.className = 'title';
        this.elts.containerTitle.textContent = 'Create a room';

        this.elts.createRoomDiv = document.createElement('div');
        this.elts.createRoomDiv.className = 'nes-field';

        const nameFieldId = 'name-field';
        this.elts.nameLabel = document.createElement('label');
        this.elts.nameLabel.htmlFor = nameFieldId;
        this.elts.nameLabel.textContent = 'Room name';
        this.elts.nameInput = document.createElement('input');
        this.elts.nameInput.type = 'text';
        this.elts.nameInput.id = nameFieldId;
        this.elts.nameInput.className = 'nes-input margin-bottom-small';
        this.elts.submitButton = document.createElement('button');
        this.elts.submitButton.type = 'button';
        this.elts.submitButton.className = 'nes-btn is-primary';
        this.elts.submitButton.textContent = 'Create';

        this.elts.createRoomDiv.append(this.elts.nameLabel);
        this.elts.createRoomDiv.append(this.elts.nameInput);
        this.elts.createRoomDiv.append(this.elts.submitButton);

        this.elts.containerDiv.append(this.elts.containerTitle);
        this.elts.containerDiv.append(this.elts.createRoomDiv);

        this.elts.mainDiv.append(this.elts.title);
        this.elts.mainDiv.append(this.elts.containerDiv);

        document.body.append(this.elts.mainDiv);
    }

    activate() {
        this.elts.submitButton.addEventListener('click', (e) => {
            if (this.elts.nameInput.value != '') {
                const event = new Event('enter');
                event.variables = { room: this.elts.nameInput.value };
                document.dispatchEvent(event);
            }
        });
    }
}
