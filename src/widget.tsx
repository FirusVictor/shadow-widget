import React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './app';
import store from './store/store';
import retargetEvents from 'react-shadow-dom-retarget-events';

export default class Widget {
  private el;
  private isInit = false;
  private _isReady = false;
  private isRendered = false;

  constructor() {

  }

  init() {
    this.isRendered = false;
    return new Promise<{ status: boolean, error?: string }>(async (resolve) => {
      // region create container
      // создаем контейнер под виджет
      if (!this.el) {
        this.el = document.createElement('div');
        this.el.setAttribute('class', 'app-widget');
        const target = document.body;
        target.appendChild(this.el);
        target.querySelector('.app-widget').attachShadow({mode: 'open'});
        const containerInner = document.createElement('div');
        containerInner.setAttribute('class', 'app-widget-inner');
        document.querySelector('.app-widget').shadowRoot.appendChild(containerInner);
      }
      //endregion

      this._isReady = true;
      resolve({status: true});

      if (document.readyState === 'complete') {
        this.renderApp();
      } else {
        window.addEventListener('load', () => {
          this.renderApp();
        });
      }
    });
  }

  private renderApp() {
    this.isRendered = true;
    if (this.isInit) {
      return;
    }
    const target = document.querySelector('.app-widget').shadowRoot.querySelector('.app-widget-inner');

    ReactDOM.render(
        <Provider store={store}>
          <App/>
        </Provider>
        , target);
    this.isInit = true;

    retargetEvents(document.querySelector('.app-widget').shadowRoot);
  }

}
