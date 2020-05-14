// Google Analytics
(function() {
    'use strict';

    const accountId = 'UA-166537396-1';

    const scriptContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${accountId}');
`;

    function loadGoogleAnalytics() {
        // <!-- Global site tag (gtag.js) - Google Analytics -->
        // <script async src="https://www.googletagmanager.com/gtag/js?id=UA-166537396-1"></script>
        // <script>
        //     window.dataLayer = window.dataLayer || [];
        //     function gtag(){dataLayer.push(arguments);}
        //     gtag('js', new Date());
        //
        //     gtag('config', 'UA-166537396-1');
        // </script>
        console.log(`- loading Google Analytics`);

        const fragment = new DocumentFragment();

        const comment = document.createComment('Global site tag (gtag.js) - Google Analytics');
        fragment.appendChild(comment);

        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${accountId}`;
        fragment.appendChild(gaScript);

        const script = document.createElement('script');
        const inlineScript = document.createTextNode(scriptContent);
        script.appendChild(inlineScript); 
        fragment.appendChild(script);

        document.head.appendChild(fragment);
    }

    document.body.addEventListener('loadGoogleAnalytics', loadGoogleAnalytics, false);
})();