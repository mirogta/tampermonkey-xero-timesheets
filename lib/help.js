// Help
(function () {

    GM_addStyle(`
._intro_help h3 { color: #666; padding: 0 10px; position: relative; top: 16px; }
._help span { font-size: 20px; vertical-align: middle; color: #666; width: 20px; display: inline-block; }

._like_popup { display: flex; align-items: center; justify-content: center; }
._like_content { -webkit-box-flex: 0; -webkit-flex: none; -ms-flex: none; flex: none; max-width: 50%; width: 400px; z-index: 1000000; position: fixed; top: 400px; }
._like_popup .introjs-tooltip { width: 420px; max-width: 420px; }
._like_item { display: inline-block; width: 100px; float: left; margin: 20px; }
._like_item::before { position: absolute; font-size: 22px; color: #0aa; margin-top: -8px; margin-left: -22px; }
._like_star::before { content: " \\278a" }
._like_script::before { content: " \\278b" }
._like_kofi::before { content: " \\278c" }
._like_popup center { clear: both; margin: 10px 0; text-align: center; font-weight: bold; }
`);

    function addHelpMenu() {
        const helpMenu = document.querySelector('.xn-h-task-list');
        const xeroSupport = document.createElementFromHtml('<div class="_intro_help"><h3>My Time Help</h3><ul class="xn-h-task-list-tasks"></ul></div>');
        helpMenu.append(xeroSupport);
        const helpList = xeroSupport.querySelector('ul');

        const introButton = document.createElementFromHtml('<li class="xn-h-header-info-item _help"><a class="_intro_restart" href="#tampermonkey-my-time"><span>&#x267b;</span> Restart Walkthrough</a></li>');
        introButton.addEventListener('click', showIntro, false);
        helpList.append(introButton);

        const issueButton = document.createElementFromHtml('<li class="xn-h-header-info-item _help"><a class="_help_issue" href="https://github.com/mirogta/tampermonkey-xero-timesheets/issues" target="xero_userscript"><span>&#x2691;</span> Report an issue or a missing feature</a></li>');
        helpList.append(issueButton);

        const likeButton = document.createElementFromHtml('<li class="xn-h-header-info-item _help"><a class="_help_like" href="#tampermonkey-my-time"><span>&#x263a;</span> Do you like My Time?</a></li>');
        likeButton.addEventListener('click', showLikePopup, false);
        helpList.append(likeButton);
    }

    function showIntro() {
        document.body.dispatchEvent(new Event('showIntro'));
    }

    function showLikePopup() {
        const html = '<div class="_like_popup"><div class="introjs-overlay" style="top: 0px; bottom: 0px; left: 0px; right: 0px; position: fixed; opacity: 0.8;"></div>' +
              '<div class="_like_content">' +
              '<div class="introjs-tooltip" role="dialog" style="left: 15px; bottom: 50px;">' +
              '  <div class="introjs-tooltiptext"><h3>Do you like My Time?</h3><p>Your support keeps this project alive.</p><p>You can show your support by any or all of these options:</p>' +
              '    <div class="_like_item _like_star">Add a star to the <a href="https://github.com/mirogta/tampermonkey-xero-timesheets" target="xero_userscript">GitHub project</a></div>' +
              '    <div class="_like_item _like_script">Rate the script on <a href="https://openuserjs.org/scripts/mirogta/Xero_Timesheets_User_Script" target="openuserjs">OpenUserJS</a></div>' +
              '    <div class="_like_item _like_kofi">Buy me a coffee on <a href="https://ko-fi.com/mirogta" target="kofi">Ko-Fi</a></div>' +
              '    <center>Thank you!</center>' +
              '  </div>' +
              '  <div class="introjs-tooltipbuttons"><a class="introjs-button" role="button" tabindex="0">Close</a></div>' +
              '</div></div>';
        const el = document.createElementFromHtml(html);
        document.body.append(el);

        el.querySelector('.introjs-overlay').addEventListener('click', function() {
            el.remove();
        }, false);
        el.querySelector('.introjs-button').addEventListener('click', function() {
            el.remove();
        }, false);
    }

    document.body.addEventListener('addHelpMenu', addHelpMenu, false);
})();