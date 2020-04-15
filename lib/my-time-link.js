// My Time link
(function() {
    'use strict';

    const constants = {
        menuSelectedClass: 'xrh-tab--body-is-selected',
    };

    function addMyTimeLink() {
        console.log('- adding projects overlay');
        const menu = document.body.querySelector('.xrh-navigation');
        const link = document.createElementFromHtml('<li class="xrh-tab" id="_link"><button type="button" class="xrh-focusable xrh-tab--body">My Time</button></li>');
        link.querySelector('button').addEventListener('click', navigateToMyTimeLink, false);
        menu.append(link);
    }

    function clearSelectedMenu() {
        document.body.querySelector('.xrh-navigation').querySelectorAll('button').forEach(function(el) {el.classList.remove(constants.menuSelectedClass);});
    }

    function selectMyTimeLink() {
        document.body.querySelector('#_link button').classList.add(constants.menuSelectedClass);
    }

    function navigateToMyTimeLink(event) {
        console.log('- navigation to show my time');
        if(event) {
            event.preventDefault();
        }
        clearSelectedMenu();
        setTimeout(selectMyTimeLink, 100);

        document.body.dispatchEvent(new Event('showMyTime'));

        document.location.hash = 'tampermonkey-my-time';
        const dataLoadedElement = document.body.querySelector('div[data-loaded]');
        if(dataLoadedElement) {
            dataLoadedElement.dataset.loaded = false;
        }
    }

    document.body.addEventListener('addMyTimeLink', addMyTimeLink, false);
    document.body.addEventListener('navigateToMyTimeLink', navigateToMyTimeLink, false);
})();
