
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
            document.dispatchEvent(new Event('disconnected'));
            const wait = (Math.floor(Math.random() * 10) + 1) * 100;
            setTimeout(() => this.connect(), wait);
        };
    }

    handle(data) {
        if (!data.type) {
            return;
        }

        let name = null;
        let vars = {};

        console.log('rx', data);

        if (data.type === 'channel') {
            name = 'joined';
            vars = { room: data.channel };
        }
        if (data.type === 'talk') {
            const message = data.message;
            name = message.type;
            vars = {
                id: data.author,
                name: message.player,
            };
            if (message.type === 'vote') {
                vars.value = message.vote;
            }
            if (message.type === 'reveal') {
                vars.show = message.show;
            }
        }

        if (!name) {
            return;
        }

        const event = new Event(name);
        event.variables = vars;
        document.dispatchEvent(event);
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
        console.log('tx', data);
    }

    selectChannel(channel) {
        this.send({ type: 'channel', channel });
    }

    vote(player, vote) {
        const message = { type: 'vote', player, vote };
        this.send({ type: 'talk', message });
    }

    hello(player) {
        const message = { type: 'hello', player };
        this.send({ type: 'talk', message });
    }

    reveal(player, show) {
        const message = { type: 'reveal', player, show };
        this.send({ type: 'talk', message });
    }
}
