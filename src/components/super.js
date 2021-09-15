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
                    <spin-ner></spin-ner>
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
        this.addEventListener('switch', (event) => {
            console.log('received switch:', event.detail);
        });
        this.addEventListener('refresh', (event) => {
            console.log('received refresh:', event.detail);
        });
    }
}
