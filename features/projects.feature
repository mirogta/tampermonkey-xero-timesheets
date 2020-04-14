Feature: Favourite Projects

  As Xero Projects user
  I want to only see projects which are relevant to my role
  So that my view isn't obstructed by irrelevant projects and I get my work done faster

Scenario: 1 - add star next to projects:
  Given I am authenticated to Xero
  When I load list of projects in Xero
  Then there is a star toggle next to each project

Scenario: 2 - mark as favourite:
  Given I click on a star toggle next to a project
  And the project isn't marked as my favourite
  Then this project is permanently marked as my favourite

Scenario: 3 - unmark as favourite:
  Given I click on a star toggle next to a project
  And the project is marked as my favourite
  Then this project is permanently removed from my favourites

Scenario: 4 - add a toggle all/only favourite projects:
  Given I am authenticated to Xero
  When I load list of projects in Xero
  Then there is a toggle to view all/only favourite projects.

Scenario: 5 - show all projects:
  When I click on the toggle to view all projects
  Then all projects are displayed

Scenario: 6 - show favourite projects:
  When I click on the toggle to view only favourite projects
  Then only favourite projects are displayed
