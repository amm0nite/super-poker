
export default class State {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);

        this.room = urlParams.get('room');
        this.player = null;
        this.vote = null;
        this.show = false;
        this.exists = false;
        this.meta = {};

        this.others = [];
    }

    playerVote(vote) {
        this.vote = vote;
        if (this.show) {
            this.show = false;
        }
    }

    getOther(id) {
        return this.others.find((o) => o.id === id);
    }

    otherHello(vars) {
        let other = this.getOther(vars.id);
        if (!other) {
            other = {
                id: vars.id,
                name: vars.name,
                vote: null,
                show: false,
            };
            this.others.push(other);
        }
        other.last = new Date();
        return other;
    }

    otherPing(vars) {
        let other = this.getOther(vars.id);
        if (other) {
            other.last = new Date();
        }
    }

    othersCheck() {
        this.others = this.others.filter((o) => {
            const now = new Date();
            const elapsed = now.getTime() - o.last.getTime();
            return elapsed < (10 * 1000);
        });
    }

    otherVote(vars) {
        const other = this.otherHello(vars);
        other.vote = vars.vote;
        other.show = vars.show;
    }

    getVotes() {
        const votes = [{ name: this.player, vote: this.vote, show: this.show }];
        for (let other of this.others) {
            votes.push(other);
        }

        return votes;
    }

    playerShow() {
        this.show = true;
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
