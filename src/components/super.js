import BaseComponent from '../component.js';
import pack from '../../package.json';

export default class SuperPoker extends BaseComponent {
    constructor() {
        super();

        this.setHtml(`
            <div class="main-content">
                <h1 class="margin-top-big">Super Poker</h1>
                <p>Minimalist planning poker</p>
                <div class="nes-container with-title margin-top-big">
                    <p class="title">Hello</p>
                    <connect-ing></connect-ing>
                    <opt-ions></opt-ions>
                    <in-game></in-game>
                </div>
                <p class="text-align-center margin-top-big">
                    <a href="${pack.homepage}">github</a> - <a href="https://twitter.com/amm0nite">@amm0nite</a>
                </p>
            </div>
        `);
    }

    setup() {
        this.components = {
            connecting: this.querySelector('connect-ing'),
            options: this.querySelector('opt-ions'),
            ingame: this.querySelector('in-game'),
        };
    }

    refresh(state) {
        for (const [name, component] of Object.entries(this.components)) {
            component.refresh(state);
            if (name === state.view) {
                component.show();
                let title = component.getTitle();
                title = title.replace('$player', state.player);
                title = title.replace('$room', state.room);
                this.updateTitle(title);
            } else {
                component.hide();
            }
        }
    }

    updateTitle(title) {
        this.querySelector('.title').innerText = title;
    }
}
