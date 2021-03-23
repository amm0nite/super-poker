
export default class State {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);

        this.room = urlParams.get('room');
        this.player = null;
        this.vote = null;
        this.show = false;

        this.others = [];
    }

    playerVote(vote) {
        this.vote = vote;
        if (this.show) {
            this.show = false;
        }
    }

    otherHello(vars) {
        let other = this.others.find((o) => o.id === vars.id);
        if (!other) {
            other = {
                id: vars.id,
                name: vars.name,
                vote: null,
                show: false,
            };
            this.others.push(other);
        }
        return other;
    }

    otherVote(vars) {
        const other = this.otherHello(vars);
        other.vote = vars.vote;
        if (other.show) {
            other.show = false;
        }
    }

    getVotes() {
        const votes = [{ name: this.player, vote: this.vote, show: this.show }];
        for (let other of this.others) {
            votes.push(other);
        }

        return votes;
    }

    toggleShow(show) {
        this.show = show;
        for (let other of this.others) {
            other.show = show;
        }
    }

    saveSettings() {
        window.localStorage.setItem('player', this.player);
        window.localStorage.setItem('room', this.room);
    }

    loadSettings() {
        const player = window.localStorage.getItem('player');
        const room = window.localStorage.getItem('room');

        if (!this.player) {
            this.player = player;
        }
        if (!this.room) {
            this.room = room;
        }
    }
}
