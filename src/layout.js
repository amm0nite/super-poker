export default class Layout {
    constructor() {

    }

    init() {
        const title = document.createElement('h1');
        title.textContent = 'Super Poker';
        title.className = 'margin-top-big';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'main-content';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'nes-container with-title';

        const containerTitle = document.createElement('p');
        containerTitle.className = 'title';
        containerTitle.textContent = 'Create a room';

        const createRoomDiv = document.createElement('div');
        createRoomDiv.className = 'nes-field';

        const nameFieldId = 'name-field';
        const nameLabel = document.createElement('label');
        nameLabel.htmlFor = nameFieldId;
        nameLabel.textContent = 'Room name';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = nameFieldId;
        nameInput.className = 'nes-input margin-bottom-small';
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.className = 'nes-btn is-primary';
        submitButton.textContent = 'Create';

        createRoomDiv.append(nameLabel);
        createRoomDiv.append(nameInput);
        createRoomDiv.append(submitButton);

        containerDiv.append(containerTitle);
        containerDiv.append(createRoomDiv);

        mainDiv.append(title);
        mainDiv.append(containerDiv);

        document.body.append(mainDiv);
    }
}
