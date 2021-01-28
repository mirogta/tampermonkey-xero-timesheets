// ==UserScript==
// @name         Xero Timesheets User Script
// @namespace    https://github.com/mirogta/tampermonkey-xero-timesheets
// @version      0.0.20
// @description  Script to help with submitting timesheets in Xero
// @author       mirogta
// @license      MIT
// @homepageURL  https://github.com/mirogta/tampermonkey-xero-timesheets
// @match        https://go.xero.com/app/*
// @match        https://calendar.google.com/calendar/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_notification
// @grant        GM.notification
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/gm4-polyfil.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/intro.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/intro-css.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/flag-icon-css.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/google-analytics.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/common.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/project-list.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/my-time.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/my-time-link.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/help.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/intro.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/google-calendar.js
// @run-at       document-end
// @compatible   firefox >=39
// @compatible   chrome >=42
// ==/UserScript==
// ==OpenUserJS==
// @author mirogta
// @collaborator username
// ==/OpenUserJS==

// Original @requires:
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/gm4-polyfil.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/intro.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/intro-css.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/vendor/flag-icon-css.min.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/google-analytics.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/common.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/project-list.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/my-time.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/my-time-link.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/help.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/intro.js
// @require      https://github.com/mirogta/tampermonkey-xero-timesheets/raw/0.0.20/lib/google-calendar.js

// Dev @requires:
// @require      http://localhost:8100/vendor/gm4-polyfil.min.js
// @require      http://localhost:8100/vendor/intro.min.js
// @require      http://localhost:8100/vendor/intro-css.min.js
// @require      http://localhost:8100/vendor/flag-icon-css.min.js
// @require      http://localhost:8100/lib/google-analytics.js
// @require      http://localhost:8100/lib/common.js
// @require      http://localhost:8100/lib/project-list.js
// @require      http://localhost:8100/lib/my-time.js
// @require      http://localhost:8100/lib/my-time-link.js
// @require      http://localhost:8100/lib/help.js
// @require      http://localhost:8100/lib/intro.js
// @require      http://localhost:8100/lib/google-calendar.js

// Loader
(function() {
    'use strict';

    console.log(`Xero Timesheets User Script loader`);

    const featureFlags = {
        enableProjectStars: true,
        enableMyTime: true,
        enableGoogleCalendar: false,
    };

    function loadXero() {
         console.log(`Xero Timesheets User Script - go.xero.com`);
         document.body.dispatchEvent(new Event('loadGoogleAnalytics'));
         document.body.dispatchEvent(new Event('loadAppData'));

         if(featureFlags.enableMyTime === true) {
            document.body.dispatchEvent(new Event('addMyTimeLink'));
         }

         if(featureFlags.enableProjectStars === true && /\/projects.*/.test(document.location.pathname) && document.location.hash === '') {
            document.body.dispatchEvent(new Event('overlayProjects'));
            return false;
         }

         if(document.location.hash === '#tampermonkey-my-time') {
            document.body.dispatchEvent(new Event('navigateToMyTimeLink'));
         }
         return false;
     }

    function loadGoogleCalendar() {
        if(featureFlags.enableGoogleCalendar !== true) {
            return;
        }

        console.log(`Xero Timesheets User Script - calendar.google.com`);
        document.body.dispatchEvent(new Event('loadGoogleAnalytics'));
        document.body.dispatchEvent(new Event('googleCalendarInit'));
    }

    // waitForKeyElements forked from source: https://gist.github.com/raw/2625891/waitForKeyElements.js
    const waitForKeyElements = function(selectorTxt, actionFunction) {
        var btargetsFound;
        var targetNodes = document.querySelectorAll(selectorTxt);
        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.forEach(function(el) {
                var alreadyFound = el.dataset.alreadyFound || false;
                if (!alreadyFound) {
                    var cancelFound = actionFunction(el);
                    if(cancelFound) {
                        btargetsFound = false;
                    } else {
                        el.dataset.alreadyFound = true;
                    }
                }
            });
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Set a timer, if needed.
        if(! timeControl) {
            timeControl = setInterval(function() {
                waitForKeyElements(selectorTxt, actionFunction);
            }, 300);
            controlObj [controlKey] = timeControl;
        }
        waitForKeyElements.controlObj = controlObj;
    }

    switch(document.location.host) {
        case 'go.xero.com':
            waitForKeyElements('[data-loaded="true"]', loadXero);
            return;
        case 'calendar.google.com':
            waitForKeyElements('body[aria-busy="false"]', loadGoogleCalendar);
            return;
    }
})();