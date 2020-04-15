// Google Calendar API integration
(function(window) {
    'use strict';

    const createElement = window._xero.createElement;

    const googleApiData = {
        clientId: '…',
        apiKey: '…',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events.readonly',
    };

    // See https://www.w3schools.com/charsets/ref_utf_symbols.asp
    GM_addStyle(`
.abcRioButtonContentWrapper {
    height: 100%;
    width: 100%;
}

.abcRioButtonIcon {
    float: left;
}

.abcRioButton {
    -webkit-border-radius: 1px;
    border-radius: 1px;
    -webkit-box-shadow 0 2px 4px 0px rgba(0,0,0,.25): ;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.25);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: background-color .218s,border-color .218s,box-shadow .218s;
    transition: background-color .218s,border-color .218s,box-shadow .218s;
    -webkit-user-select: none;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    color: #262626;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    position: relative;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    width: auto;
}

.abcRioButton {
    height: 36px !important;
    width: 120px !important;
}

.abcRioButtonLightBlue {
    background-color: #fff;
    color: #757575;
}

.abcRioButtonContents {
    font-family: Roboto,arial,sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: .21px;
    margin-left: 6px;
    margin-right: 6px;
    padding-top: 8px;
}
`);

      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

    function handleSignIn() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        const authorizeButton = document.getElementById('_g_signin_button');
        const signoutButton = document.getElementById('_g_signout_button');
        authorizeButton.onclick = function(event) {
            gapi.auth2.getAuthInstance().signIn();
        };
        signoutButton.onclick = function(event) {
            gapi.auth2.getAuthInstance().signOut();
        };
    }

      function initClient() {
        gapi.client.init(googleApiData).then(handleSignIn, function(error) {
            appendPre(JSON.stringify(error, null, 2));
        });
      }

      function updateSigninStatus(isSignedIn) {
          const authorizeButton = document.getElementById('_g_signin_button');
          const signoutButton = document.getElementById('_g_signout_button');
          if (isSignedIn) {
              authorizeButton.style.display = 'none';
              signoutButton.style.display = 'block';
              listUpcomingEvents();
          } else {
              authorizeButton.style.display = 'block';
              signoutButton.style.display = 'none';
          }
      }

      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (let i = 0; i < events.length; i++) {
              var event = events[i];
                // id, kind: "calendar#event", status: "confirmed", start.dateTime, end.dateTime
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              var to = event.end.dateTime;
                if(!to) {
                    to = event.end.date;
                }
              appendPre(event.summary + ` (${when} - ${to})`)
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }

    function googleCalendarApiInit() {

        const html = '<div class="_google">' +
              '  <div class="abcRioButton abcRioButtonLightBlue"><div class="abcRioButtonContentWrapper">' +
              '    <div class="abcRioButtonIcon" style="padding:8px"><div style="width:18px;height:18px;" class="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" class="abcRioButtonSvg"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg></div></div>' +
              '    <div class="abcRioButtonContents"><span id="_g_signin_button" style="display: none;">Authorize</span><span id="_g_signout_button" style="display: none;">Sign Out</span></div>' +
              '  </div></div>' +
              '  <pre id="content" style="white-space: pre-wrap;"></pre>' +
              '</div>';
        const googleIntegration = createElement(html);
        document.body.append(googleIntegration);

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js?onload=onGoogleApiLoaded';
        script.async = true;
        script.defer = true;
        //script.onload="this.onload=function(){};onGoogleApiLoaded()";
        //script.onreadystatechange="if (this.readyState === 'complete') this.onload()";
        document.head.appendChild(script);
    }

    document.body.addEventListener('googleCalendarApiInit', googleCalendarApiInit, false);

    unsafeWindow.onGoogleApiLoaded = handleClientLoad;
})(window);