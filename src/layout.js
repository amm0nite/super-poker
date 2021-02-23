import Spinner from './views/spinner.js';
import Options from './views/options.js';
import Ingame from './views/ingame.js';
import pack from '../package.json';

export default class Layout {
    constructor() {
        this.views = [];

        this.views.push(new Spinner('connecting'));
        this.views.push(new Spinner('joining'));
        this.views.push(new Options());
        this.views.push(new Ingame());
    }

    init() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main-content';

        const title = document.createElement('h1');
        title.textContent = 'Super Poker';
        title.className = 'margin-top-big';

        const subtitle = document.createElement('p');
        subtitle.textContent = 'Minimalist planning poker';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'nes-container with-title margin-top-big';
        this.containerDiv = containerDiv;

        const containerTitle = document.createElement('p');
        containerTitle.className = 'title';
        containerTitle.textContent = 'Hello';
        this.containerTitle = containerTitle;

        containerDiv.append(containerTitle);
        for (let view of this.views) {
            containerDiv.append(view.init());
        }

        const footerDiv = this.createFooter();

        mainDiv.append(title);
        mainDiv.append(subtitle);
        mainDiv.append(containerDiv);
        mainDiv.append(footerDiv);

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

    createFooter() {
        const footerDiv = document.createElement('p');
        footerDiv.className = 'text-align-center margin-top-big';

        const githubLink = document.createElement('a');
        githubLink.href = pack.homepage;
        githubLink.textContent = 'github';
        footerDiv.append(githubLink);

        footerDiv.append(' - ');

        const twitterLink = document.createElement('a');
        twitterLink.href = 'https://twitter.com/amm0nite';
        twitterLink.textContent = '@amm0nite';
        footerDiv.append(twitterLink);

        return footerDiv;
    }
}
