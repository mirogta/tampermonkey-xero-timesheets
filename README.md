# tampermonkey-xero-timesheets

Tampermonkey/Greasemonkey script to enhance submitting timesheets in Xero.

## What does it do

Features:

* Projects page:
  * Added stars to projects
  * Added a toggle to show only starred projects
* New "My Time" page:
  * Added "My Time" link to the menu
  * Added copy&pate like functionality to copy timesheets from a day to another day
  * Added a simple functionality to delete timesheets

Limitations:

* It doesn't allow you to add or delete timesheets to previous months.

## How to install

1. Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (on Chrome) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (on Firefox) browser extensions.
2. Add a new user script with the content of [xero.user.js](./xero.user.js).
3. Login to [projects.xero.com](https://projects.xero.com).

## License

Licensed under [MIT License](./LICENSE).

## Technology Used

* Xero
* VanillaJS
* TamperMonkey
* GreaseMonkey
