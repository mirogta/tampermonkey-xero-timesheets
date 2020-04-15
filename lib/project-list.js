// Project stars
(function() {
    'use strict';

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
`);

    const data = {
        starredProjects: null,
        showOnlyStarredProjects: null,
    };

    async function init() {
        data.starredProjects = await GM.getValue('starredProjects', {});
        data.showOnlyStarredProjects = await GM.getValue('showOnlyStarredProjects', false);
    }

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
        GM.setValue('starredProjects', data.starredProjects);
        markProjectStarred(el, !isActive);
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

        GM.setValue('showOnlyStarredProjects', data.showOnlyStarredProjects);
        if(isStarred) {
            toggle.classList.remove('_starred_only');
        } else {
            toggle.classList.add('_starred_only');
        }
    }

    function addProjectStarsToggle() {
        const tabs = document.body.querySelector('.xui-pageheading--actions');
        const toggle = document.createElementFromHtml('<div class="_projectStarToggle"><span class="_all">Show all projects</span><span class="_starred">Show starred projects</span></div>');
        const isStarred = data.showOnlyStarredProjects;
        if(isStarred) {
            document.body.classList.add('_starred_only');
        }
        tabs.append(toggle);
        toggle.addEventListener('click', projectStarsToggleClicked, false);
    }

     async function overlayProjects() {
         await init();
         addProjectStars();
         addProjectStarsToggle();
     }

    document.body.addEventListener('overlayProjects', overlayProjects, false);
})();