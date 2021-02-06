
import "nes.css/css/nes.min.css";
import './style.css';

import _ from 'lodash';
import WebSocketClient from './radio.js';
import Layout from "./layout";

class Game {
    constructor() {
        this.layout = new Layout();
        this.client = new WebSocketClient();

        const urlParams = new URLSearchParams(window.location.search);
        const room = urlParams.get('room');
        this.target = room;
    }

    main() {
        this.layout.init();
        this.layout.activate();

        this.layout.switch('connecting');

        this.client.connect();

        document.addEventListener('connected', (e) => {
            this.connected = true;console.log(this.target);

            if (this.target) {
                const event = new Event('enter');
                event.variables = { room: this.target };
                document.dispatchEvent(event);
                return;
            }

            this.layout.switch('create');
        });

        document.addEventListener('disconnected', (e) => {
            this.reset();
            this.layout.switch('connecting');
        });

        document.addEventListener('joined', (e) => {
            const room = e.variables.room;
            this.layout.switch('ingame', { room });
        });

        document.addEventListener('enter', (e) => {
            this.client.selectChannel(e.variables.room);
            this.layout.switch('joining');
        });
    }
}

const game = new Game();
game.main();
