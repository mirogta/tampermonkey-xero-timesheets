// Google Calendar
(function() {
    'use strict';

    GM_addStyle(`
._xero_export {
  position: fixed;
  top: 84px;
  left: 164px;
  z-index: 1000;
}
._xero_export button {
  padding: 16px 60px 16px 14px;
  border-radius: 30px;
  color: #fff;
  background:#00B7E2 url(https://edge.xero.com/images/1.0.0/favicon/favicon.ico) no-repeat right;
}
`);

    function parseDuration(text) {
        const regex = /(\d{2}):(\d{2}) to (\d{2}):(\d{2})/;
        if(regex.test(text) === false) {
            return null;
        }
        const matches = text.match(regex);
        const from = new Date(2000,1,1,matches[1],matches[2],0);
        const to = new Date(2000,1,1,matches[3],matches[4],0);
        const diff = Math.abs(to.getTime() - from.getTime());
        const seconds = diff / 1000;
        const minutes = seconds / 60;
        return minutes;
    }

    function parseEventText(text) {
        // 09:10 to 09:20, Daily Scrum, <My Name>, Accepted, Location: <hangouts/slack/etc>, <Date e.g. 9 April 2020>
        const parts = text.split(', ');
        const date = new Date(parts[5]);
        const time = parts[0];
        const duration = parseDuration(time);
        const data = {
            date: date,
            time: time,
            duration: duration,
            title: parts[1],
            calendar: parts[2],
            accepted: parts[3] === 'Accepted',
            location: parts[4],
        };
        return data
    }

    function parseEvents() {
        const events = document.querySelectorAll('[data-eventchip]');
        console.log(`- found ${events.length} events`);
        events.forEach(function(item) {
            const id = item.dataset.eventid;
            const details = item.querySelector('div');
            const data = parseEventText(details.innerText);
            console.log(data);
        });
    }

    function googleCalendarInit() {
        const xeroButton = document.createElementFromHtml('<div class="_xero_export"><button>Load events to</button></div>');
        document.body.appendChild(xeroButton);
        xeroButton.querySelector('button').addEventListener('click', parseEvents, false);
    }

    document.body.addEventListener('googleCalendarInit', googleCalendarInit, false);
})();