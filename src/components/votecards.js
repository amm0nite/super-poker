import BaseComponent from '../component.js';

export default class VoteCards extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div class="flex margin-top-big">
            </div>
        `);
    }

    setup() {
        this.votesDiv = this.querySelector('div');
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

    refresh(state) {
        this.votesDiv.textContent = '';

        const votes = state.getVotes();
        for (let vote of votes) {
            const card = this.createVoterDiv(vote.name, vote.vote, vote.show);
            this.votesDiv.append(card);
        }
    }
}
