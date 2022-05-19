import Widget from './widget';

let widgetName: any = document.querySelector('[data-widget]') && document.querySelector('[data-widget]').getAttribute('data-widget') ?
    document.querySelector('[data-widget]').getAttribute('data-widget') : null;
widgetName = widgetName ? widgetName : 'captain2';

function init() {
  window[`${widgetName}`] = new Widget();
}
init();

