// Compatibility checklist:
// https://caniuse.com/#feat=fetch            - Edge >=14, Firefox >=39,  Chrome >=42, Safari >=10.1, Opera >=29
// https://caniuse.com/#feat=classlist        - Edge >=12, Firefox >=26,  Chrome >=28, Safari >=13,   Opera >=66
// https://caniuse.com/#feat=dataset          - Edge >=12, Firefox >=6,   Chrome >=7,  Safari >=5.1,  Opera >=11.5
// https://caniuse.com/#feat=querySelectorAll - Edge >=12, Firefox >=3.5, Chrome >=4,  Safari >=6,    Opera >=10

// Color scheme from:
// https://material.io/design/color/the-color-system.html

// sample requests:
// - GET project tasks:
//   fetch("https://projects.xero.com/api/projects/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/tasks", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cache-control":"private, max-age=0, no-cache, no-store","content-type":"application/json","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://projects.xero.com/project/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/time","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"}); ;
// - GET one projects' timesheets:
//   fetch("https://projects.xero.com/api/projects/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/time", {"credentials":"include","headers":{"accept":"application/json","accept-language":"en-GB,en-US;q=0.9,en;q=0.8","cache-control":"private, max-age=0, no-cache, no-store","content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://projects.xero.com/project/3fecd493-1ffb-41c5-9f40-a6fd433b5c92/time","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});

