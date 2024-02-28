
import "nes.css/css/nes.min.css";
import './style.css';

import State from "./state.js";
import WebSocketClient from './radio.js';

import SuperPoker from "./components/super";
import Connecting from "./components/connecting";
import Options from "./components/options";
import InGame from "./components/ingame";
import RoomLink from "./components/roomlink";
import ChoiceCards from "./components/choicecards";
import VoteCards from "./components/votecards";
import ActionButton from "./components/actionbutton";
import ProgressBar from "./components/progressbar";

class Game {
    constructor() {
        this.state = new State();
        this.client = new WebSocketClient();

        customElements.define('super-poker', SuperPoker);
        customElements.define('connect-ing', Connecting);
        customElements.define('opt-ions', Options);
        customElements.define('in-game', InGame);
        customElements.define('choice-cards', ChoiceCards);
        customElements.define('vote-cards', VoteCards);
        customElements.define('action-button', ActionButton);
        customElements.define('progress-bar', ProgressBar);
        customElements.define('room-link', RoomLink);
    }

    getMainComponent() {
        return document.querySelector('super-poker');
    }

    switch(name) {
        console.log('switching to', name);
        this.state.view = name;
        this.refresh();
    }

    refresh() {
        this.getMainComponent().refresh(this.state);
    }

    main() {

        const template = document.createElement('template');
        template.innerHTML = `<super-poker></super-poker>`;
        document.body.append(template.content);

        this.switch('connecting');
        this.client.connect();

        document.addEventListener('connected', (e) => {
            this.state.loadSettings();
            this.switch('options');
        });

        document.addEventListener('disconnected', (e) => {
            this.disableTick();
            this.switch('connecting');
        });

        document.addEventListener('options-input', (e) => {
            this.state.room = e.variables.room;
            this.client.checkRoom(e.variables.room);
        });

        document.addEventListener('rx-check', (e) => {
            this.state.exists = e.variables.exists;
            this.state.deck = e.variables.meta?.deck;
            this.refresh();
        });

        document.addEventListener('options-enter', (e) => {
            this.state.room = e.variables.room;
            this.state.player = e.variables.player;
            this.state.deck = e.variables.deck;
            this.state.saveSettings();

            const meta = { deck: e.variables.deck };
            this.client.selectRoom(e.variables.room, meta);

            this.switch('joining');
        });

        document.addEventListener('rx-joined', (e) => {
            this.state.deck = e.variables.meta?.deck;
            this.enableTick();

            this.client.hello(this.state.player);
            this.switch('ingame');
        });

        document.addEventListener('choice', (e) => {
            this.state.playerVote(e.variables.vote);
            this.client.vote(this.state.player, this.state.vote, false);
            this.switch('ingame');
        });

        document.addEventListener('rx-hello', (e) => {
            this.state.otherHello(e.variables);
            this.client.vote(this.state.player, this.state.vote, this.state.show);
            this.switch('ingame');
        });

        document.addEventListener('rx-vote', (e) => {
            this.state.otherVote(e.variables);
            this.switch('ingame');
        });

        document.addEventListener('action-reveal', (e) => {
            this.client.reveal(this.state.player);

            this.state.playerShow();
            this.client.vote(this.state.player, this.state.vote, true);
            this.switch('ingame');
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
            this.switch('ingame');
        });

        document.addEventListener('rx-reset', (e) => {
            const event = new Event('choice');
            event.variables = { vote: null };
            document.dispatchEvent(event);
        });

        document.addEventListener('tick', (e) => {
            this.state.othersCheck();
            this.client.ping(this.state.player);
            this.refresh();
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

async function loadConfig() {
    const res = await fetch('config.json');
    if (!res.ok) {
        return;
    }
    const config = await res.json();    
    if (config.BASE_URL) {
        BASE_URL = config.BASE_URL;
    }
    if (config.SERVER_URL) {
        SERVER_URL = config.SERVER_URL;
    }
}

await loadConfig();
const game = new Game();
game.main();
