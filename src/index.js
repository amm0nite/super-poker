
import "nes.css/css/nes.min.css";
import './style.css';

import WebSocketClient from './radio.js';
import Layout from "./layout";

class Options {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);

        this.room = urlParams.get('room');
        this.player = null;
        this.vote = null;
        this.votes = {};
    }

    getVotes() {
        const votes = [{ name: this.player, value: this.vote }];
        for (let vote of Object.values(this.votes)) {
            votes.push(vote);
        }

        return votes;
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
        this.layout.init();
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
            this.options.vote = e.variables.vote;
            this.client.vote(this.options.player, this.options.vote);
            this.layout.switch('ingame', this.options);
        });

        document.addEventListener('hello', (e) => {
            this.options.votes[e.variables.id] = {
                name: e.variables.name,
                value: null,
            };
            this.client.vote(this.options.player, this.options.vote);
            this.layout.switch('ingame', this.options);
        });

        document.addEventListener('vote', (e) => {
            this.options.votes[e.variables.id] = {
                name: e.variables.name,
                value: e.variables.value,
            };
            this.layout.switch('ingame', this.options);
        });
    }
}

const game = new Game();
game.main();
