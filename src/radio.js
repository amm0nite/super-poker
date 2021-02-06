
export default class WebSocketClient {
    constructor() {

    }

    async connect() {
        const serverURL = SERVER_URL;
        if (!serverURL) {
            throw new Error('Server URL is not defined');
        }

        this.socket = new WebSocket(serverURL);

        this.socket.onopen = (event) => {
            console.log('connected to websocket server');
            document.dispatchEvent(new Event('connected'));
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handle(data);
            } catch(e) {
                console.log(e);
            }
        }

        this.socket.onclose = () => {
            const wait = (Math.floor(Math.random() * 10) + 1) * 100;
            setTimeout(() => this.connect(), wait);
        };
    }

    handle(data) {
        let name = null;
        let vars = {};

        if (data.type === 'channel') {
            name = 'joined';
            vars = { room: data.channel };
        }
        if (data.type === 'talk') {
            const message = data.message;
            name = message.type;
            vars = message;
        }

        if (!name) {
            return;
        }

        const event = new Event(name);
        event.variables = vars;
        document.dispatchEvent(event);
    }

    selectChannel(channel) {
        this.socket.send(JSON.stringify({ type: 'channel', channel }));
    }

    send(message) {
        this.socket.send(JSON.stringify({ type: 'talk', message }));
    }
}
