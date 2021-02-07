export default class Layout {
    constructor() {
        this.views = [];
    }

    initBase() {
        const title = document.createElement('h1');
        title.textContent = 'Super Poker';
        title.className = 'margin-top-big';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'main-content';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'nes-container with-title';
        this.containerDiv = containerDiv;

        const containerTitle = document.createElement('p');
        containerTitle.className = 'title';
        containerTitle.textContent = 'Hello';
        this.containerTitle = containerTitle;

        containerDiv.append(containerTitle);

        mainDiv.append(title);
        mainDiv.append(containerDiv);

        document.body.append(mainDiv);
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

    initOptions() {
        const optionsForm = document.createElement('form');
        optionsForm.className = 'nes-field view hidden';
        this.optionsForm = optionsForm;
        this.views.push(optionsForm);

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

        this.containerDiv.append(optionsForm);
    }

    initSpinner() {
        const spinnerDiv = document.createElement('div');
        spinnerDiv.className = 'view hidden';
        this.spinnerDiv = spinnerDiv;
        this.views.push(spinnerDiv);

        const spinnerText = document.createElement('p');
        spinnerText.textContent = 'Loading...';

        spinnerDiv.append(spinnerText);

        this.containerDiv.append(spinnerDiv);
    }

    initIngame() {
        const ingameDiv = document.createElement('div');
        ingameDiv.className = 'view hidden';
        this.ingameDiv = ingameDiv;
        this.views.push(ingameDiv);

        // CHOICES
        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'flex margin-bottom-small';

        this.choiceButtons = [];
        let choices = [1,2,3,5,8,13,21,'?'];
        for (let i=0; i<choices.length; i++) {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'nes-btn block';
            choiceButton.textContent = choices[i];
            choicesDiv.append(choiceButton);
            this.choiceButtons.push(choiceButton);
        }

        // VOTES
        const votesDiv = document.createElement('div');
        votesDiv.className = 'nes-table-responsive';

        const votesTable = document.createElement('table');
        votesTable.className = 'nes-table is-bordered is-centered';
        votesTable.append(document.createElement('tbody'));
        const votesTableBody = document.createElement('tbody');
        votesTable.append(votesTableBody);
        this.votesTableBody = votesTableBody;

        votesDiv.append(votesTable);

        const voteProgress = document.createElement('progress');
        voteProgress.className = 'nes-progress is-primary margin-top-big';
        voteProgress.value = 0;
        voteProgress.max = 0;
        this.voteProgress = voteProgress;

        ingameDiv.append(choicesDiv);
        ingameDiv.append(votesDiv);
        ingameDiv.append(voteProgress);

        this.containerDiv.append(ingameDiv);
    }

    init() {
        this.initBase();
        this.initOptions();
        this.initSpinner();
        this.initIngame();
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

        for (let choiceButton of this.choiceButtons) {
            choiceButton.addEventListener('click', (e) => {
                const event = new Event('choice');
                event.variables = {
                    vote: choiceButton.textContent
                }
                document.dispatchEvent(event);
            });
        }
    }

    hideViews() {
        for (let elt of this.views) {
            if (!elt.classList.contains('hidden')) {
                elt.classList.add('hidden');
            }
        }
    }

    switch(view, options) {
        console.log('switching to', view);

        let title = 'view:' + view;
        this.hideViews();

        if (view === 'connecting') {
            title = 'Connecting';
            this.spinnerDiv.classList.remove('hidden');
        }
        if (view === 'joining') {
            title = 'Joining';
            this.spinnerDiv.classList.remove('hidden');
        }
        if (view === 'options') {
            title = 'Options';
            this.roomNameInput.value = options.room;
            this.playerNameInput.value = options.player;
            if (options.room) {
                this.optionsSubmit.textContent = 'Continue';
            }
            this.optionsForm.classList.remove('hidden');
            this.playerNameInput.focus();
        }
        if (view === 'ingame') {
            title = options.player + '@' + options.room;
            this.ingameDiv.classList.remove('hidden');
            for (let choiceButton of this.choiceButtons) {
                const value = choiceButton.textContent;
                if (choiceButton.classList.contains('is-success')) {
                    choiceButton.classList.remove('is-success');
                }
                if (options.vote == value) {
                    choiceButton.classList.add('is-success');
                }
            }
            this.votesTableBody.textContent = '';

            let hasVoted = 0;
            const votes = options.getVotes();
            for (let vote of votes) {
                let value = '?';
                if (vote.value) {
                    value = vote.value;
                    hasVoted++;
                }
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = vote.name;
                const valueCell = document.createElement('td');
                valueCell.textContent = value;
                row.append(nameCell, valueCell);
                this.votesTableBody.append(row);
            }
            this.voteProgress.value = hasVoted;
            this.voteProgress.max = votes.length;
        }

        this.containerTitle.textContent = title;
    }
}
