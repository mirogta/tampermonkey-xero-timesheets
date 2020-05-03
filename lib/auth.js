// Authentication
(function (open) {

    function setToken(token) {
        GM.setValue('token', token);
    }

    const readyStateDone = 4;
    const responseStatusOK = 200;
    
    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        this.addEventListener('readystatechange', function(evt) {
            if (this.readyState == readyStateDone  &&  this.status == responseStatusOK && this.responseText.startsWith("{"))
            {
                var jsonObj = null;
                try {
                    jsonObj = JSON.parse (this.responseText);
                }
                catch (err) {
                    console.warn(err);
                }
                // NOTE: there are multiple `token` requests, but some have e.g. only the 'openid' scope and we need the one with 'xero_frontend-apis'
                if (jsonObj && jsonObj.access_token && /xero_frontend-apis/.test(jsonObj.scope)) {
                    // {id_token, access_token, expires_in: 720, token_type: "Bearer", scope: "openid profile email xero_frontend-apis"}
                    setToken(jsonObj);
                }
            }
        }, false);

        open.call (this, method, url, async, user, pass);
    };

})(XMLHttpRequest.prototype.open);