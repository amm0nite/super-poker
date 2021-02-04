
import './style.css';
import _ from 'lodash';
import WebSocketClient from './radio.js';

function main() {
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
