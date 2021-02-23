
import "nes.css/css/nes.min.css";
import './style.css';

import WebSocketClient from './radio.js';
import Layout from './layout.js';
import State from "./state.js";

class Game {
    constructor() {
        this.state = new State();
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
            this.layout.switch('options', this.state);
        });

        document.addEventListener('disconnected', (e) => {
            this.layout.switch('connecting');
        });

        document.addEventListener('enter', (e) => {
            this.state.room = e.variables.room;
            this.state.player = e.variables.player;

            this.client.selectChannel(e.variables.room);

            this.layout.switch('joining');
        });

        document.addEventListener('joined', (e) => {
            this.layout.switch('ingame', this.state);
            this.client.hello(this.state.player);
        });

        document.addEventListener('choice', (e) => {
            this.state.playerVote(e.variables.vote);
            this.client.vote(this.state.player, this.state.vote);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('hello', (e) => {
            this.state.otherHello(e.variables);
            this.client.vote(this.state.player, this.state.vote);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('vote', (e) => {
            this.state.otherVote(e.variables);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('toggle', (e) => {
            this.state.toggleShow(!this.state.show);
            this.client.reveal(this.state.player, this.state.show);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('reveal', (e) => {
            this.state.toggleShow(e.variables.show);
            this.layout.switch('ingame', this.state);
        });
    }
}

const game = new Game();
game.main();
