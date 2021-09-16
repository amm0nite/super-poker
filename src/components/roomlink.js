import BaseComponent from '../component.js';

export default class RoomLink extends BaseComponent {
    constructor() {
        super();

        this.room = null;

        this.setHtml(`<div class="text-align-center nes-pointer"></div>`);
    }

    setRoom(room) {
        this.room = room;
        const url = BASE_URL + '?room=' + encodeURIComponent(room);
        this.querySelector('div').innerText = url;
    }

    setup() {
        this.querySelector('div').addEventListener('click', () => {
            window.getSelection().selectAllChildren(this.roomLink);
        });
    }

    refresh(state) {
        if (state.room !== this.room) {
            this.setRoom(state.room);
        }
    }
}
