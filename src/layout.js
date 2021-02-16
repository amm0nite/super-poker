import Spinner from './views/spinner.js';
import Options from './views/options.js';
import Ingame from './views/ingame.js';

export default class Layout {
    constructor() {
        this.views = [];

        this.views.push(new Spinner('connecting'));
        this.views.push(new Spinner('joining'));
        this.views.push(new Options());
        this.views.push(new Ingame());
    }

    init() {
        const title = document.createElement('h1');
        title.textContent = 'Super Poker';
        title.className = 'margin-top-big';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'main-content';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'nes-container with-title';
        this.containerDiv = containerDiv;

        const containerTitle = document.createElement('p');
        containerTitle.className = 'title';
        containerTitle.textContent = 'Hello';
        this.containerTitle = containerTitle;

        containerDiv.append(containerTitle);
        for (let view of this.views) {
            containerDiv.append(view.init());
        }

        mainDiv.append(title);
        mainDiv.append(containerDiv);

        return mainDiv;
    }

    activate() {
        for (let view of this.views) {
            view.activate();
        }
    }

    switch(name, options) {
        console.log('switching to', name);

        let selectedView = null;
        for (let view of this.views) {
            if (view.name === name) {
                selectedView = view;
                view.show();
            } else {
                view.hide();
            }
        }

        if (!selectedView) {
            throw new Error('unexpected view: ' + name);
        }

        selectedView.update(options);
        let title = selectedView.getTitle(options);

        this.containerTitle.textContent = title;
    }
}
