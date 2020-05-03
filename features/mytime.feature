Feature: Show 6 weeks of timesheets with a simple copy&paste functionality

  As a Xero Projects user
  I want to see multiple weeks of my timesheets
  So that I can easily copy&paste the timesheets form one day to another and get the timesheets submitted much faster

Scenario: add "My Time" menu item to Xero's menu
  Given I am authenticated to Xero
  When I load the projects page in Xero
  Then there is a new "My Time" menu

Scenario: clicking on "My Time" loads a new page with multiple weeks of timesheets
  When I click on the "My Time" menu
  Then a new page is loaded
  And the page displays 6 weeks of timesheets (past 4 weeks and future 2 weeks)

Scenario: select a timesheet
  Given there are some existing timesheets
  When I click on a timesheet
  Then the timesheet is selected

Scenario: show Add timesheet button
  Given a timesheet is selected
  When I hover mouse over any date which is not in a past month
  Then an "Add" button appears next to every day

Scenario: add a selected timesheet to any day
  Given a timesheet is selected
  When I click on the "Add" button
  Then the selected timesheet is copied to the date which corresponds to that "Add" button

Scenario: show Remove timesheet button
  When I hover mouse over any timesheet
  And the timesheet is not in a past month
  Then a "Delete" button appears on that timesheet

Scenario: remove timesheet
  When I click on a "Remove" button on a timesheet
  Then the timesheet is removed
  # NOTE: The timesheet does not need to be selected.