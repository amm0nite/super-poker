
import "nes.css/css/nes.min.css";
import './style.css';

import _ from 'lodash';
import WebSocketClient from './radio.js';
import Layout from "./layout";

function main() {
    const layout = new Layout();
    layout.init();

    const client = new WebSocketClient();
    client.connect();

    document.addEventListener('connected', (e) => {
        client.selectChannel('room123');
    });

    document.addEventListener('joined', (e) => {
        console.log(e.type, e.variables);
    });
}

main();
