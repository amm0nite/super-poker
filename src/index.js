
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
            this.state.loadSettings();
            this.layout.switch('options', this.state);
        });

        document.addEventListener('disconnected', (e) => {
            this.disableTick();
            this.layout.switch('connecting');
        });

        document.addEventListener('enter', (e) => {
            this.state.room = e.variables.room;
            this.state.player = e.variables.player;
            this.state.saveSettings();

            this.client.selectChannel(e.variables.room);

            this.layout.switch('joining');
        });

        document.addEventListener('joined', (e) => {
            this.enableTick();
            this.client.hello(this.state.player);
            this.layout.switch('ingame', this.state);
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
            this.state.toggleShow(e.variables.show);
            this.client.reveal(this.state.player, this.state.show);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('reveal', (e) => {
            this.state.toggleShow(e.variables.show);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('tick', (e) => {
            this.state.othersCheck();
            this.client.ping(this.state.player);
            this.layout.refresh(this.state);
        });

        document.addEventListener('ping', (e) => {
            this.state.otherHello(e.variables);
        });
    }

    enableTick() {
        const tick = () => {
            const event = new Event('tick');
            document.dispatchEvent(event);
            this.tickTimeout = setTimeout(tick, 5000);
        };
        tick();
    }

    disableTick() {
        if (this.tickTimeout) {
            clearTimeout(this.tickTimeout);
        }
    }
}

const game = new Game();
game.main();
