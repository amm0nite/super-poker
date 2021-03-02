
export default class Ingame {
    constructor() {
        this.name = 'ingame';
    }

    init() {
        const ingameDiv = document.createElement('div');
        ingameDiv.className = 'view hidden';
        this.ingameDiv = ingameDiv;

        const choicesDiv = document.createElement('div');
        choicesDiv.className = 'flex';

        this.choiceButtons = [];
        let choices = [1,2,3,5,8,13,21,34,'?'];
        choices.push(null);

        for (let i=0; i<choices.length; i++) {
            const value = choices[i];
            const choiceButton = document.createElement('button');
            choiceButton.className = 'nes-btn card';
            choiceButton.textContent = value;

            if (value === null) {
                choiceButton.classList.add('is-error');
                choiceButton.textContent = 'x';
            }

            choicesDiv.append(choiceButton);
            this.choiceButtons.push(choiceButton);
        }

        const votesDiv = document.createElement('div');
        votesDiv.className = 'flex margin-top-big';
        this.votesDiv = votesDiv;

        const voteProgress = document.createElement('progress');
        voteProgress.className = 'nes-progress is-primary margin-top-big';
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

        return ingameDiv;
    }

    createVoterDiv(name, vote, show) {
        const voterDiv = document.createElement('div');

        const voterCard = document.createElement('button');
        voterCard.className = 'nes-btn card';

        if (vote && !show) {
            voterCard.classList.add('is-primary');
        }
        if (vote && show) {
            voterCard.textContent = vote;
        }

        const voterName = document.createElement('p');
        voterName.className = 'player-name';
        voterName.textContent = name;

        voterDiv.append(voterCard);
        voterDiv.append(voterName);

        return voterDiv;
    }

    activate() {
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

        this.actionButton.addEventListener('click', (e) => {
            const event = new Event('toggle');
            event.variables = { show: e.target.classList.contains('reveal') };
            document.dispatchEvent(event);
        });
    }

    update(options) {
        for (let choiceButton of this.choiceButtons) {
            const value = choiceButton.textContent;
            if (choiceButton.classList.contains('is-success')) {
                choiceButton.classList.remove('is-success');
            }
            if (options.vote !== null && options.vote === value) {
                choiceButton.classList.add('is-success');
            }
        }

        this.votesDiv.textContent = '';

        let hasVoted = 0;
        let someoneIsHiding = false;

        const votes = options.getVotes();
        for (let vote of votes) {
            if (vote.vote) {
                hasVoted++;
                if (!vote.show) {
                    someoneIsHiding = true;
                }
            }
            const card = this.createVoterDiv(vote.name, vote.vote, vote.show);
            this.votesDiv.append(card);
        }

        this.voteProgress.value = hasVoted;
        this.voteProgress.max = votes.length;

        if (someoneIsHiding) {
            this.actionButton.classList.add('is-success');
            this.actionButton.classList.add('reveal');
            this.actionButton.textContent = 'Show cards';
        } else {
            this.actionButton.classList.remove('is-success');
            this.actionButton.classList.remove('reveal');
            this.actionButton.textContent = (hasVoted > 0) ? 'Hide cards' : 'Voting...';
        }
    }

    getTitle(options) {
        return options.player + '@' + options.room;
    }

    hide() {
        if (!this.ingameDiv.classList.contains('hidden')) {
            this.ingameDiv.classList.add('hidden');
        }
    }

    show() {
        if (this.ingameDiv.classList.contains('hidden')) {
            this.ingameDiv.classList.remove('hidden');
        }
    }
}
