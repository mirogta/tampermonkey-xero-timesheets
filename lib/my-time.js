// My Time content
(function() {
    'use strict';

    const data = {
        appData: null,
        appElement: null,
        isDeleteAllowed: true,
        isDemo: false,
    };

    const keys = {
        DELETE: 46,
    };

    // See https://www.w3schools.com/charsets/ref_utf_symbols.asp
     GM_addStyle(`
._weekend { background-color: #dde }
._today { margin-left: -31px; }
._today::before { content: " \\2794"; padding-top: 6px; margin-right: 14px; font-size: 20px; }
._time span { display: inline-block; padding: 0 4px; }
._timerecord { display: inline-block; border: 1px solid #fff; border-radius:4px; padding: 9px; width: 350px; white-space: nowrap; text-overflow: ellipsis; }
._timerecord:hover { border: 1px solid #aaa; cursor: pointer }
._add { visibility: hidden; cursor: pointer }
._selecting .xui-pickitem:hover ._add { visibility: visible }
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
._tip { padding: 10px; font-size: 14px; }
._tip::before { content: " \\261e"; margin-right: 10px }

._intro ._timerecord:not([data-user-id="demo"]) { display: none }
.introjs-tooltipReferenceLayer, .introjs-tooltip { width: 360px; max-width: 360px; }
.introjs-tooltiptext ._delete { visibility: visible; float: none; }
`);

     function clearSelectedTimeRecords() {
         document.body.querySelectorAll('._selected').forEach(function(node) {
             node.classList.remove('_selected');
         });
         document.getElementById('shell-app-root').className = '';
     }

     function timeEntryClicked(event, el) {
         console.log('- selected ', el.dataset);
         const selectedClass = '_selected';
         if(event.shiftKey === true) {
             // deselect any selected text caused by pressing the shift key
             window.getSelection().removeAllRanges();
             el.classList.contains(selectedClass) ? el.classList.remove(selectedClass) : el.classList.add(selectedClass);
         } else {
             clearSelectedTimeRecords();
             el.classList.add(selectedClass);
         }

         const selectedCount = data.appElement.querySelectorAll(`.${selectedClass}`).length;
         selectedCount === 0 ? data.appElement.classList.remove('_selecting') : data.appElement.classList.add('_selecting');
     }

    function addButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation()
        data.appElement.querySelectorAll('._selected').forEach(function(sourceElement) {
            const sourceData = sourceElement.dataset
            const targetData = event.target.dataset;
            const targetDateUtc = `${targetData.dateId}T00:00:00Z`;
            cloneTimeEntryElement(sourceData, targetDateUtc);
            postTimeEntry(sourceData.projectId, sourceData.taskId, sourceData.duration, targetData.dateId)
        });
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

    function deleteKeyPressed(withoutConfirmation) {
        const selectedItems = data.appElement.querySelectorAll('._selected');
        if(selectedItems.length === 0) {
            return;
        }

        const message = selectedItems.length === 1 ? "Do you want to delete the selected time entry?" : "WARNING: Are you sure you want to delete all the selected time entries?";

        if(withoutConfirmation === true || confirm(message)) {
            selectedItems.forEach(function(sourceElement) {
                const sourceData = sourceElement.dataset;
                deleteTimeEntry(sourceData.projectId, sourceData.timeEntryId)
                deleteTimeEntryElement(sourceData.timeEntryId);
                setTimeout(updateTotals, 100);

            });
        }
    }

    function registerTimesheetEvents() {
        document.addEventListener('click', function (event) {
            if(event.target.matches('._add')) {
                addButtonClicked(event);
            } else if(event.target.matches('._delete') && data.isDeleteAllowed === true) {
                deleteButtonClicked(event);
            } else if (event.target.matches('._timerecord')) {
                return timeEntryClicked(event, event.target)
            } else if(event.target.parentElement.matches('._timerecord')) {
                return timeEntryClicked(event, event.target.parentElement)
            }
        }, false);

        document.addEventListener('keydown', function(event) {
            if(event.keyCode === keys.DELETE && data.isDeleteAllowed === true) {
                deleteKeyPressed(event.shiftKey);
            }
        }, false);
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

    async function secureFetch(url, method, body, responseFn) {
         const userId = data.appData.currentUserId;
         const referrer = document.location.origin + document.location.pathname;
         const token = await GM.getValue('token', null);
         const shortCode = document.location.pathname.match(/\/app\/([^/]+)\/projects\//)[1];
         const headers = {
             "accept":"application/json",
             "accept-language":"en-GB,en-US;q=0.9,en;q=0.8",
             "authorization":`Bearer ${token.access_token}`,
             "cache-control":"private, max-age=0, no-cache, no-store",
             "content-type":"application/json",
             "sec-fetch-dest":"empty",
             "sec-fetch-mode":"cors",
             "sec-fetch-site":"same-origin",
             "x-client":"xero-secure-fetch",
             "xero-tenant-shortcode": shortCode,
         };
         // ommitted "xero-correlation-id":"a832aab3-256c-4688-b57b-70f8d2a4a1a1"
         fetch(url, {"credentials":"include","headers":headers,"referrer":referrer,"referrerPolicy":"no-referrer-when-downgrade","body":body,"method":method,"mode":"cors"})
         .then(responseFn)
         .catch(function(error) {
             console.log('Looks like there was a problem: \n', error);
         });
    }

     async function postTimeEntry(projectId, taskId, duration, dateId) {
         if(data.isDemo === true) {
             return;
         }

         const url = `https://go.xero.com/api/projects/projects/${projectId}/time`;
         const userId = data.appData.currentUserId;
         const body = `{\"taskId\":\"${taskId}\",\"userId\":\"${userId}\",\"duration\":${duration},\"dateUtc\":\"${dateId}T00:00:00Z\"}`;
         console.log('- posting time entry', body);
         await secureFetch(url, "POST", body, function(response) {
             setTimeout(updateIncompleteElements, 200);
         });
      }

     async function deleteTimeEntry(projectId, timeEntryId) {
         if(data.isDemo === true) {
             return;
         }

         const url = `https://go.xero.com/api/projects/projects/${projectId}/time/${timeEntryId}`;
         console.log('- deleting time entry', timeEntryId);
         await secureFetch(url, "DELETE", null, function(response) {
             console.log(`- time entry ${timeEntryId} deleted`);
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
             let totalDuration = 0;
             const listElement = item.parentElement.parentElement.parentElement.parentElement;
             listElement.querySelectorAll('._timerecord').forEach(function(record) {
                 // NOTE: ignore hidden elements
                 if(window.getComputedStyle(record).display === 'none') {
                     return;
                 }
                 totalDuration += parseInt(record.dataset.duration);
             });

             const totalHours = Math.floor(totalDuration / 60);
             const totalMinutes = totalDuration - (totalHours * 60);
             const paddedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes;
             item.innerText = totalHours > 0 ? `${totalHours}:${paddedMinutes}` : '';
         });
     }

     function findAppElement() {
         data.appElement = document.getElementById('shell-app-root');
     }

     async function showMyTime() {
        console.log('- show my time');

        findAppElement();
        clearAppContent();
        showTimeEntryHeader();
        createTimeDataLayout();
        createTimeList();
        registerTimesheetEvents();
        reloadTimeData();

        setTimeout(function() {
            document.body.dispatchEvent(new Event('addHelpMenu'));
        }, 500);

        const isWalkthroughSeen = await GM.getValue('isWalkthroughSeen', false);
        if(isWalkthroughSeen === false) {
            document.body.dispatchEvent(new Event('showIntro'));
        }
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
         const el = document.createElementFromHtml(html);
         data.appElement.append(el);
     }

     function createTimeDataLayout() {
         const html = '' +
         '<div class="xui-page-width-standard xui-margin-top-xlarge">' +
         '  <div class="xui-panel xui-margin-bottom">' +
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
         const el = document.createElementFromHtml(html);
         data.appElement.append(el);
     }

     function createTimeList() {
         const today = new Date();
         const todayDateId = today.toIdString();
         const timezoneOffset = today.getTimezoneOffset();
         const movingDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, -timezoneOffset, 0);
         // start with 14 days into the future
         movingDate.addDays(14);
         const fragment = document.createDocumentFragment();
         // go backwards 14 days (to today's date) and another 30 days into the past
         for(let i=0; i<14+30; i++) {
             const dateId = movingDate.toIdString();
             const isToday = (dateId === todayDateId);
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
             const el = document.createElementFromHtml(html);
             fragment.appendChild(el);
             movingDate.addDays(-1);
         }
         document.getElementById('_list').append(fragment);
     }

     function addTimeEntryElement(el) {
         const dateUtc = el.dataset.dateUtc;
         const date = new Date(dateUtc);
         const dateId = date.toIdString();
         const target = data.appElement.querySelector(`#_${dateId} ._time`);
         if(target) {
             target.append(el);
         }
     }

     function createTimeEntryElement(data) {
         const hours = Math.floor(data.duration / 60);
         const minutes = data.duration - (hours * 60);
         const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

         let duration = (hours > 0 ? `${hours}h` : '') + (minutes > 0 ? `${paddedMinutes}m` : '');

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
         elDuration.innerText = duration;
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

    async function loadTimeDateByDate(dateAfter, dateBefore, action) {
         console.log(`- loading timesheets ${dateAfter} - ${dateBefore}`);
         const userId = data.appData.currentUserId;
         const url = `https://go.xero.com/api/projects/time?dateAfterUtc=${dateAfter}T00%3A00%3A00Z&dateBeforeUtc=${dateBefore}T23%3A59%3A59Z&userId=${userId}`;

         await secureFetch(url, "GET", null, function(response) {
             response.json().then(action);
         });
    }

    function loadAppData() {

         // fetch https://go.xero.com/api/projects/app-data
         const userId = document.getElementById('ga-client').dataset.userId;
         data.appData = {
             currentUserId: userId,
         };
         //data.appData = JSON.parse(document.getElementById('appData').innerText);
     }

    function introStarted() {
        data.isDemo = true;
        blockDelete();
        updateTotals();
    }

    function introFinished() {
        data.isDemo = false;
        allowDelete();
        clearSelectedTimeRecords();
        updateTotals();
    }

    function allowDelete() {
        data.isDeleteAllowed = true;
    }

    function blockDelete() {
        data.isDeleteAllowed = false;
    }

    document.body.addEventListener('showMyTime', showMyTime, false);
    document.body.addEventListener('loadAppData', loadAppData, false);
    document.body.addEventListener('introStarted', introStarted, false);
    document.body.addEventListener('introFinished', introFinished, false);
    document.body.addEventListener('updateTotals', updateTotals, false);
    document.body.addEventListener('allowDelete', allowDelete, false);
    document.body.addEventListener('blockDelete', blockDelete, false);

    window._Xero_CloneTimeEntryElement = cloneTimeEntryElement;
})();