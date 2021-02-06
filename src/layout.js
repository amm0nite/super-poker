export default class Layout {
    constructor() {
        this.elts = {};
    }

    initBase() {
        this.elts.title = document.createElement('h1');
        this.elts.title.textContent = 'Super Poker';
        this.elts.title.className = 'margin-top-big';

        this.elts.mainDiv = document.createElement('div');
        this.elts.mainDiv.className = 'main-content';

        this.elts.containerDiv = document.createElement('div');
        this.elts.containerDiv.className = 'nes-container with-title';

        this.elts.containerTitle = document.createElement('p');
        this.elts.containerTitle.className = 'title';
        this.elts.containerTitle.textContent = 'Hello';

        this.elts.mainDiv.append(this.elts.title);
        this.elts.mainDiv.append(this.elts.containerDiv);

        document.body.append(this.elts.mainDiv);
    }

    initCreate() {
        this.elts.createRoomDiv = document.createElement('div');
        this.elts.createRoomDiv.className = 'nes-field view hidden';

        const nameFieldId = 'name-field';
        this.elts.roomNameLabel = document.createElement('label');
        this.elts.roomNameLabel.htmlFor = nameFieldId;
        this.elts.roomNameLabel.textContent = 'Room name';
        this.elts.roomNameInput = document.createElement('input');
        this.elts.roomNameInput.type = 'text';
        this.elts.roomNameInput.id = nameFieldId;
        this.elts.roomNameInput.className = 'nes-input margin-bottom-small';
        this.elts.roomNameSubmit = document.createElement('button');
        this.elts.roomNameSubmit.type = 'button';
        this.elts.roomNameSubmit.className = 'nes-btn is-primary';
        this.elts.roomNameSubmit.textContent = 'Create';

        this.elts.createRoomDiv.append(this.elts.roomNameLabel);
        this.elts.createRoomDiv.append(this.elts.roomNameInput);
        this.elts.createRoomDiv.append(this.elts.roomNameSubmit);

        this.elts.containerDiv.append(this.elts.containerTitle);
        this.elts.containerDiv.append(this.elts.createRoomDiv);
    }

    initSpinner() {
        this.elts.spinnerDiv = document.createElement('div');
        this.elts.spinnerDiv.className = 'view hidden';

        this.elts.spinnerText = document.createElement('p');
        this.elts.spinnerText.textContent = 'Loading...';

        this.elts.spinnerDiv.append(this.elts.spinnerText);

        this.elts.containerDiv.append(this.elts.spinnerDiv);
    }

    initOptions() {
        this.elts.optionsDiv = document.createElement('div');
        this.elts.optionsDiv.className = 'nes-field view hidden';

        const nameFieldId = 'name-field';
        this.elts.playerNameLabel = document.createElement('label');
        this.elts.playerNameLabel.htmlFor = nameFieldId;
        this.elts.playerNameLabel.textContent = 'Options';
        this.elts.playerNameInput = document.createElement('input');
        this.elts.playerNameInput.type = 'text';
        this.elts.playerNameInput.id = nameFieldId;
        this.elts.playerNameInput.className = 'nes-input margin-bottom-small';
        this.elts.playerNameSubmit = document.createElement('button');
        this.elts.playerNameSubmit.type = 'button';
        this.elts.playerNameSubmit.className = 'nes-btn is-primary';
        this.elts.playerNameSubmit.textContent = 'Continue';

        this.elts.optionsDiv.append(this.elts.playerNameLabel);
        this.elts.optionsDiv.append(this.elts.playerNameInput);

        this.elts.containerDiv.append(this.elts.optionsDiv);
    }

    initIngame() {
        this.elts.ingameDiv = document.createElement('div');
        this.elts.ingameDiv.className = 'view hidden';

        this.elts.containerDiv.append(this.elts.ingameDiv);
    }

    init() {
        this.initBase();
        this.initCreate();
        this.initSpinner();
        this.initIngame();
    }

    activate() {
        this.elts.roomNameSubmit.addEventListener('click', (e) => {
            if (this.elts.roomNameInput.value != '') {
                const event = new Event('enter');
                event.variables = { room: this.elts.roomNameInput.value };
                document.dispatchEvent(event);
            }
        });
    }

    hideViews() {
        for (let elt of Object.values(this.elts)) {
            if (elt.classList.contains('view') && !elt.classList.contains('hidden')) {
                elt.classList.add('hidden');
            }
        }
    }

    switch(view, data) {
        console.log('switching to', view, data);

        let title = 'view:' + view;
        this.hideViews();

        if (view === 'connecting') {
            title = 'Connecting';
            this.elts.spinnerDiv.classList.remove('hidden');
        }
        if (view === 'joining') {
            title = 'Joining';
            this.elts.spinnerDiv.classList.remove('hidden');
        }
        if (view === 'create') {
            title = 'Create Room';
            this.elts.createRoomDiv.classList.remove('hidden');
        }
        if (view === 'ingame') {
            title = data.room;
            this.elts.ingameDiv.classList.remove('hidden');
        }

        this.elts.containerTitle.textContent = title;
    }
}
