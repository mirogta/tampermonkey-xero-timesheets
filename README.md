# tampermonkey-xero-timesheets

Tampermonkey/Greasemonkey script to enhance submitting timesheets in Xero.

## What does it do

Features:

* Projects page:
  * Added stars to projects
  * Added a toggle to show only starred projects
* New "My Time" page:
  * Added "My Time" link to the menu
  * Added copy&paste like functionality to copy timesheets from a day to another day
  * You can delete a timesheet using the delete/cross icon - it will ask for a confirmation
  * You can select multiple timesheets while holding a *Shift* key
  * You can delete multiple timesheets with a *Delete* key - it will ask for a confirmation
    * If you hold a *Shift* key, then it won't ask for a confirmation - use this carefully, there's no Undo

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

Unfortunately this script isn't compatible with Safari.

It may work with the latest Microsoft Edge internet browser based on Chromium, but it hasn't been tested.

## How to update

There is a check for any new updates of this script every day by default.

If you want to trigger an update for a newer version in Tampermonkey:

* Go to Tampermonkey -> Installed userscripts
* Tick the checkbox next to the "Xero Timesheets User Script"
* In the "Please choose an option" dropdown, select "Trigger update"
* Click on the "Start" button next to the dropdown

## License

Licensed under [MIT License](./LICENSE).

## Technology Used

* Xero
* [IntroJS](https://introjs.com/)
* VanillaJS
* OpenUserJS
* TamperMonkey
* GreaseMonkey
