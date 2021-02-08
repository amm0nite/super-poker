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

    createVoterDiv(name, value, show) {
        const voterDiv = document.createElement('div');

        const voterCard = document.createElement('button');
        voterCard.className = 'nes-btn card';

        if (value && !show) {
            voterCard.classList.add('is-primary');
        }
        if (value && show) {
            voterCard.textContent = value;
        }

        const voterName = document.createElement('p');
        voterName.className = 'player-name';
        voterName.textContent = name;

        voterDiv.append(voterCard);
        voterDiv.append(voterName);

        return voterDiv;
    }

    initIngame() {
        const ingameDiv = document.createElement('div');
        ingameDiv.className = 'view hidden';
        this.ingameDiv = ingameDiv;
        this.views.push(ingameDiv);

        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'flex';

        this.choiceButtons = [];
        let choices = [1,2,3,5,8,13,21,'?'];
        for (let i=0; i<choices.length; i++) {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'nes-btn card';
            choiceButton.textContent = choices[i];
            choicesDiv.append(choiceButton);
            this.choiceButtons.push(choiceButton);
        }

        const votesDiv = document.createElement('div');
        votesDiv.className = 'flex margin-top-big';
        this.votesDiv = votesDiv;

        const voteProgress = document.createElement('progress');
        voteProgress.className = 'nes-progress is-pattern margin-top-big';
        voteProgress.value = 0;
        voteProgress.max = 0;
        this.voteProgress = voteProgress;

        const actionDiv = document.createElement('p');
        actionDiv.className = 'text-align-center margin-top-big';
        const actionButton = document.createElement('button');
        actionButton.className = 'nes-btn';
        this.actionButton = actionButton;
        actionDiv.append(actionButton);

        ingameDiv.append(choicesDiv);
        ingameDiv.append(votesDiv);
        ingameDiv.append(actionDiv);
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

        this.actionButton.addEventListener('click', (e) => {
            const event = new Event('toggle');
            document.dispatchEvent(event);
        });
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
            this.refreshOptionsView(options);
            this.optionsForm.classList.remove('hidden');
        }
        if (view === 'ingame') {
            title = options.player + '@' + options.room;
            this.refreshIngameView(options);
            this.ingameDiv.classList.remove('hidden');
        }

        this.containerTitle.textContent = title;
    }

    refreshOptionsView(options) {
        this.roomNameInput.value = options.room;
        this.playerNameInput.value = options.player;
        if (options.room) {
            this.optionsSubmit.textContent = 'Continue';
        }
        this.playerNameInput.focus();
    }

    refreshIngameView(options) {
        for (let choiceButton of this.choiceButtons) {
            const value = choiceButton.textContent;
            if (choiceButton.classList.contains('is-success')) {
                choiceButton.classList.remove('is-success');
            }
            if (options.vote == value) {
                choiceButton.classList.add('is-success');
            }
        }

        this.votesDiv.textContent = '';

        let hasVoted = 0;
        const votes = options.getVotes();
        for (let vote of votes) {
            if (vote.value) {
                hasVoted++;
            }
            const card = this.createVoterDiv(vote.name, vote.value, options.show);
            this.votesDiv.append(card);
        }
        this.voteProgress.value = hasVoted;
        this.voteProgress.max = votes.length;

        if (!options.show) {
            this.actionButton.classList.add('is-success');
            this.actionButton.textContent = 'Show cards';
        } else {
            this.actionButton.classList.remove('is-success');
            this.actionButton.textContent = 'Hide cards';
        }
    }
}
