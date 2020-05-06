// Intro
(function () {

    const introOptions = {'showBullets': false, 'showProgress': true, 'hidePrev': true, 'exitOnEsc': false};

    function finishWalkthrough() {
        document.body.querySelectorAll('._demo,[data-user-id="demo"]').forEach(function(item) {
            item.remove();
        });

        document.body.classList.remove('_intro');

        document.body.dispatchEvent(new Event('introFinished'));

        setTimeout(hideHelp, 100);
    }

    function showHelp() {
        const helpButton = document.querySelector('button[title="Help"]');
        if(helpButton.classList.contains('xrh-focusable--parent-is-active') === false) {
            helpButton.click();
        }
    }

    function hideHelp() {
        const helpButton = document.querySelector('button[title="Help"]');
        if(helpButton.classList.contains('xrh-focusable--parent-is-active') === true) {
            helpButton.click();
        }
    }

    function showIntro() {

        console.log('- show intro');
        GM.setValue('isWalkthroughSeen', true);
        GM.setValue('isWalkthroughSeenV0_0_16', true);

        const cloneTimeEntryElement = window._Xero_CloneTimeEntryElement;

        const today = new Date();
        const targetDateUtc = today.toISOString();
        const sampleData1 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-1",
          taskName: "Design",
          description: "Drawing diagrams",
          duration: 75,
        };
        cloneTimeEntryElement(sampleData1, targetDateUtc);
        const sampleElement1 = document.body.querySelector('._timerecord[data-task-id="demo-1"]');
        sampleElement1.classList.add('_demo');
        sampleElement1.dataset.timeEntryId = 'demo-1';
        sampleElement1.dataset.step = '1';
        sampleElement1.dataset.intro = '<p><b>Welcome to the Xero Timesheets User Script Walkthrough</b></p><p>If you skip this walkthrough now, you can always restart it using a link in the Help menu.</p><hr><p>This is a sample time entry. You can select it by clicking on it.</p>You can try it now.'
        sampleElement1.dataset.position = 'top';

        const sampleData2 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-2",
          taskName: "Development",
          description: "Just a small change",
          duration: 360,
        };
        cloneTimeEntryElement(sampleData2, targetDateUtc);
        const sampleElement2 = document.body.querySelector('._timerecord[data-task-id="demo-2"]');
        const msg2 = '<p>You can select multiple time entries while holding a <b>Shift</b> key.</p>' +
              '<p>While holding the Shift key, you can also deselect it.</p>' +
              '<p>You can try it now.</p>' +
              '<p>NOTE: You can always go back in this walkthrough to select the previous time entry, if you haven\'t selected it.</p>';
        sampleElement2.classList.add('_demo');
        sampleElement2.dataset.timeEntryId = 'demo-2';
        sampleElement2.dataset.step = '2';
        sampleElement2.dataset.intro = msg2;
        sampleElement2.dataset.position = 'top';

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowUtc = tomorrow.toIdString();
        const tomorrowRow = document.getElementById(`_${tomorrowUtc}`);
        const buttonAdd = document.createElementFromHtml('<button class="_add _demo" style="visibility:visible"></button>');
        const msg3 = '<p>You can use the <b>Paste</b> button to paste the selected time entries into any other day.</p>' +
              '<p>The Paste button will appear when you mouse over different days, but only if you have some time entries selected.</p>' +
              '<p>After you Paste selected time entries, temporary time entries will be displayed until the system confirms that they have been added successfully.</p>' +
              '<p>You can try it now</p>' +
              '<p>You can add many time entries into a single day and you can also add multiple entries with the same content.</p>' +
              '<p>NOTE: The current version doesn\'t allow pasting to past months.</p>'
        buttonAdd.dataset.dateId = tomorrowUtc;
        buttonAdd.dataset.step = '3';
        buttonAdd.dataset.intro = msg3;
        buttonAdd.dataset.position = 'top';
        buttonAdd.addEventListener('click', function() {
            setTimeout(function() {
                document.body.querySelectorAll('._timerecord:not([data-time-entry-id])').forEach(function(item) {
                    item.dataset.timeEntryId = 'demo';
                });
                document.body.dispatchEvent(new Event('updateTotals'));
            }, 1000);
        }, false);
        tomorrowRow.append(buttonAdd);

        const totalElement = document.body.querySelector('._today ._total');
        totalElement.dataset.step = '4';
        totalElement.dataset.intro = 'You can see the total number of hours booked for each day.';
        totalElement.dataset.position = 'top';

        const sampleData3 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-3",
          taskName: "Training",
          duration: 30,
        };
        cloneTimeEntryElement(sampleData3, targetDateUtc);
        const sampleElement3 = document.body.querySelector('._timerecord[data-task-id="demo-3"]');
        sampleElement3.classList.add('_demo');
        sampleElement3.dataset.timeEntryId='demo-3';
        sampleElement3.dataset.step = '5';
        sampleElement3.dataset.intro = '<p>You can delete a time entry using the <span class="_delete"></span> button which appears when you mouse over the time entry.'+
         '<p class="_tip">' +
         '  <b>Pro Tip:</b> <ul><li>Press the <b>Delete</b> key to delete selected item(s) with a&nbsp;confirmation.</li><li>Hold a <b>Shift</b> key and press the <b>Delete</b> key to delete the selected item(s) without the confirmation. Be careful if you use this - you can quickly delete many time entries this way but there\'s no undo.</li></ul>'+
         '</p>' +
         '<p>You can try it now! Select the time entry below and try to delete it.</p>Don\'t worry, this is just a sample data, nothing will be actually deleted.';
        sampleElement3.dataset.position = 'bottom';

        createDetailStep(6);

        const restartButton = document.querySelector('._intro_restart');
        restartButton.dataset.step = 7;
        restartButton.dataset.intro = '<p>You can find additional help for the <b>My Time</b> page in the <b>Help menu</b>.</p><p>You can also restart this walkthrough using the <b><span>&#x267b;</span> Restart Walkthrough</b> link here.</p>';

        const issueButton = document.querySelector('._help_issue');
        issueButton.dataset.step = 8;
        issueButton.dataset.intro = '<p>If you find any issue or a missing feature, please report it using the link here.</p>';

        const likeButton = document.querySelector('._help_like');
        likeButton.dataset.step = 9;
        likeButton.dataset.intro = '<p>This is the end of the walkthrough.</p><p>Thanks for watching!</p><p>If you like this Xero Timesheets User Script, you can sponsor its development using the link here.</p>';

        document.body.classList.add('_intro');
        document.body.dispatchEvent(new Event('introStarted'));

        introJs().setOptions(introOptions).start().oncomplete(finishWalkthrough).onexit(finishWalkthrough).onafterchange(function(targetElement) {
            if(targetElement.dataset.step === '3') {
                sampleElement1.classList.add('_selected');
                sampleElement2.classList.add('_selected');
                const appElement = document.getElementById('shell-app-root');
                appElement.classList.add('_selecting')
                document.body.dispatchEvent(new Event('showDetail'));
            }
            if(targetElement.dataset.step === '4') {
                document.body.dispatchEvent(new Event('blockDelete'));
            }
            if(targetElement.dataset.step === '5') {
                targetElement.click();
                document.body.dispatchEvent(new Event('allowDelete'));
            }
            if(targetElement.dataset.step === '6') {
                sampleElement1.classList.add('_selected');
                sampleElement2.classList.add('_selected');
                document.getElementById('shell-app-root').classList.add('_selecting')
                document.body.dispatchEvent(new Event('showDetail'));
                hideHelp();
            }
            if(targetElement.dataset.step === '7') {
                document.getElementById('shell-app-root').classList.remove('_selecting')
                showHelp();
            }
        });
    }

    function showIntroV0_0_16() {
        console.log('- show intro');
        GM.setValue('isWalkthroughSeenV0_0_16', true);

        const cloneTimeEntryElement = window._Xero_CloneTimeEntryElement;

        const today = new Date();
        const targetDateUtc = today.toISOString();
        const sampleData1 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-1",
          taskName: "Design",
          description: "Drawing diagrams",
          duration: 75,
        };
        cloneTimeEntryElement(sampleData1, targetDateUtc);
        const sampleElement1 = document.body.querySelector('._timerecord[data-task-id="demo-1"]');
        sampleElement1.classList.add('_demo');
        sampleElement1.classList.add('_selected');
        sampleElement1.dataset.timeEntryId = 'demo-1';

        const sampleData2 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-2",
          taskName: "Development",
          description: "Just a small change",
          duration: 360,
        };
        cloneTimeEntryElement(sampleData2, targetDateUtc);
        const sampleElement2 = document.body.querySelector('._timerecord[data-task-id="demo-2"]');
        sampleElement2.classList.add('_demo');
        sampleElement2.classList.add('_selected');
        sampleElement2.dataset.timeEntryId = 'demo-2';

        createDetailStep(1);

        const appElement = document.getElementById('shell-app-root');
        appElement.classList.add('_selecting')
        document.body.dispatchEvent(new Event('showDetail'));

        document.body.classList.add('_intro');
        document.body.dispatchEvent(new Event('introStarted'));

        introJs().setOptions(introOptions).start().oncomplete(finishWalkthrough).onexit(finishWalkthrough);
    }

    function createDetailStep(stepNumber) {
        const detailElement = document.querySelector('._detail')
        detailElement.dataset.step = ''+stepNumber;
        detailElement.dataset.intro = '<h2>New in this version:</h2><p>When you select a time entry, this panel will appear and you can see more details, like Description here.</p><p>You can also edit duration using the "Edit Duration" button which appears when you mouse over that panel. Please note that you can currently choose only from the pre-defined durations.</p><p>Pro Tip: Press a key 1-9 to quickly select 1-9 hours.</p>';
        return detailElement;
    }

    document.body.addEventListener('showIntro', showIntro, false);
    document.body.addEventListener('showIntroV0_0_16', showIntroV0_0_16, false);
})();