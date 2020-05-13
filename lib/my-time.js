// My Time content
(function() {
    'use strict';

    const data = {
        appData: null,
        appElement: null,
        isDeleteAllowed: true,
        isEditingHours: false,
        isDemo: false,
    };

    const cssClasses = {
        timesheetSelected: '_selected',
        isEditing: '_editing',
    };

    const cssSelectors = {
        timesheetSelected: `.${cssClasses.timesheetSelected}`,
    };

    const keys = {
        ESC: 27,
        DELETE: 46,
    };

    // See https://www.w3schools.com/charsets/ref_utf_symbols.asp
     GM_addStyle(`

._records {
    margin: 0;
    padding: 0;
}
._records ul { width: 100%; padding: 0; margin: 10px 0 0 0; }
.xui-pickitem { border-bottom: 1px solid #eee; min-height: 40px; }
.xui-pickitem-text:hover { background: #fff; cursor: default }
._tip {
    padding: 10px;
    display: block;
    font-size: 14px;
    color: #666;
}
._tip::before { content: " \\261e"; margin-right: 10px }
._date { padding-left: 10px; }
._weekend { background-color: #dde }
._today { margin-left: -31px; }
._today::before { content: " \\2794"; padding-top: 6px; margin-right: 14px; font-size: 20px; }
._time { flex-wrap: wrap }
._time span { display: inline-block; padding: 0 4px; }
._timerecord {
    display: inline-block;
    border: 1px solid #fff;
    border-radius:4px;
    padding: 9px;
    width: 350px;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: auto;
}
._timerecord:hover { border: 1px solid #aaa; cursor: pointer }
._add { visibility: hidden; cursor: pointer }
._selecting .xui-pickitem:hover ._add { visibility: visible }
._add { position: absolute; left: 198px; top: 4px; padding: 10px; border-radius: 4px; }
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

._intro ._timerecord:not([data-user-id="demo"]) { display: none }
.introjs-tooltipReferenceLayer, .introjs-tooltip { width: 420px; max-width: 420px; padding: 20px 40px; }
.introjs-tooltiptext ._delete { visibility: visible; float: none; }

._detail {
    position: fixed;
    top: 145px;
    right: 0px;
    max-width: 220px;
    width: 220px;
    display: none;
    margin-left: 10px;
}
._selecting ._detail { display: block }
#_detail div {
    border-bottom: 1px solid #eee;
    padding: 4px 20px;
}
._detail b { margin: 10px 0; color: #0078c8; display: block }
._detail dt { font-weight: bold }
._detail dd { margin-inline-start: 20px; }
._detail button {
    padding: 10px;
    border-radius: 4px;
}

._edit_hr { visibility: hidden }
#_detail div:hover ._edit_hr { visibility: visible }
._hr { display: none; width: 50px; margin: 4px; }
._editing { background-color: #eef }
._editing ._hr { display: inline-block; border: 2px outset #ddd; }
._editing ._edit_hr { display: none }
#_detail ._tip { display: none }
#_detail ._editing ._tip { display: block }
._detail ._cancel_edit { display: none }
._editing ._cancel_edit { display: inline-block }

._holiday::before {
    content: attr(data-holiday);
    color: #666;
    margin: 10px 0;
    font-size: 12px;
    background-repeat: no-repeat;
    padding-left: 36px;
    background-position: left;
    display: flex;
    flex: auto;
}

._holiday_uk::before {
    background-image: url(https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.6/flags/4x3/gb.svg)};
}
`);

    function forEachSelectedTimeEntry(fn) {
        document.body.querySelectorAll(cssSelectors.timesheetSelected).forEach(fn);
    }

    function clearSelectedTimeEntries() {
        forEachSelectedTimeEntry(function(node) {
            node.classList.remove(cssClasses.timesheetSelected);
        });
        document.getElementById('shell-app-root').className = '';
    }

    function timeEntryClicked(event, el) {
        console.log('- selected ', el.dataset);
        const selectedClass = cssClasses.timesheetSelected;
        if(event.shiftKey === true) {
            // deselect any selected text caused by pressing the shift key
            window.getSelection().removeAllRanges();
            el.classList.contains(selectedClass) ? el.classList.remove(selectedClass) : el.classList.add(selectedClass);
        } else {
            clearSelectedTimeEntries();
            el.classList.add(selectedClass);
        }

        document.body.dispatchEvent(new Event('showDetail'));

        const selectedCount = data.appElement.querySelectorAll(cssSelectors.timesheetSelected).length;
        selectedCount === 0 ? data.appElement.classList.remove('_selecting') : data.appElement.classList.add('_selecting');
    }

    function addButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation()
        forEachSelectedTimeEntry(function(sourceElement) {
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

    function editHourButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        // stop editing any previous edits
        stopEditingHours();

        event.target.parentElement.classList.add(cssClasses.isEditing);
        data.isEditingHours = true;
        return false;
    }

    function cancelEditHourButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        stopEditingHours();
        return false;
    }

    function stopEditingHours() {
        const editingEl = document.body.querySelector(`.${cssClasses.isEditing}`);
        if(editingEl) {
            editingEl.classList.remove(cssClasses.isEditing);
        }
        data.isEditingHours = false;
    }

    function setHourButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation();

        const selectedDuration = event.target.dataset.duration;
        setHoursFor(event.target.parentElement, selectedDuration);

        return false;
    }

    function setHoursFor(targetElement, duration) {

        const targetData = targetElement.dataset;
        targetData.duration = parseInt(duration);

        saveTimeEntry(targetData.timeEntryId, targetData.projectId, targetData.taskId, targetData.duration, targetData.dateUtc);

        // copy data attributes from the edited detail to the selected item
        const selectedItem = document.body.querySelector(`._timerecord[data-time-entry-id="${targetData.timeEntryId}"]`)
        for(let key in targetData) {
            selectedItem.dataset[key] = targetData[key];
        }
        selectedItem.querySelector('._duration').innerText = `${duration/60}h`;

        // finish editing
        stopEditingHours();

        showDetail();
        updateTotals();
    }

    function isKeyOneToNine(keyCode) {
        // 49 = "key 1" and 57 = "key 9"
        return keyCode >= 49 && keyCode <= 57;
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
            } else if(event.target.matches('._edit_hr')) {
                editHourButtonClicked(event);
            } else if(event.target.matches('._hr')) {
                setHourButtonClicked(event);
            } else if(event.target.matches('._cancel_edit')) {
                cancelEditHourButtonClicked(event);
            }
        }, false);

        document.addEventListener('keydown', function(event) {
            if(event.keyCode === keys.ESC && data.isEditingHours === true) {
                stopEditingHours();
            } else if(event.keyCode === keys.DELETE && data.isDeleteAllowed === true) {
                deleteKeyPressed(event.shiftKey);
            } else if (data.isEditingHours === true && isKeyOneToNine(event.keyCode)) {
                const hours = event.keyCode - 48;
                const duration = parseInt(hours * 60);
                const targetElement = document.body.querySelector(`._editing`);
                setHoursFor(targetElement, duration);
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

    function getSessionToken() {
        const token = JSON.parse(sessionStorage.getItem("oidc.user:https://identity.xero.com:xero_business_go"));
        return token.access_token;
    }

    async function secureFetch(url, method, body, responseFn) {
         const referrer = document.location.origin + document.location.pathname;
         const token = getSessionToken();
         const shortCode = document.location.pathname.match(/\/app\/([^/]+)\/projects\//)[1];
         const headers = {
             "accept":"application/json",
             "accept-language":"en-GB,en-US;q=0.9,en;q=0.8",
             "authorization":`Bearer ${token}`,
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

     async function saveTimeEntry(timeEntryId, projectId, taskId, duration, dateUtc) {
        if(data.isDemo === true) {
            return;
        }
        const url = `https://go.xero.com/api/projects/projects/${projectId}/time/${timeEntryId}`;
        const body = `{\"projectId\":\"${projectId}\",\"taskId\":\"${taskId}\",\"duration\":${duration},\"dateUtc\":\"${dateUtc}\"}`;
        console.log('- saving time entry', body);
        await secureFetch(url, 'PUT', body, function(response) {
            console.log(`  ${timeEntryId} saved`);
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
         // description: ""
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
         if(data.description) {
             clonedData.description = data.description;
         }
         createTimeEntryElement(clonedData);
     }

     function deleteTimeEntryElement(timeEntryId) {
         const el = data.appElement.querySelector(`._timerecord[data-time-entry-id="${timeEntryId}"]`);
         if(el.classList.contains('_selected')) {
            clearSelectedTimeEntries();
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

     function addHelpMenu() {
        document.body.dispatchEvent(new Event('addHelpMenu'));
     }

   function loadPublicHolidays() {
        // currently only UK holidays are supported
        if(navigator.language != 'en-GB') {
            return;
        }

        const url = 'https://www.gov.uk/bank-holidays.json';
        fetch(url, {'method':'GET','mode':'cors'})
            .then(function(response) {
                response.json().then(showUkPublicHolidays);
            })
            .catch(function(error) {
                console.log('Looks like there was a problem: \n', error);
            });
       }

    function showUkPublicHolidays(json) {
        if(json && json["england-and-wales"] && json["england-and-wales"].events) {
            const hols = json["england-and-wales"].events;
            hols.forEach(function(holiday) {
                const dateId = holiday.date;
                // remove additional holiday info in (brackets), leave just the main title
                const title = holiday.title.replace(/\s+\(.*\)/gi, "");
                const dateEl = document.getElementById(`_${dateId}`);
                if(dateEl) {
                    const target = dateEl.querySelector('._time');
                    if(target) {
                        target.classList.add('_holiday');
                        target.classList.add('_holiday_uk');
                        target.dataset.holiday = `UK: ${title}`;
                    }
                }
            });
        }
    }

    async function showMyTime() {
        console.log('- show my time');

        findAppElement();
        clearAppContent();

        showTimeEntryHeader();
        createTimeDataLayoutHtml();
        createSidebarHtml();
        createTimeList();
        registerTimesheetEvents();

        reloadTimeData();

        addHelpMenu();
        setTimeout(loadPublicHolidays, 500)
        setTimeout(showIntro, 500);
    }

    async function showIntro() {
        // reset the intro - for debugging
        //GM.setValue('isWalkthroughSeen', false);
        //GM.setValue('isWalkthroughSeenV0_0_16', false);

        const isWalkthroughSeen = await GM.getValue('isWalkthroughSeen', false);
        if(isWalkthroughSeen === false) {
            document.body.dispatchEvent(new Event('showIntro'));
        } else {
            const isWalkthroughSeenV0_0_16 = await GM.getValue('isWalkthroughSeenV0_0_16', false);
            if(isWalkthroughSeenV0_0_16 === false) {
                document.body.dispatchEvent(new Event('showIntroV0_0_16'));
            }
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
         const html = '' +
            '<header class="xui-pageheading h-overflow-visible pui-page-projects-overview--header">' +
            '<div class="xui-pageheading--content xui-pageheading--content-layout xui-page-width-standard"><div class="xui-pageheading--tabs">' +
            `<h1 class="xui-pageheading--title">${title}</h1>` +
            '</div><div class="xui-pageheading--actions"></div></div>' +
            '</header>';
         const el = document.createElementFromHtml(html);
         data.appElement.append(el);
     }

     function createTimeDataLayoutHtml() {
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
         '  <div class="_records">' +
         '    <ul id="_list" role="group"></ul>' +
         '  </div>' +
         '  </div>' +
         '</div>' +
         '';
         const el = document.createElementFromHtml(html);
         data.appElement.append(el);
     }

     function createSidebarHtml() {
        const html = '' +
        '  <div class="xui-panel xui-margin-bottom _detail">' + // <= sidebar
        '    <div id="_detail" role="group"></div>' +
        '  </div>' + // <= sidebar
        '';
        const el = document.createElementFromHtml(html);
        data.appElement.append(el);

        setSidebarPosition();
        window.addEventListener('resize', setSidebarPosition);
     }

     function setSidebarPosition() {
        const dw = document.body.clientWidth;
        const w = document.body.querySelector('.xui-panel').clientWidth;
        document.body.querySelector('._detail').style.left=`${dw/2 + w/2}px`
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
             const className = 'xui-pickitem ' + (isToday ? '_today ' : '') + (isWeekend ? '_weekend ' : '') + (isInPastMonths ? '_pastMonths ' : '');
             const dateString = movingDate.toDateString().replace(' ', ', ');
             let html = '' +
             `<li class="${className}" id="_${dateId}">` +
             `  <div class="xui-column-3-of-12 _date"><span class="xui-pickitem--body"><span class="xui-pickitem--text"><div class="xui-column-8-of-12">${dateString}</div><div class="xui-column-3-of-12 _total"></div></span></span></div>` +
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

     function convertTimeEntryDurationToHHMM(duration) {
        const hours = Math.floor(duration / 60);
        const minutes = duration - (hours * 60);
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return (hours > 0 ? `${hours}h` : '') + (minutes > 0 ? `${paddedMinutes}m` : '');
    }

    function createTimeEntryElement(data) {
        const duration = convertTimeEntryDurationToHHMM(data.duration);

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

    function showDetail() {
        const detailEl = document.getElementById('_detail');
        detailEl.innerText = '';
        forEachSelectedTimeEntry(function(item) {
            addDetailHtml(detailEl, item);
        });
    }

    function addDetailHtml(target, item) {
        const duration = convertTimeEntryDurationToHHMM(item.dataset.duration);
        const dateUtc = item.dataset.dateUtc;
        const date = new Date(dateUtc);
        const dateId = date.toIdString();

        const html = '' +
        '<div>' +
        `<b>${dateId}</b>` +
        '<dt>Project</dt>' +
        `<dd>${item.dataset.projectName}</dd>` +
        '<dt>Task</dt>' +
        `<dd>${item.dataset.taskName}</dd>` +
        '<dt>Description</dt>' +
        `<dd>${item.dataset.description || '&nbsp;'}</dd>` +
        '<dt>Duration</dt>' +
        `<dd>${duration}</dd>` +
        `<button class="_hr" data-duration="15">15m</button>` +
        `<button class="_hr" data-duration="30">30m</button>` +
        `<button class="_hr" data-duration="45">45m</button>` +
        `<button class="_hr" data-duration="60">1h</button>` +
        `<button class="_hr" data-duration="120">2h</button>` +
        `<button class="_hr" data-duration="180">3h</button>` +
        `<button class="_hr" data-duration="240">4h</button>` +
        `<button class="_hr" data-duration="300">5h</button>` +
        `<button class="_hr" data-duration="360">6h</button>` +
        `<button class="_hr" data-duration="420">7h</button>` +
        `<button class="_hr" data-duration="480">8h</button>` +
        `<button class="_hr" data-duration="540">9h</button>` +
        `<button class="_edit_hr">Edit Duration</button>` +
        `<span class="_tip">Press a key 1-9 to quickly select 1-9 hours or Esc to cancel edit</span>` +
        `<button class="_cancel_edit">Cancel</button>` +
        '</div>' +
        '';

        const el = document.createElementFromHtml(html);
        // copy data attributes
        for(let key in item.dataset) {
            el.dataset[key] = item.dataset[key];
        }
        target.append(el);
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
        clearSelectedTimeEntries();
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
    document.body.addEventListener('showDetail', showDetail, false);

    window._Xero_CloneTimeEntryElement = cloneTimeEntryElement;
})();