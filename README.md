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
  * You can quickly edit duration on selected timesheets
  * Show public/bank holidays (currently in the UK only)

Limitations:

* It doesn't allow you to add or delete timesheets to previous months.

## How to install

1. Install Tampermonkey browser extension (for [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/), [Microsoft Edge](https://www.microsoft.com/store/apps/9NBLGGH5162S))
2. Go to [Xero_Timesheets_User_Script in OpenUserJS](https://openuserjs.org/scripts/mirogta/Xero_Timesheets_User_Script)
3. Click on the "Install" button

Then you can login to [go.xero.com](https://go.xero.com) and use the improvements.

NOTE: The script is compatible with GreaseMonkey on Firefox.

## Compatibility

* Firefox >= 39
* Chrome >= 42
* Microsoft Edge (latest)

## How to update

Tampermonkey checks for a new version of this script daily by default.

If you want to trigger an ad-hoc update of a newer version:

* Go to Tampermonkey -> Installed userscripts
* Tick the checkbox next to the "Xero Timesheets User Script"
* In the "Please choose an option" dropdown, select "Trigger update"
* Click on the "Start" button next to the dropdown

## Development

See [development](./docs/development.md)

## Links

* <https://gist.github.com/willurd/5720255> - I've tried the minimal Ruby server `ruby -run -ehttpd . -p8100` but it doesn't support ETag and caching well. So ended up with using NGINX Docker container for local development instead.
* <https://developers.google.com/analytics/devguides/collection/gtagjs/events> - Event tracking for Google Analytics

## License

Licensed under [MIT License](./LICENSE).

## Technology Used

* Xero
* [IntroJS](https://introjs.com/)
* VanillaJS
* OpenUserJS
* TamperMonkey
* GreaseMonkey
* Google Calendar
* Google Analytics