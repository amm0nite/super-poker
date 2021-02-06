
import "nes.css/css/nes.min.css";
import './style.css';

import _ from 'lodash';
import WebSocketClient from './radio.js';
import Layout from "./layout";

class Options {
    constructor() {
        const urlParams = new URLSearchParams(window.location.search);

        this.room = urlParams.get('room');
        this.player = null;
    }
}

class Game {
    constructor() {
        this.options = new Options();
        this.layout = new Layout(this.options);
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
        });
    }
}

const game = new Game();
game.main();
