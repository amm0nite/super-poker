
import "nes.css/css/nes.min.css";
import './style.css';

import WebSocketClient from './radio.js';
import Layout from './layout.js';

class Options {
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
}

class Game {
    constructor() {
        this.options = new Options();
        this.layout = new Layout();
        this.client = new WebSocketClient();
    }

    trigger(name, vars) {
        const event = new Event(name);
        event.variables = vars;
        document.dispatchEvent(event);
    }

    main() {
        document.body.append(this.layout.init());
        this.layout.activate();

        this.layout.switch('connecting');
        this.client.connect();

        document.addEventListener('connected', (e) => {
            this.layout.switch('options', this.options);
        });

        document.addEventListener('disconnected', (e) => {
            this.layout.switch('connecting');
        });

        document.addEventListener('enter', (e) => {
            this.options.room = e.variables.room;
            this.options.player = e.variables.player;

            this.client.selectChannel(e.variables.room);

            this.layout.switch('joining');
        });

        document.addEventListener('joined', (e) => {
            this.layout.switch('ingame', this.options);
            this.client.hello(this.options.player);
        });

        document.addEventListener('choice', (e) => {
            this.options.playerVote(e.variables.vote);
            this.client.vote(this.options.player, this.options.vote);
            this.layout.switch('ingame', this.options);
        });

        document.addEventListener('hello', (e) => {
            this.options.otherHello(e.variables);
            this.client.vote(this.options.player, this.options.vote);
            this.layout.switch('ingame', this.options);
        });

        document.addEventListener('vote', (e) => {
            this.options.otherVote(e.variables);
            this.layout.switch('ingame', this.options);
        });

        document.addEventListener('toggle', (e) => {
            this.options.toggleShow(!this.options.show);
            this.client.reveal(this.options.player, this.options.show);
            this.layout.switch('ingame', this.options);
        });

        document.addEventListener('reveal', (e) => {
            this.options.toggleShow(e.variables.show);
            this.layout.switch('ingame', this.options);
        });
    }
}

const game = new Game();
game.main();
