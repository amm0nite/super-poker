
export default class Spinner {
    constructor(name) {
        this.name = name;
    }

    init() {
        const spinnerDiv = document.createElement('div');
        spinnerDiv.className = 'view hidden';
        this.spinnerDiv = spinnerDiv;

        const spinnerText = document.createElement('p');
        spinnerText.textContent = 'Loading...';

        spinnerDiv.append(spinnerText);

        return spinnerDiv;
    }

    activate() {

    }

    update() {

    }

    getTitle(options) {
        return this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }

    hide() {
        if (!this.spinnerDiv.classList.contains('hidden')) {
            this.spinnerDiv.classList.add('hidden');
        }
    }

    show() {
        if (this.spinnerDiv.classList.contains('hidden')) {
            this.spinnerDiv.classList.remove('hidden');
        }
    }
}
