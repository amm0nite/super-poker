
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

        if (data.type === 'room') {
            name = 'joined';
            vars = { room: data.room };
        }
        if (data.type === 'talk') {
            const message = data.message;
            name = message.type;
            vars = {
                id: data.author,
                name: message.player,
            };
            if (message.type === 'vote') {
                vars.vote = message.vote;
                vars.show = message.show;
            }
            if (message.type === 'reveal') {
                vars.show = message.show;
            }
        }

        if (!name) {
            return;
        }

        const event = new Event('rx-' + name);
        event.variables = vars;
        document.dispatchEvent(event);
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
        console.log('tx', data);
    }

    selectRoom(room) {
        this.send({ type: 'room', room });
    }

    vote(player, vote, show) {
        const message = { type: 'vote', player, vote, show };
        this.send({ type: 'talk', message });
    }

    hello(player) {
        const message = { type: 'hello', player };
        this.send({ type: 'talk', message });
    }

    reveal(player) {
        const message = { type: 'reveal', player };
        this.send({ type: 'talk', message });
    }

    reset(player) {
        const message = { type: 'reset', player };
        this.send({ type: 'talk', message });
    }

    ping(player) {
        const message = { type: 'ping', player };
        this.send({ type: 'talk', message });
    }
}
