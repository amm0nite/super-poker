
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

        document.addEventListener('rx-joined', (e) => {
            this.enableTick();
            this.client.hello(this.state.player);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('choice', (e) => {
            this.state.playerVote(e.variables.vote);
            this.client.vote(this.state.player, this.state.vote, false);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('rx-hello', (e) => {
            this.state.otherHello(e.variables);
            this.client.vote(this.state.player, this.state.vote, this.state.show);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('rx-vote', (e) => {
            this.state.otherVote(e.variables);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('action-reveal', (e) => {
            this.client.reveal(this.state.player);

            this.state.playerShow();
            this.client.vote(this.state.player, this.state.vote, true);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('action-reset', (e) => {
            this.client.reset(this.state.player);

            const event = new Event('choice');
            event.variables = { vote: null };
            document.dispatchEvent(event);
        });

        document.addEventListener('rx-reveal', (e) => {
            this.state.playerShow();
            this.client.vote(this.state.player, this.state.vote, true);
            this.layout.switch('ingame', this.state);
        });

        document.addEventListener('rx-reset', (e) => {
            const event = new Event('choice');
            event.variables = { vote: null };
            document.dispatchEvent(event);
        });

        document.addEventListener('tick', (e) => {
            this.state.othersCheck();
            this.client.ping(this.state.player);
            this.layout.refresh(this.state);
        });

        document.addEventListener('rx-ping', (e) => {
            this.state.otherPing(e.variables);
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
