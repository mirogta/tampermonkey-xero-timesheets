# tampermonkey-xero-timesheets

Tampermonkey/Greasemonkey script to enhance submitting timesheets in Xero.

## What does it do

Features:

* Projects page:
  * Added stars to projects
  * Added a toggle to show only starred projects
  See [./features/projects.feature](./features/projects.feature)
* New "My Time" page:
  * Added "My Time" link to the menu
  * Added copy&paste like functionality to copy timesheets from a day to another day
  * You can delete a timesheet using the delete/cross icon - it will ask for a confirmation
  * You can select multiple timesheets while holding a *Shift* key
  * You can delete multiple timesheets with a *Delete* key - it will ask for a confirmation
    * If you hold a *Shift* key, then it won't ask for a confirmation - use this carefully, there's no Undo
  * Show public/bank holidays (currently in the UK only)

Limitations:

* It doesn't allow you to add or delete timesheets to previous months.

## How to install

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (on Chrome) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (on Firefox) browser extensions
2. Go to [Xero_Timesheets_User_Script in OpenUserJS](https://openuserjs.org/scripts/mirogta/Xero_Timesheets_User_Script)
3. Click on the "Install" button

Then you can login to [projects.xero.com](https://projects.xero.com) and use the improvements.

## Compatibility

* Firefox >= 39
* Chrome >= 42
* Microsoft Edge (latest)

Unfortunately this script isn't compatible with Safari browser.

## How to update

There is a check for any new updates of this script every day by default.

If you want to trigger an update for a newer version in Tampermonkey:

* Go to Tampermonkey -> Installed userscripts
* Tick the checkbox next to the "Xero Timesheets User Script"
* In the "Please choose an option" dropdown, select "Trigger update"
* Click on the "Start" button next to the dropdown

## Development

Pre-Requisites:

* Docker

Run `./dev/run-httpd.sh` which runs *nginx* container in your local Docker instance.

Modify the `@require` links in the `/UserScript` section of the user script to point to the local web server rather than to GitHub.

### Dev notes

#### Compatibility checklist

* https://caniuse.com/#feat=fetch            - Edge >=14, Firefox >=39,  Chrome >=42, Safari >=10.1, Opera >=29
* https://caniuse.com/#feat=classlist        - Edge >=12, Firefox >=26,  Chrome >=28, Safari >=13,   Opera >=66
* https://caniuse.com/#feat=dataset          - Edge >=12, Firefox >=6,   Chrome >=7,  Safari >=5.1,  Opera >=11.5
* https://caniuse.com/#feat=querySelectorAll - Edge >=12, Firefox >=3.5, Chrome >=4,  Safari >=6,    Opera >=10

#### Color scheme

<https://material.io/design/color/the-color-system.html>

#### Request blocking

Chrome Developer Tools:

* Request blocking:
  pattern: telemetry.ext.platformdevelopment.xero.com

#### Sample requests

```
// - GET projects
fetch("https://go.xero.com/api/projects/projects?includeSummary=false&states=INPROGRESS&term=", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","authorization":"Bearer ...","cache-control":"private, max-age=0, no-cache, no-store","content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-client":"xero-secure-fetch","xero-correlation-id":"95cc9942-d853-4924-adfe-bdb3a5d654cc","xero-tenant-shortcode":"!hhv2k"},"referrer":"https://go.xero.com/app/!hhv2k/projects/?CID=!hhv2k","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});

// - GET project tasks:
fetch("https://go.xero.com/api/projects/projects/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/tasks", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cache-control":"private, max-age=0, no-cache, no-store","content-type":"application/json","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://projects.xero.com/project/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/time","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"}); ;

// - GET one project's timesheets:
fetch("https://go.xero.com/api/projects/projects/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/time", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cache-control":"private, max-age=0, no-cache, no-store","content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://projects.xero.com/project/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/time","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});

// - GET all projects timesheets in a date range:
fetch("https://go.xero.com/api/projects/time?dateAfterUtc=2020-03-29T23%3A00%3A00Z&dateBeforeUtc=2020-04-05T22%3A59%3A59Z&userId=c498ccf7-10b7-4aaf-8bdb-0e7cce8a8a17", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","authorization":"Bearer ...","cache-control":"private, max-age=0, no-cache, no-store","content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-client":"xero-secure-fetch","xero-correlation-id":"a832aab3-256c-4688-b57b-70f8d2a4a1a1","xero-tenant-shortcode":"!hhv2k"},"referrer":"https://go.xero.com/app/!hhv2k/projects/time-entries?CID=%21hhv2k&date=2020-03-30&staff=c498ccf7-10b7-4aaf-8bdb-0e7cce8a8a17","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
```

## Integration with Google Calendar API

I've tried to add a simple **Google OAuth** support to the script so that anybody could just authorize this script to access their Google Calendars, but it's quite a challenge to do so:

* Since it would need to have read-only access to your Google Calendar, it would need an *OAuth Consent Screen* configuration, which is submitted to Google and would need to go through a 4-6 week long verification process.
* The *OAuth Consent Screen* requires links to "Privacy Policy" and "Terms of Use" pages hosted on the approved top level domain - but since the approved domain would need to be `xero.com`, because the timesheets are hosted on `projects.xero.com` and this script runs on the same domain, I couldn't possibly put the links to my own "Privacy Policy" page which would be relevant to this script.
* This script can still access your Google Calendar while using Google OAuth running as an **Unverified Apps**. But there is a strict limitation of only 100 users. That means that the Google Calendar integration would only work for the first 100 users and that's not good enough. See <https://support.google.com/cloud/answer/7454865?hl=en>

Solution?

You can set up your own Google API project with your own Google API key. This allows you fully control access to your Google Calendar and as an extra security layer you can be sure that nobody else can use your Google API key. So when you authenticate to Google and the OAuth Consent Screen pops up saying that this is Unverified App, you can be ensured that the app is in fact your own and you have a full control over it (e.g. revoking access or the API keys should you wish to do so).

This would be actually good for me, because my first attempt at integrating with Google Calendar API would entail generating my personal Google API key and sharing it with everybody, so that you would not have to go through the burdens of setting it up, but then "I would share my personal Google API key with everybody" which didn't sound very exciting to me anyway… so Google made me not to do that. Thanks Google!

There is however a bit of a problem with this solution: It would require anyone who wants to use this to set up their own Google API project and Google API key appropriately, which might be a bit of a challenge and could be error-prone.

Useful Links:

* Calendar Quickstart: https://developers.google.com/calendar/quickstart/js
* Credentials: https://console.developers.google.com/apis/credentials
* Calendar API Authorization: https://developers.google.com/calendar/auth

## Integration with Google Calendar website

Rather than using Google Calendar API, it is actually possible to run the user script within the context of the <https://calendar.google.com> website and process the page to get your calendar events. You get a full control over what is displayed on the page and what gets "sent" over to the Xero Projects "My Time" page, as this would be completely happening locally in your browser and no traffic would be sent over the internet to/from Google.

## Links

* <https://gist.github.com/willurd/5720255> - I've tried the minimal Ruby server `ruby -run -ehttpd . -p8100` but it doesn't support ETag and caching well. So ended up with using NGINX Docker container for local development instead.

## License

Licensed under [MIT License](./LICENSE).

## Technology Used

* Xero
* [IntroJS](https://introjs.com/)
* VanillaJS
* OpenUserJS
* TamperMonkey
* GreaseMonkey