(function() {
    'use strict';

     const data = {
         version: '0.0.2',
         appData: null,
         appElement: null,
         starredProjects: GM_getValue('starredProjects', {}),
         showOnlyStarredProjects: GM_getValue('showOnlyStarredProjects', false),
     };

    const constants = {
        menuSelectedClass: 'xrh-tab--body-is-selected',
    };

     const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

     Date.prototype.addDays = function(days) {
         this.setDate(this.getDate() + parseInt(days));
         return this;
     };
     Date.prototype.isWeekend = function() {
         return this.getDay() == 0 || this.getDay() == 6;
     };
     Date.prototype.isInPastMonths = function() {
         const today = new Date();
         var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
         const diffDays = Math.round((this - firstDay) / oneDay);
         return diffDays < 0;
     };

     // waitForKeyElements forked from source: https://gist.github.com/raw/2625891/waitForKeyElements.js
     function waitForKeyElements(selectorTxt, actionFunction) {
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

     function createElement(html) {
         var template = document.createElement('template');
         // Never return a text node of whitespace as the result
         html = html.trim();
         template.innerHTML = html;
         return template.content.firstChild;
     }

     // See https://www.w3schools.com/charsets/ref_utf_symbols.asp
     GM_addStyle(`
     ._star { padding: 10px }
     ._star:hover { color: #e0f }
     ._star::after { content: " \\2606" }
     ._star.__active::after { content: " \\2605" }
     ._projectStarToggle span { cursor: pointer; padding: 4px; }
     ._projectStarToggle ._all { border: 1px solid #ddd; border-radius: 6px 0 0 6px; background-color: #0078c8; color: #fff; }
     ._projectStarToggle ._starred { border: 1px solid #ddd; border-radius: 0 6px 6px 0; color: #000; }
     ._starred_only ._projectStarToggle ._all { border: 1px solid #ddd; background-color: #fff; color: #000; }
     ._starred_only ._projectStarToggle ._starred { border: 1px solid #ddd; background-color: #0078c8; color: #fff; }
     ._starred_only .pui-project-row { display: none; }
     ._starred_only .pui-project-row._starred { display: block; }
     ._weekend { background-color: #dde }
     ._today { margin-left: -31px; }
     ._today::before { content: " \\2794"; padding-top: 6px; margin-right: 14px; font-size: 20px; }
     ._time span { display: inline-block; padding: 0 4px; }
     ._timerecord { display: inline-block; border: 1px solid #fff; border-radius:4px; padding: 9px; width: 350px; white-space: nowrap; text-overflow: ellipsis; }
     ._timerecord:hover { border: 1px solid #aaa; cursor: pointer }
     ._add { visibility: hidden; cursor: pointer }
     #app._selecting .xui-pickitem:hover ._add { visibility: visible }
     ._add { position: absolute; left: 180px; top: 4px; padding: 10px; border-radius: 4px; }
     ._add:hover { background-color: #EF5350; color: white }
     ._today ._add { left: 210px }
     ._pastMonths { background-color: #eee }
     ._pastMonths ._add { visibility: hidden !important }
     ._selected { border: 1px solid white; background-color: #0078c8; color: white }
     ._delete { float: right; visibility: hidden; color: #aaa; font-size: 28px; line-height: 12px; padding: 0 !important; }
     ._delete::after { content: " \\2612" }
     ._pastMonths ._delete { visibility: hidden !important }
     ._timerecord:hover ._delete { visibility: visible }
     ._timerecord:hover ._delete:hover { color: #b00020; cursor: pointer }
     ._timerecord:not([data-time-entry-id]) { color: #aaa }
     ._timerecord:not([data-time-entry-id])::after { content: " \\262f"; float: right; -webkit-animation: spin 1s infinite linear; }
     ._timerecord:not([data-time-entry-id]) ._delete { visibility: hidden } // can't delete if there's no id (yet)
     @-moz-keyframes spin {
         from { -moz-transform: rotate(0deg); }
         to { -moz-transform: rotate(360deg); }
     }
     @-webkit-keyframes spin {
         from { -webkit-transform: rotate(0deg); }
         to { -webkit-transform: rotate(360deg); }
     }
     @keyframes spin {
         from {transform:rotate(0deg);}
         to {transform:rotate(360deg);}
     }
     ._project { font-weight: bold; }
     ._task {  }
     ._duration { }
     ._add::after { content: "Paste" }
     .xui-picklist { width: 100% }
     .xui-pickitem { border-bottom: 1px solid #eee; }
     .xui-pickitem-text:hover { background: #fff; cursor: default }
     `);

    function markProjectStarred(el, isActive) {
        const parentRow = el.parentElement.parentElement.parentElement;
        isActive ? parentRow.classList.add('_starred') : parentRow.classList.remove('_starred');
    }

     function projectStarClicked(event) {
         event.preventDefault();
         event.stopPropagation()
         const el = event.target;
         const activeClass = '__active';
         const isActive = el.classList.contains(activeClass)
         const id = el.dataset.id;
         isActive ? el.classList.remove(activeClass) : el.classList.add(activeClass);
         isActive ? delete data.starredProjects[id] : data.starredProjects[id] = 1;
         GM_setValue('starredProjects', data.starredProjects);
         markProjectStarred(el, !isActive);
     }

     function clearSelectedTimeRecords() {
         document.body.querySelectorAll('._selected').forEach(function(node) {
             node.classList.remove('_selected');
         });
         document.getElementById('app').className = '';
     }

     function timeEntryClicked(el) {
         console.log('- selected ', el.dataset);
         clearSelectedTimeRecords();
         el.classList.add('_selected');
         data.appElement.classList.add('_selecting');
     }

    function addButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation()
        const sourceElement = data.appElement.querySelector('._selected');
        if(sourceElement.length === null) {
            return false;
        }
        const sourceData = sourceElement.dataset
        const targetData = event.target.dataset;
        const targetDateUtc = `${targetData.dateId}T00:00:00Z`;
        cloneTimeEntryElement(sourceData, targetDateUtc);
        postTimeEntry(sourceData.projectId, sourceData.taskId, sourceData.duration, targetData.dateId)
        return false;
    }

    function deleteButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation()
        const sourceData = event.target.parentElement.dataset;
        if(confirm("Do you want to delete this time entry?")) {
            deleteTimeEntry(sourceData.projectId, sourceData.timeEntryId)
            deleteTimeEntryElement(sourceData.timeEntryId);
            setTimeout(updateTotals, 100);
        }
    }

    function registerTimesheetEvents() {
        document.addEventListener('click', function (event) {
            if(event.target.matches('._add')) {
                addButtonClicked(event);
            } else if(event.target.matches('._delete')) {
                deleteButtonClicked(event);
            } else if (event.target.matches('._timerecord')) {
                return timeEntryClicked(event.target)
            } else if(event.target.parentElement.matches('._timerecord')) {
                return timeEntryClicked(event.target.parentElement)
            }
        }, false);
    }

    function addProjectStars() {
        console.log('- adding project stars');
        const projects = document.body.querySelectorAll('.pui-project-row');
        const activeClass = '__active';
        console.log(`- found ${projects.length} projects`);
        projects.forEach(function(p) {
            const id = p.id;
            const isSet = data.starredProjects[id] || false;
            const star = document.createElement('div');
            star.dataset.id = id;
            star.className = '_star ' + (isSet ? activeClass : '');
            p.querySelector('.xui-contentblockitem--rightcontent').append(star)
            star.addEventListener('click', projectStarClicked, false);
            markProjectStarred(star, isSet);
        });
     }

    function projectStarsToggleClicked(event) {
        event.preventDefault();
        event.stopPropagation()
        const isStarred = data.showOnlyStarredProjects;
        const toggle = document.body;
        data.showOnlyStarredProjects = !isStarred;
        GM_setValue('showOnlyStarredProjects', data.showOnlyStarredProjects);
        if(isStarred) {
            toggle.classList.remove('_starred_only');
        } else {
            toggle.classList.add('_starred_only');
        }
    }

    function addProjectStarsToggle() {
        const tabs = document.body.querySelector('.xui-pageheading--actions');
        const toggle = createElement('<div class="_projectStarToggle"><span class="_all">Show all projects</span><span class="_starred">Show starred projects</span></div>');
        const isStarred = data.showOnlyStarredProjects;
        if(isStarred) {
            document.body.classList.add('_starred_only');
        }
        tabs.append(toggle);
        toggle.addEventListener('click', projectStarsToggleClicked, false);
    }

     function overlayProjects() {
         addProjectStars();
         addProjectStarsToggle();
     }


     function clearAppContent() {
         if(data.appElement) {
             data.appElement.innerText = '';
         }
     }

     function updateTimeEntryElement(item) {
         const incompleteRecord = data.appElement.querySelector(`._timerecord[data-task-id="${item.taskId}"]:not([data-time-entry-id])`);
         if(incompleteRecord) {
             incompleteRecord.dataset.timeEntryId = item.timeEntryId;
             incompleteRecord.dataset.dateEnteredUtc = item.dateEnteredUtc;
         }
     }

     function updateIncompleteElements() {

         const incompleteRecords = data.appElement.querySelectorAll('._timerecord:not([data-time-entry-id])');
         if(incompleteRecords.length === 0) {
             return;
         }

         console.log(`- reloading incomplete records [${incompleteRecords.length}]`);
         const firstRecord = incompleteRecords[0];
         const dateId = firstRecord.dataset.dateUtc;

         // NOTE: was expecting data just for this one date, but it returns all data …
         loadTimeDateByDate(dateId, dateId, function(json) {
             for(let item of json.items) {
                 // … so need to filter it out here
                 if(item.dateUtc === dateId) {
                     updateTimeEntryElement(item);
                 }
             };
             updateTotals();
         });

         if(incompleteRecords.length > 0) {
             setTimeout(updateIncompleteElements, 200);
         }
     }

     function postTimeEntry(projectId, taskId, duration, dateId) {
         const userId = data.appData.currentUserId;
         const url = `https://projects.xero.com/api/projects/${projectId}/time`;
         const headers = {"accept":"application/json","content-type":"application/json","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"};
         const body = `{\"taskId\":\"${taskId}\",\"userId\":\"${userId}\",\"duration\":${duration},\"dateUtc\":\"${dateId}T00:00:00Z\"}`;
         console.log('- posting time entry', body);
         fetch(url, {"credentials":"include","headers":headers,"body":body,"method":"POST","mode":"cors"})
         .then(function(response) {
             setTimeout(updateIncompleteElements, 200);
         })
         .catch(function(error) {
             console.log('Looks like there was a problem: \n', error);
         });
      }

     function deleteTimeEntry(projectId, timeEntryId) {
         const userId = data.appData.currentUserId;
         const url = `https://projects.xero.com/api/projects/${projectId}/time/${timeEntryId}`;
         const headers = {"accept":"application/json","content-type":"application/json","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"};
         console.log('- deleting time entry', timeEntryId);
         fetch(url, {"credentials":"include","headers":headers,"body":null,"method":"DELETE","mode":"cors"})
         .then(function(response) {
             console.log(`- time entry ${timeEntryId} deleted`);
         })
         .catch(function(error) {
             console.log('Looks like there was a problem: \n', error);
         });
     }

     function cloneTimeEntryElement(data, targetDateUtc) {
         // userId: "<GUID>"
         // timeEntryId: "<GUID>"
         // contactId: "0c5264d2-3647-44cf-b035-4a3396774648"
         // contactName: "Iotic  "
         // projectId: "3fecd493-1ffb-41c5-9f40-a6fd433b5c92"
         // projectName: "Development (evo)"
         // taskId: "a810c812-fb8a-4b0d-8dd4-0ee208f3a0d9"
         // taskName: "Development"
         // dateUtc: "2020-02-24T00:00:00Z"
         // dateEnteredUtc: "2020-02-28T15:51:43.0473331Z"
         // duration: 480
         // status: "ACTIVE"
         const clonedData = {
             userId: data.userId,
             // timeEntryId: …, // not known yet, need to update after submitting and reading back from the system
             contactId: data.contactId,
             contactName: data.contactName,
             projectId: data.projectId,
             projectName: data.projectName,
             taskId: data.taskId,
             taskName: data.taskName,
             dateUtc: targetDateUtc, // overwrite the dateUtc with the target one
             dateEnteredUtc: (new Date()).toISOString(), // also need to update after submitting and reading back from the system
             duration: data.duration,
             status: data.status,
         };
         createTimeEntryElement(clonedData);
     }


     function deleteTimeEntryElement(timeEntryId) {
         const el = data.appElement.querySelector(`._timerecord[data-time-entry-id="${timeEntryId}"]`);
         if(el.classList.contains('_selected')) {
            clearSelectedTimeRecords();
         }
         el.remove();
     }

     function updateTotals() {
         const countRecords = data.appElement.querySelectorAll('._timerecord').length;
         if(countRecords === 0) {
             return;
         }
         data.appElement.querySelectorAll('._total').forEach(function(item) {
             let totalHours = 0;
             const listElement = item.parentElement.parentElement.parentElement.parentElement;
             listElement.querySelectorAll('._timerecord').forEach(function(record) {
                 const duration = Math.floor(record.dataset.duration / 60);
                 totalHours += parseInt(duration);
             });

             item.innerText = totalHours > 0 ? `${totalHours}h` : '';
         });
     }

     function findAppElement() {
         data.appElement = document.getElementById('app');
     }

     function showMyTime() {
         console.log('- show my time');
         findAppElement();
         clearAppContent();
         showTimeEntryHeader();
         createTimeDataLayout();
         createTimeList();
         registerTimesheetEvents();
         reloadTimeData();
     }

     function reloadTimeData() {
         console.log('- reload my time data');

         document.querySelectorAll('._time').forEach(function(el) {el.innerText = '';});
         data.appElement.classList.remove('_selecting');

         // can't get data for a date range greater than 2 weeks, so in order to fetch all the data we need to make multiple fetches
         loadTimeData(-30, -15);
         loadTimeData(-14, -1);
         loadTimeData(0, 14);
     }

     function showTimeEntryHeader() {
         const title = 'Time entries in the last 30 days and future 14 days';
         const html = `<header class="xui-pageheading h-overflow-visible pui-page-projects-overview--header"><div class="xui-pageheading--content xui-pageheading--content-layout xui-page-width-standard"><div class="xui-pageheading--tabs"><h1 class="xui-pageheading--title">${title}</h1></div><div class="xui-pageheading--actions"></div></div></header>`;
         const el = createElement(html);
         data.appElement.append(el);
     }

     function createTimeDataLayout() {
         const html = '' +
         '<div class="xui-page-width-standard xui-margin-top-xlarge"><div class="xui-panel xui-margin-bottom">' +
         '  <div class="xui-padding-large">' + // <= header
         '    <div class="xui-column-3-of-12">' +
         '      <span class="xui-heading-small">Date</span>' +
         '    </div>' +
         '    <div class="xui-column-9-of-12">' +
         '      <span class="xui-heading-small">Time Entries</span>' +
         '    </div>' +
         '  </div>' + // <= header
         '  <div class="xui-u-flex-grow">' +
         '    <ul id="_list" role="group" class="xui-picklist xui-picklist-layout"></ul>' +
         '  </div>' +
         '</div></div>' +
         '';
         const el = createElement(html);
         data.appElement.append(el);
     }

     function createTimeList() {
         const today = new Date();
         const movingDate = new Date();
         // start with 14 days into the future
         movingDate.addDays(14);
         const fragment = document.createDocumentFragment();
         // go backwards 14 days (to today's date) and another 30 days into the past
         for(let i=0; i<14+30; i++) {
             const dateId = movingDate.toISOString().substring(0,10);
             const isToday = (movingDate.toISOString() === today.toISOString());
             const isWeekend = movingDate.isWeekend();
             const isInPastMonths = movingDate.isInPastMonths();
             const className = 'xui-pickitem xui-u-flex xui-u-flex-justify-space-between ' + (isToday ? '_today ' : '') + (isWeekend ? '_weekend ' : '') + (isInPastMonths ? '_pastMonths ' : '');
             let html = '' +
             `<li class="${className}" id="_${dateId}">` +
             `  <div class="xui-column-3-of-12 _date"><span class="xui-pickitem--body"><span class="xui-pickitem--text"><div class="xui-column-8-of-12">${movingDate.toDateString()}</div><div class="xui-column-3-of-12 _total"></div></span></span></div>` +
             `  <div class="xui-column-9-of-12 _time xui-pickitem" data-date-id="${dateId}"></div>` +
             `  <button class="_add" data-date-id="${dateId}"></button>` +
             '</li>' +
             '';
             const el = createElement(html);
             fragment.appendChild(el);
             movingDate.addDays(-1);
         }
         document.getElementById('_list').append(fragment);
     }

     function addTimeEntryElement(el) {
         const dateUtc = el.dataset.dateUtc;
         const date = new Date(dateUtc);
         const dateId = date.toISOString().substring(0,10);
         const target = data.appElement.querySelector(`#_${dateId} ._time`);
         if(target) {
             target.append(el);
         }
     }

     function createTimeEntryElement(data) {
         const duration = Math.floor(data.duration / 60);
         const el = document.createElement('div');
         el.className = '_timerecord';
         for(let key in data) {
             el.dataset[key] = data[key];
         }
         const elDelete = document.createElement('span');
         elDelete.className = '_delete';
         el.append(elDelete);
         const elProject = document.createElement('span');
         elProject.className = '_project';
         elProject.innerText = data.projectName;
         el.append(elProject);
         const elTask = document.createElement('span');
         elTask.className = '_task';
         elTask.innerText = data.taskName;
         el.append(elTask);
         const elDuration = document.createElement('span');
         elDuration.className = '_duration';
         elDuration.innerText = `${duration}h`;
         el.append(elDuration);

         addTimeEntryElement(el);
     }

     function showTimeData(json) {
         // userId: "<GUID>"
         // timeEntryId: "<GUID>"
         // contactId: "0c5264d2-3647-44cf-b035-4a3396774648"
         // contactName: "Iotic  "
         // projectId: "3fecd493-1ffb-41c5-9f40-a6fd433b5c92"
         // projectName: "Development (evo)"
         // taskId: "a810c812-fb8a-4b0d-8dd4-0ee208f3a0d9"
         // taskName: "Development"
         // dateUtc: "2020-02-24T00:00:00Z"
         // dateEnteredUtc: "2020-02-28T15:51:43.0473331Z"
         // duration: 480
         // status: "ACTIVE"
         for(let item of json.items) {
             createTimeEntryElement(item);
         };

         updateTotals();
     }

     function loadTimeData(from, to) {
         const fromDate = new Date()
         const toDate = new Date();
         fromDate.addDays(from);
         toDate.addDays(to);
         const dateAfter = fromDate.toISOString().substring(0,10);
         const dateBefore = toDate.toISOString().substring(0,10);
         loadTimeDateByDate(dateAfter, dateBefore, showTimeData);
     }

     function loadTimeDateByDate(dateAfter, dateBefore, action) {
         console.log(`- loading timesheets ${dateAfter} - ${dateBefore}`);
         const userId = data.appData.currentUserId;
         const url = `https://projects.xero.com/api/time?dateAfterUtc=${dateAfter}T00%3A00%3A00Z&dateBeforeUtc=${dateBefore}T23%3A59%3A59Z&userId=${userId}`;
         fetch(url, {"credentials":"include","headers":{"accept":"application/json","content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"body":null,"method":"GET","mode":"cors"})
             .then(function(response) {
             response.json().then(action);
         })
             .catch(function(error) {
             console.log('Looks like there was a problem: \n', error);
         });
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
        showMyTime();
        document.location.hash = 'tampermonkey-my-time';
        const dataLoadedElement = document.body.querySelector('div[data-loaded]');
        if(dataLoadedElement) {
            dataLoadedElement.dataset.loaded = false;
        }
    }

     function addMyTimeLink() {
         console.log('- adding projects overlay');
         const menu = document.body.querySelector('.xrh-navigation');
         const link = createElement('<li class="xrh-tab" id="_link"><button type="button" class="xrh-focusable xrh-tab--body">My Time</button></li>');
         link.querySelector('button').addEventListener('click', navigateToMyTimeLink, false);
         menu.append(link);
     }

     function loadAppData() {
         data.appData = JSON.parse(document.getElementById('appData').innerText);
     }

     function load() {
         console.log(`Xero Timesheets User Script v${data.version}`);
         loadAppData();
         addMyTimeLink();
         switch(document.location.pathname) {
             case '/':
                 overlayProjects();
                 break;
         }

         if(document.location.hash === '#tampermonkey-my-time') {
             if(document.location.pathname != '/') {
                 document.location.pathname = '/';
                 return false;
             }
             navigateToMyTimeLink();
         }
         return false;
     }

     waitForKeyElements('[data-loaded="true"]', load);
 })();