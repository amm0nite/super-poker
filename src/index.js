
import "nes.css/css/nes.min.css";
import './style.css';

import _ from 'lodash';
import WebSocketClient from './radio.js';
import Layout from "./layout";

class Game {
    constructor() {
        this.layout = new Layout();
        this.client = new WebSocketClient();

        this.connected = false;
        this.room = null;
    }

    main() {
        this.layout.init();
        this.layout.activate();

        this.client.connect();

        document.addEventListener('connected', (e) => {
            this.connected = true;
        });

        document.addEventListener('joined', (e) => {
            this.room = e.variables.room;
            console.log('room set', this.room);
        });

        document.addEventListener('enter', (e) => {
            if (this.connected) {
                this.client.selectChannel(e.variables.room);
            }
        });
    }
}

const game = new Game();
game.main();
