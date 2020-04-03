// ==UserScript==
// @name         Xero Timesheets User Script
// @namespace    https://github.com/mirogta/tampermonkey-xero-timesheets
// @version      0.0.10
// @description  Script to help with submitting timesheets in Xero
// @author       mirogta
// @license      MIT
// @homepageURL  https://github.com/mirogta/tampermonkey-xero-timesheets
// @match        https://projects.xero.com/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_notification
// @grant        GM.notification
// @run-at       document-end
// @compatible   firefox >=39
// @compatible   chrome >=42
// ==/UserScript==
// ==OpenUserJS==
// @author mirogta
// @collaborator username
// ==/OpenUserJS==

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

// Greasemonkey 4 polyfils
// src: https://www.greasespot.net/2017/09/greasemonkey-4-for-script-authors.html
"undefined"==typeof GM&&(this.GM={}),"undefined"==typeof GM_addStyle&&(this.GM_addStyle=(e=>{"use strict";let t=document.getElementsByTagName("head")[0];if(t){let n=document.createElement("style");return n.setAttribute("type","text/css"),n.textContent=e,t.appendChild(n),n}return null})),"undefined"==typeof GM_registerMenuCommand&&(this.GM_registerMenuCommand=((e,t,n)=>{if(!document.body)return void("loading"===document.readyState&&document.documentElement&&"html"===document.documentElement.localName?new MutationObserver((o,u)=>{document.body&&(u.disconnect(),GM_registerMenuCommand(e,t,n))}).observe(document.documentElement,{childList:!0}):console.error("GM_registerMenuCommand got no body."));let o=document.body.getAttribute("contextmenu"),u=o?document.querySelector("menu#"+o):null;u||((u=document.createElement("menu")).setAttribute("id","gm-registered-menu"),u.setAttribute("type","context"),document.body.appendChild(u),document.body.setAttribute("contextmenu","gm-registered-menu"));let d=document.createElement("menuitem");d.textContent=e,d.addEventListener("click",t,!0),u.appendChild(d)})),"undefined"==typeof GM_getResourceText&&(this.GM_getResourceText=(e=>{"use strict";return GM.getResourceUrl(e).then(e=>fetch(e)).then(e=>e.text()).catch(function(e){return GM.log("Request failed",e),null})})),Object.entries({log:console.log.bind(console),info:GM_info}).forEach(([e,t])=>{t&&void 0===GM[e]&&(GM[e]=t)}),Object.entries({GM_addStyle:"addStyle",GM_deleteValue:"deleteValue",GM_getResourceURL:"getResourceUrl",GM_getValue:"getValue",GM_listValues:"listValues",GM_notification:"notification",GM_openInTab:"openInTab",GM_registerMenuCommand:"registerMenuCommand",GM_setClipboard:"setClipboard",GM_setValue:"setValue",GM_xmlhttpRequest:"xmlHttpRequest",GM_getResourceText:"getResourceText"}).forEach(([e,t])=>{let n=this[e];n&&void 0===GM[t]&&(GM[t]=function(...e){return new Promise((t,o)=>{try{t(n.apply(this,e))}catch(e){o(e)}})})});

// Embedded IntroJS minified code
// src: https://github.com/usablica/intro.js/blob/master/minified/intro.min.js
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t(),module.exports.introJs=function(){return console.warn('Deprecated: please use require("intro.js") directly, instead of the introJs method of the function'),t().apply(this,arguments)};else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).introJs=t()}}(function(){function n(t){this._targetElement=t,this._introItems=[],this._options={nextLabel:"Next &rarr;",prevLabel:"&larr; Back",skipLabel:"Skip",doneLabel:"Done",hidePrev:!1,hideNext:!1,tooltipPosition:"bottom",tooltipClass:"",highlightClass:"",exitOnEsc:!0,exitOnOverlayClick:!0,showStepNumbers:!0,keyboardNavigation:!0,showButtons:!0,showBullets:!0,showProgress:!1,scrollToElement:!0,scrollTo:"element",scrollPadding:30,overlayOpacity:.8,positionPrecedence:["bottom","top","right","left"],disableInteraction:!1,helperElementPadding:10,hintPosition:"top-middle",hintButtonLabel:"Got it",hintAnimation:!0,buttonClass:"introjs-button"}}function e(t,i){var e=t.querySelectorAll("*[data-intro]"),n=[];if(this._options.steps)B(this._options.steps,function(t){var e=h(t);if(e.step=n.length+1,"string"==typeof e.element&&(e.element=document.querySelector(e.element)),void 0===e.element||null===e.element){var i=document.querySelector(".introjsFloatingElement");null===i&&((i=document.createElement("div")).className="introjsFloatingElement",document.body.appendChild(i)),e.element=i,e.position="floating"}e.scrollTo=e.scrollTo||this._options.scrollTo,void 0===e.disableInteraction&&(e.disableInteraction=this._options.disableInteraction),null!==e.element&&n.push(e)}.bind(this));else{var o;if(e.length<1)return!1;B(e,function(t){if((!i||t.getAttribute("data-intro-group")===i)&&"none"!==t.style.display){var e=parseInt(t.getAttribute("data-step"),10);o=void 0!==t.getAttribute("data-disable-interaction")?!!t.getAttribute("data-disable-interaction"):this._options.disableInteraction,0<e&&(n[e-1]={element:t,intro:t.getAttribute("data-intro"),step:parseInt(t.getAttribute("data-step"),10),tooltipClass:t.getAttribute("data-tooltipclass"),highlightClass:t.getAttribute("data-highlightclass"),position:t.getAttribute("data-position")||this._options.tooltipPosition,scrollTo:t.getAttribute("data-scrollto")||this._options.scrollTo,disableInteraction:o})}}.bind(this));var s=0;B(e,function(t){if((!i||t.getAttribute("data-intro-group")===i)&&null===t.getAttribute("data-step")){for(;void 0!==n[s];)s++;o=void 0!==t.getAttribute("data-disable-interaction")?!!t.getAttribute("data-disable-interaction"):this._options.disableInteraction,n[s]={element:t,intro:t.getAttribute("data-intro"),step:s+1,tooltipClass:t.getAttribute("data-tooltipclass"),highlightClass:t.getAttribute("data-highlightclass"),position:t.getAttribute("data-position")||this._options.tooltipPosition,scrollTo:t.getAttribute("data-scrollto")||this._options.scrollTo,disableInteraction:o}}}.bind(this))}for(var l=[],r=0;r<n.length;r++)n[r]&&l.push(n[r]);return(n=l).sort(function(t,e){return t.step-e.step}),this._introItems=n,function(t){var e=document.createElement("div"),i="",n=this;if(e.className="introjs-overlay",t.tagName&&"body"!==t.tagName.toLowerCase()){var o=k(t);o&&(i+="width: "+o.width+"px; height:"+o.height+"px; top:"+o.top+"px;left: "+o.left+"px;",e.style.cssText=i)}else i+="top: 0;bottom: 0; left: 0;right: 0;position: fixed;",e.style.cssText=i;return t.appendChild(e),e.onclick=function(){!0===n._options.exitOnOverlayClick&&A.call(n,t)},window.setTimeout(function(){i+="opacity: "+n._options.overlayOpacity.toString()+";",e.style.cssText=i},10),!0}.call(this,t)&&(E.call(this),this._options.keyboardNavigation&&u.on(window,"keydown",c,this,!0),u.on(window,"resize",a,this,!0)),!1}function a(){this.refresh.call(this)}function c(t){var e=null===t.code?t.which:t.code;if(null===e&&(e=null===t.charCode?t.keyCode:t.charCode),"Escape"!==e&&27!==e||!0!==this._options.exitOnEsc){if("ArrowLeft"===e||37===e)N.call(this);else if("ArrowRight"===e||39===e)E.call(this);else if("Enter"===e||13===e){var i=t.target||t.srcElement;i&&i.className.match("introjs-prevbutton")?N.call(this):i&&i.className.match("introjs-skipbutton")?(this._introItems.length-1===this._currentStep&&"function"==typeof this._introCompleteCallback&&this._introCompleteCallback.call(this),A.call(this,this._targetElement)):i&&i.getAttribute("data-stepnumber")?i.click():E.call(this),t.preventDefault?t.preventDefault():t.returnValue=!1}}else A.call(this,this._targetElement)}function h(t){if(null===t||"object"!=typeof t||void 0!==t.nodeType)return t;var e={};for(var i in t)void 0!==window.jQuery&&t[i]instanceof window.jQuery?e[i]=t[i]:e[i]=h(t[i]);return e}function E(){this._direction="forward",void 0!==this._currentStepNumber&&B(this._introItems,function(t,e){t.step===this._currentStepNumber&&(this._currentStep=e-1,this._currentStepNumber=void 0)}.bind(this)),void 0===this._currentStep?this._currentStep=0:++this._currentStep;var t=this._introItems[this._currentStep],e=!0;return void 0!==this._introBeforeChangeCallback&&(e=this._introBeforeChangeCallback.call(this,t.element)),!1===e?(--this._currentStep,!1):this._introItems.length<=this._currentStep?("function"==typeof this._introCompleteCallback&&this._introCompleteCallback.call(this),void A.call(this,this._targetElement)):void i.call(this,t)}function N(){if(this._direction="backward",0===this._currentStep)return!1;--this._currentStep;var t=this._introItems[this._currentStep],e=!0;if(void 0!==this._introBeforeChangeCallback&&(e=this._introBeforeChangeCallback.call(this,t.element)),!1===e)return++this._currentStep,!1;i.call(this,t)}function A(t,e){var i=!0;if(void 0!==this._introBeforeExitCallback&&(i=this._introBeforeExitCallback.call(this)),e||!1!==i){var n=t.querySelectorAll(".introjs-overlay");n&&n.length&&B(n,function(t){t.style.opacity=0,window.setTimeout(function(){this.parentNode&&this.parentNode.removeChild(this)}.bind(t),500)}.bind(this));var o=t.querySelector(".introjs-helperLayer");o&&o.parentNode.removeChild(o);var s=t.querySelector(".introjs-tooltipReferenceLayer");s&&s.parentNode.removeChild(s);var l=t.querySelector(".introjs-disableInteraction");l&&l.parentNode.removeChild(l);var r=document.querySelector(".introjsFloatingElement");r&&r.parentNode.removeChild(r),q(),B(document.querySelectorAll(".introjs-fixParent"),function(t){O(t,/introjs-fixParent/g)}),u.off(window,"keydown",c,this,!0),u.off(window,"resize",a,this,!0),void 0!==this._introExitCallback&&this._introExitCallback.call(this),this._currentStep=void 0}}function L(t,e,i,n,o){var s,l,r,a,c,h="";if(o=o||!1,e.style.top=null,e.style.right=null,e.style.bottom=null,e.style.left=null,e.style.marginLeft=null,e.style.marginTop=null,i.style.display="inherit",null!=n&&(n.style.top=null,n.style.left=null),this._introItems[this._currentStep])switch(h="string"==typeof(s=this._introItems[this._currentStep]).tooltipClass?s.tooltipClass:this._options.tooltipClass,e.className=("introjs-tooltip "+h).replace(/^\s+|\s+$/g,""),e.setAttribute("role","dialog"),"floating"!==(c=this._introItems[this._currentStep].position)&&(c=function(t,e,i){var n=this._options.positionPrecedence.slice(),o=b(),s=k(e).height+10,l=k(e).width+20,r=t.getBoundingClientRect(),a="floating";r.bottom+s+s>o.height&&m(n,"bottom");r.top-s<0&&m(n,"top");r.right+l>o.width&&m(n,"right");r.left-l<0&&m(n,"left");var c=(h=i||"",u=h.indexOf("-"),-1!==u?h.substr(u):"");var h,u;i&&(i=i.split("-")[0]);n.length&&(a="auto"!==i&&-1<n.indexOf(i)?i:n[0]);-1!==["top","bottom"].indexOf(a)&&(a+=function(t,e,i,n){var o=e/2,s=Math.min(i.width,window.screen.width),l=["-left-aligned","-middle-aligned","-right-aligned"],r="";s-t<e&&m(l,"-left-aligned");(t<o||s-t<o)&&m(l,"-middle-aligned");t<e&&m(l,"-right-aligned");r=l.length?-1!==l.indexOf(n)?n:l[0]:"-middle-aligned";return r}(r.left,l,o,c));return a}.call(this,t,e,c)),r=k(t),l=k(e),a=b(),H(e,"introjs-"+c),c){case"top-right-aligned":i.className="introjs-arrow bottom-right";var u=0;f(r,u,l,e),e.style.bottom=r.height+20+"px";break;case"top-middle-aligned":i.className="introjs-arrow bottom-middle";var d=r.width/2-l.width/2;o&&(d+=5),f(r,d,l,e)&&(e.style.right=null,p(r,d,l,a,e)),e.style.bottom=r.height+20+"px";break;case"top-left-aligned":case"top":i.className="introjs-arrow bottom",p(r,o?0:15,l,a,e),e.style.bottom=r.height+20+"px";break;case"right":e.style.left=r.width+20+"px",r.top+l.height>a.height?(i.className="introjs-arrow left-bottom",e.style.top="-"+(l.height-r.height-20)+"px"):i.className="introjs-arrow left";break;case"left":o||!0!==this._options.showStepNumbers||(e.style.top="15px"),r.top+l.height>a.height?(e.style.top="-"+(l.height-r.height-20)+"px",i.className="introjs-arrow right-bottom"):i.className="introjs-arrow right",e.style.right=r.width+20+"px";break;case"floating":i.style.display="none",e.style.left="50%",e.style.top="50%",e.style.marginLeft="-"+l.width/2+"px",e.style.marginTop="-"+l.height/2+"px",null!=n&&(n.style.left="-"+(l.width/2+18)+"px",n.style.top="-"+(l.height/2+18)+"px");break;case"bottom-right-aligned":i.className="introjs-arrow top-right",f(r,u=0,l,e),e.style.top=r.height+20+"px";break;case"bottom-middle-aligned":i.className="introjs-arrow top-middle",d=r.width/2-l.width/2,o&&(d+=5),f(r,d,l,e)&&(e.style.right=null,p(r,d,l,a,e)),e.style.top=r.height+20+"px";break;default:i.className="introjs-arrow top",p(r,0,l,a,e),e.style.top=r.height+20+"px"}}function p(t,e,i,n,o){return t.left+e+i.width>n.width?(o.style.left=n.width-i.width-t.left+"px",!1):(o.style.left=e+"px",!0)}function f(t,e,i,n){return t.left+t.width-e-i.width<0?(n.style.left=-t.left+"px",!1):(n.style.right=e+"px",!0)}function m(t,e){-1<t.indexOf(e)&&t.splice(t.indexOf(e),1)}function T(t){if(t){if(!this._introItems[this._currentStep])return;var e=this._introItems[this._currentStep],i=k(e.element),n=this._options.helperElementPadding;d(e.element)?H(t,"introjs-fixedTooltip"):O(t,"introjs-fixedTooltip"),"floating"===e.position&&(n=0),t.style.cssText="width: "+(i.width+n)+"px; height:"+(i.height+n)+"px; top:"+(i.top-n/2)+"px;left: "+(i.left-n/2)+"px;"}}function I(t){t.setAttribute("role","button"),t.tabIndex=0}function i(o){void 0!==this._introChangeCallback&&this._introChangeCallback.call(this,o.element);var t,e,i,n,s=this,l=document.querySelector(".introjs-helperLayer"),r=document.querySelector(".introjs-tooltipReferenceLayer"),a="introjs-helperLayer";if("string"==typeof o.highlightClass&&(a+=" "+o.highlightClass),"string"==typeof this._options.highlightClass&&(a+=" "+this._options.highlightClass),null!==l){var c=r.querySelector(".introjs-helperNumberLayer"),h=r.querySelector(".introjs-tooltiptext"),u=r.querySelector(".introjs-arrow"),d=r.querySelector(".introjs-tooltip");if(i=r.querySelector(".introjs-skipbutton"),e=r.querySelector(".introjs-prevbutton"),t=r.querySelector(".introjs-nextbutton"),l.className=a,d.style.opacity=0,d.style.display="none",null!==c){var p=this._introItems[0<=o.step-2?o.step-2:0];(null!==p&&"forward"===this._direction&&"floating"===p.position||"backward"===this._direction&&"floating"===o.position)&&(c.style.opacity=0)}(n=R(o.element))!==document.body&&V(n,o.element),T.call(s,l),T.call(s,r),B(document.querySelectorAll(".introjs-fixParent"),function(t){O(t,/introjs-fixParent/g)}),q(),s._lastShowElementTimer&&window.clearTimeout(s._lastShowElementTimer),s._lastShowElementTimer=window.setTimeout(function(){null!==c&&(c.innerHTML=o.step),h.innerHTML=o.intro,d.style.display="block",L.call(s,o.element,d,u,c),s._options.showBullets&&(r.querySelector(".introjs-bullets li > a.active").className="",r.querySelector('.introjs-bullets li > a[data-stepnumber="'+o.step+'"]').className="active"),r.querySelector(".introjs-progress .introjs-progressbar").style.cssText="width:"+z.call(s)+"%;",r.querySelector(".introjs-progress .introjs-progressbar").setAttribute("aria-valuenow",z.call(s)),d.style.opacity=1,c&&(c.style.opacity=1),null!=i&&/introjs-donebutton/gi.test(i.className)?i.focus():null!=t&&t.focus(),P.call(s,o.scrollTo,o,h)},350)}else{var f=document.createElement("div"),m=document.createElement("div"),b=document.createElement("div"),g=document.createElement("div"),y=document.createElement("div"),v=document.createElement("div"),_=document.createElement("div"),w=document.createElement("div");f.className=a,m.className="introjs-tooltipReferenceLayer",(n=R(o.element))!==document.body&&V(n,o.element),T.call(s,f),T.call(s,m),this._targetElement.appendChild(f),this._targetElement.appendChild(m),b.className="introjs-arrow",y.className="introjs-tooltiptext",y.innerHTML=o.intro,!(v.className="introjs-bullets")===this._options.showBullets&&(v.style.display="none");var C=document.createElement("ul");C.setAttribute("role","tablist");var j=function(){s.goToStep(this.getAttribute("data-stepnumber"))};B(this._introItems,function(t,e){var i=document.createElement("li"),n=document.createElement("a");i.setAttribute("role","presentation"),n.setAttribute("role","tab"),n.onclick=j,e===o.step-1&&(n.className="active"),I(n),n.innerHTML="&nbsp;",n.setAttribute("data-stepnumber",t.step),i.appendChild(n),C.appendChild(i)}),v.appendChild(C),!(_.className="introjs-progress")===this._options.showProgress&&(_.style.display="none");var k=document.createElement("div");k.className="introjs-progressbar",k.setAttribute("role","progress"),k.setAttribute("aria-valuemin",0),k.setAttribute("aria-valuemax",100),k.setAttribute("aria-valuenow",z.call(this)),k.style.cssText="width:"+z.call(this)+"%;",_.appendChild(k),!(w.className="introjs-tooltipbuttons")===this._options.showButtons&&(w.style.display="none"),g.className="introjs-tooltip",g.appendChild(y),g.appendChild(v),g.appendChild(_);var x=document.createElement("span");!0===this._options.showStepNumbers&&(x.className="introjs-helperNumberLayer",x.innerHTML=o.step,m.appendChild(x)),g.appendChild(b),m.appendChild(g),(t=document.createElement("a")).onclick=function(){s._introItems.length-1!==s._currentStep&&E.call(s)},I(t),t.innerHTML=this._options.nextLabel,(e=document.createElement("a")).onclick=function(){0!==s._currentStep&&N.call(s)},I(e),e.innerHTML=this._options.prevLabel,(i=document.createElement("a")).className=this._options.buttonClass+" introjs-skipbutton ",I(i),i.innerHTML=this._options.skipLabel,i.onclick=function(){s._introItems.length-1===s._currentStep&&"function"==typeof s._introCompleteCallback&&s._introCompleteCallback.call(s),s._introItems.length-1!==s._currentStep&&"function"==typeof s._introExitCallback&&s._introExitCallback.call(s),"function"==typeof s._introSkipCallback&&s._introSkipCallback.call(s),A.call(s,s._targetElement)},w.appendChild(i),1<this._introItems.length&&(w.appendChild(e),w.appendChild(t)),g.appendChild(w),L.call(s,o.element,g,b,x),P.call(this,o.scrollTo,o,g)}var S=s._targetElement.querySelector(".introjs-disableInteraction");S&&S.parentNode.removeChild(S),o.disableInteraction&&function(){var t=document.querySelector(".introjs-disableInteraction");null===t&&((t=document.createElement("div")).className="introjs-disableInteraction",this._targetElement.appendChild(t)),T.call(this,t)}.call(s),0===this._currentStep&&1<this._introItems.length?(null!=i&&(i.className=this._options.buttonClass+" introjs-skipbutton"),null!=t&&(t.className=this._options.buttonClass+" introjs-nextbutton"),!0===this._options.hidePrev?(null!=e&&(e.className=this._options.buttonClass+" introjs-prevbutton introjs-hidden"),null!=t&&H(t,"introjs-fullbutton")):null!=e&&(e.className=this._options.buttonClass+" introjs-prevbutton introjs-disabled"),null!=i&&(i.innerHTML=this._options.skipLabel)):this._introItems.length-1===this._currentStep||1===this._introItems.length?(null!=i&&(i.innerHTML=this._options.doneLabel,H(i,"introjs-donebutton")),null!=e&&(e.className=this._options.buttonClass+" introjs-prevbutton"),!0===this._options.hideNext?(null!=t&&(t.className=this._options.buttonClass+" introjs-nextbutton introjs-hidden"),null!=e&&H(e,"introjs-fullbutton")):null!=t&&(t.className=this._options.buttonClass+" introjs-nextbutton introjs-disabled")):(null!=i&&(i.className=this._options.buttonClass+" introjs-skipbutton"),null!=e&&(e.className=this._options.buttonClass+" introjs-prevbutton"),null!=t&&(t.className=this._options.buttonClass+" introjs-nextbutton"),null!=i&&(i.innerHTML=this._options.skipLabel)),e.setAttribute("role","button"),t.setAttribute("role","button"),i.setAttribute("role","button"),null!=t&&t.focus(),function(t){var e;if(t.element instanceof SVGElement)for(e=t.element.parentNode;null!==t.element.parentNode&&e.tagName&&"body"!==e.tagName.toLowerCase();)"svg"===e.tagName.toLowerCase()&&H(e,"introjs-showElement introjs-relativePosition"),e=e.parentNode;H(t.element,"introjs-showElement");var i=M(t.element,"position");"absolute"!==i&&"relative"!==i&&"fixed"!==i&&H(t.element,"introjs-relativePosition");e=t.element.parentNode;for(;null!==e&&e.tagName&&"body"!==e.tagName.toLowerCase();){var n=M(e,"z-index"),o=parseFloat(M(e,"opacity")),s=M(e,"transform")||M(e,"-webkit-transform")||M(e,"-moz-transform")||M(e,"-ms-transform")||M(e,"-o-transform");(/[0-9]+/.test(n)||o<1||"none"!==s&&void 0!==s)&&H(e,"introjs-fixParent"),e=e.parentNode}}(o),void 0!==this._introAfterChangeCallback&&this._introAfterChangeCallback.call(this,o.element)}function P(t,e,i){var n,o,s;if("off"!==t&&(this._options.scrollToElement&&(n="tooltip"===t?i.getBoundingClientRect():e.element.getBoundingClientRect(),o=e.element,!(0<=(s=o.getBoundingClientRect()).top&&0<=s.left&&s.bottom+80<=window.innerHeight&&s.right<=window.innerWidth)))){var l=b().height;n.bottom-(n.bottom-n.top)<0||e.element.clientHeight>l?window.scrollBy(0,n.top-(l/2-n.height/2)-this._options.scrollPadding):window.scrollBy(0,n.top-(l/2-n.height/2)+this._options.scrollPadding)}}function q(){B(document.querySelectorAll(".introjs-showElement"),function(t){O(t,/introjs-[a-zA-Z]+/g)})}function B(t,e,i){if(t)for(var n=0,o=t.length;n<o;n++)e(t[n],n);"function"==typeof i&&i()}var o,s=(o={},function(t,e){return o[e=e||"introjs-stamp"]=o[e]||0,void 0===t[e]&&(t[e]=o[e]++),t[e]}),u=new function(){var r="introjs_event";this._id=function(t,e,i,n){return e+s(i)+(n?"_"+s(n):"")},this.on=function(e,t,i,n,o){var s=this._id.apply(this,arguments),l=function(t){return i.call(n||e,t||window.event)};"addEventListener"in e?e.addEventListener(t,l,o):"attachEvent"in e&&e.attachEvent("on"+t,l),e[r]=e[r]||{},e[r][s]=l},this.off=function(t,e,i,n,o){var s=this._id.apply(this,arguments),l=t[r]&&t[r][s];l&&("removeEventListener"in t?t.removeEventListener(e,l,o):"detachEvent"in t&&t.detachEvent("on"+e,l),t[r][s]=null)}};function H(e,t){if(e instanceof SVGElement){var i=e.getAttribute("class")||"";e.setAttribute("class",i+" "+t)}else{if(void 0!==e.classList)B(t.split(" "),function(t){e.classList.add(t)});else e.className.match(t)||(e.className+=" "+t)}}function O(t,e){if(t instanceof SVGElement){var i=t.getAttribute("class")||"";t.setAttribute("class",i.replace(e,"").replace(/^\s+|\s+$/g,""))}else t.className=t.className.replace(e,"").replace(/^\s+|\s+$/g,"")}function M(t,e){var i="";return t.currentStyle?i=t.currentStyle[e]:document.defaultView&&document.defaultView.getComputedStyle&&(i=document.defaultView.getComputedStyle(t,null).getPropertyValue(e)),i&&i.toLowerCase?i.toLowerCase():i}function d(t){var e=t.parentNode;return!(!e||"HTML"===e.nodeName)&&("fixed"===M(t,"position")||d(e))}function b(){if(void 0!==window.innerWidth)return{width:window.innerWidth,height:window.innerHeight};var t=document.documentElement;return{width:t.clientWidth,height:t.clientHeight}}function g(){var t=document.querySelector(".introjs-hintReference");if(t){var e=t.getAttribute("data-step");return t.parentNode.removeChild(t),e}}function l(t){if(this._introItems=[],this._options.hints)B(this._options.hints,function(t){var e=h(t);"string"==typeof e.element&&(e.element=document.querySelector(e.element)),e.hintPosition=e.hintPosition||this._options.hintPosition,e.hintAnimation=e.hintAnimation||this._options.hintAnimation,null!==e.element&&this._introItems.push(e)}.bind(this));else{var e=t.querySelectorAll("*[data-hint]");if(!e||!e.length)return!1;B(e,function(t){var e=t.getAttribute("data-hintanimation");e=e?"true"===e:this._options.hintAnimation,this._introItems.push({element:t,hint:t.getAttribute("data-hint"),hintPosition:t.getAttribute("data-hintposition")||this._options.hintPosition,hintAnimation:e,tooltipClass:t.getAttribute("data-tooltipclass"),position:t.getAttribute("data-position")||this._options.tooltipPosition})}.bind(this))}(function(){var l=this,r=document.querySelector(".introjs-hints");null===r&&((r=document.createElement("div")).className="introjs-hints");B(this._introItems,function(t,e){if(!document.querySelector('.introjs-hint[data-step="'+e+'"]')){var i,n=document.createElement("a");I(n),n.onclick=(i=e,function(t){var e=t||window.event;e.stopPropagation&&e.stopPropagation(),null!==e.cancelBubble&&(e.cancelBubble=!0),j.call(l,i)}),n.className="introjs-hint",t.hintAnimation||H(n,"introjs-hint-no-anim"),d(t.element)&&H(n,"introjs-fixedhint");var o=document.createElement("div");o.className="introjs-hint-dot";var s=document.createElement("div");s.className="introjs-hint-pulse",n.appendChild(o),n.appendChild(s),n.setAttribute("data-step",e),t.targetElement=t.element,t.element=n,C.call(this,t.hintPosition,n,t.targetElement),r.appendChild(n)}}.bind(this)),document.body.appendChild(r),void 0!==this._hintsAddedCallback&&this._hintsAddedCallback.call(this)}).call(this),u.on(document,"click",g,this,!1),u.on(window,"resize",r,this,!0)}function r(){B(this._introItems,function(t){void 0!==t.targetElement&&C.call(this,t.hintPosition,t.element,t.targetElement)}.bind(this))}function y(t){var e=document.querySelector(".introjs-hints");return e?e.querySelectorAll(t):[]}function v(t){var e=y('.introjs-hint[data-step="'+t+'"]')[0];g.call(this),e&&H(e,"introjs-hidehint"),void 0!==this._hintCloseCallback&&this._hintCloseCallback.call(this,t)}function _(t){var e=y('.introjs-hint[data-step="'+t+'"]')[0];e&&O(e,/introjs-hidehint/g)}function w(t){var e=y('.introjs-hint[data-step="'+t+'"]')[0];e&&e.parentNode.removeChild(e)}function C(t,e,i){var n=k.call(this,i);switch(t){default:case"top-left":e.style.left=n.left+"px",e.style.top=n.top+"px";break;case"top-right":e.style.left=n.left+n.width-20+"px",e.style.top=n.top+"px";break;case"bottom-left":e.style.left=n.left+"px",e.style.top=n.top+n.height-20+"px";break;case"bottom-right":e.style.left=n.left+n.width-20+"px",e.style.top=n.top+n.height-20+"px";break;case"middle-left":e.style.left=n.left+"px",e.style.top=n.top+(n.height-20)/2+"px";break;case"middle-right":e.style.left=n.left+n.width-20+"px",e.style.top=n.top+(n.height-20)/2+"px";break;case"middle-middle":e.style.left=n.left+(n.width-20)/2+"px",e.style.top=n.top+(n.height-20)/2+"px";break;case"bottom-middle":e.style.left=n.left+(n.width-20)/2+"px",e.style.top=n.top+n.height-20+"px";break;case"top-middle":e.style.left=n.left+(n.width-20)/2+"px",e.style.top=n.top+"px"}}function j(t){var e=document.querySelector('.introjs-hint[data-step="'+t+'"]'),i=this._introItems[t];void 0!==this._hintClickCallback&&this._hintClickCallback.call(this,e,i,t);var n=g.call(this);if(parseInt(n,10)!==t){var o=document.createElement("div"),s=document.createElement("div"),l=document.createElement("div"),r=document.createElement("div");o.className="introjs-tooltip",o.onclick=function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},s.className="introjs-tooltiptext";var a=document.createElement("p");a.innerHTML=i.hint;var c=document.createElement("a");c.className=this._options.buttonClass,c.setAttribute("role","button"),c.innerHTML=this._options.hintButtonLabel,c.onclick=v.bind(this,t),s.appendChild(a),s.appendChild(c),l.className="introjs-arrow",o.appendChild(l),o.appendChild(s),this._currentStep=e.getAttribute("data-step"),r.className="introjs-tooltipReferenceLayer introjs-hintReference",r.setAttribute("data-step",e.getAttribute("data-step")),T.call(this,r),r.appendChild(o),document.body.appendChild(r),L.call(this,e,o,l,null,!0)}}function k(t){var e=document.body,i=document.documentElement,n=window.pageYOffset||i.scrollTop||e.scrollTop,o=window.pageXOffset||i.scrollLeft||e.scrollLeft,s=t.getBoundingClientRect();return{top:s.top+n,width:s.width,height:s.height,left:s.left+o}}function R(t){var e=window.getComputedStyle(t),i="absolute"===e.position,n=/(auto|scroll)/;if("fixed"===e.position)return document.body;for(var o=t;o=o.parentElement;)if(e=window.getComputedStyle(o),(!i||"static"!==e.position)&&n.test(e.overflow+e.overflowY+e.overflowX))return o;return document.body}function V(t,e){t.scrollTop=e.offsetTop-t.offsetTop}function z(){return parseInt(this._currentStep+1,10)/this._introItems.length*100}var x=function(t){var e;if("object"==typeof t)e=new n(t);else if("string"==typeof t){var i=document.querySelector(t);if(!i)throw new Error("There is no element with given selector.");e=new n(i)}else e=new n(document.body);return x.instances[s(e,"introjs-instance")]=e};return x.version="2.9.3",x.instances={},x.fn=n.prototype={clone:function(){return new n(this)},setOption:function(t,e){return this._options[t]=e,this},setOptions:function(t){return this._options=function(t,e){var i,n={};for(i in t)n[i]=t[i];for(i in e)n[i]=e[i];return n}(this._options,t),this},start:function(t){return e.call(this,this._targetElement,t),this},goToStep:function(t){return function(t){this._currentStep=t-2,void 0!==this._introItems&&E.call(this)}.call(this,t),this},addStep:function(t){return this._options.steps||(this._options.steps=[]),this._options.steps.push(t),this},addSteps:function(t){if(t.length){for(var e=0;e<t.length;e++)this.addStep(t[e]);return this}},goToStepNumber:function(t){return function(t){this._currentStepNumber=t,void 0!==this._introItems&&E.call(this)}.call(this,t),this},nextStep:function(){return E.call(this),this},previousStep:function(){return N.call(this),this},exit:function(t){return A.call(this,this._targetElement,t),this},refresh:function(){return function(){if(T.call(this,document.querySelector(".introjs-helperLayer")),T.call(this,document.querySelector(".introjs-tooltipReferenceLayer")),T.call(this,document.querySelector(".introjs-disableInteraction")),void 0!==this._currentStep&&null!==this._currentStep){var t=document.querySelector(".introjs-helperNumberLayer"),e=document.querySelector(".introjs-arrow"),i=document.querySelector(".introjs-tooltip");L.call(this,this._introItems[this._currentStep].element,i,e,t)}return r.call(this),this}.call(this),this},onbeforechange:function(t){if("function"!=typeof t)throw new Error("Provided callback for onbeforechange was not a function");return this._introBeforeChangeCallback=t,this},onchange:function(t){if("function"!=typeof t)throw new Error("Provided callback for onchange was not a function.");return this._introChangeCallback=t,this},onafterchange:function(t){if("function"!=typeof t)throw new Error("Provided callback for onafterchange was not a function");return this._introAfterChangeCallback=t,this},oncomplete:function(t){if("function"!=typeof t)throw new Error("Provided callback for oncomplete was not a function.");return this._introCompleteCallback=t,this},onhintsadded:function(t){if("function"!=typeof t)throw new Error("Provided callback for onhintsadded was not a function.");return this._hintsAddedCallback=t,this},onhintclick:function(t){if("function"!=typeof t)throw new Error("Provided callback for onhintclick was not a function.");return this._hintClickCallback=t,this},onhintclose:function(t){if("function"!=typeof t)throw new Error("Provided callback for onhintclose was not a function.");return this._hintCloseCallback=t,this},onexit:function(t){if("function"!=typeof t)throw new Error("Provided callback for onexit was not a function.");return this._introExitCallback=t,this},onskip:function(t){if("function"!=typeof t)throw new Error("Provided callback for onskip was not a function.");return this._introSkipCallback=t,this},onbeforeexit:function(t){if("function"!=typeof t)throw new Error("Provided callback for onbeforeexit was not a function.");return this._introBeforeExitCallback=t,this},addHints:function(){return l.call(this,this._targetElement),this},hideHint:function(t){return v.call(this,t),this},hideHints:function(){return function(){B(y(".introjs-hint"),function(t){v.call(this,t.getAttribute("data-step"))}.bind(this))}.call(this),this},showHint:function(t){return _.call(this,t),this},showHints:function(){return function(){var t=y(".introjs-hint");t&&t.length?B(t,function(t){_.call(this,t.getAttribute("data-step"))}.bind(this)):l.call(this,this._targetElement)}.call(this),this},removeHints:function(){return function(){B(y(".introjs-hint"),function(t){w.call(this,t.getAttribute("data-step"))}.bind(this))}.call(this),this},removeHint:function(t){return w.call(this,t),this},showHintDialog:function(t){return j.call(this,t),this}},x});
// src: https://github.com/usablica/intro.js/blob/master/minified/introjs.min.css
GM_addStyle(`
.introjs-overlay{position:absolute;box-sizing:content-box;z-index:999999;background-color:#000;opacity:0;background:-moz-radial-gradient(center,ellipse farthest-corner,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-webkit-gradient(radial,center center,0,center center,100%,color-stop(0,rgba(0,0,0,.4)),color-stop(100%,rgba(0,0,0,.9)));background:-webkit-radial-gradient(center,ellipse farthest-corner,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-o-radial-gradient(center,ellipse farthest-corner,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:-ms-radial-gradient(center,ellipse farthest-corner,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);background:radial-gradient(center,ellipse farthest-corner,rgba(0,0,0,.4) 0,rgba(0,0,0,.9) 100%);-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out}.introjs-fixParent{z-index:auto!important;opacity:1!important;-webkit-transform:none!important;-moz-transform:none!important;-ms-transform:none!important;-o-transform:none!important;transform:none!important}.introjs-showElement,tr.introjs-showElement>td,tr.introjs-showElement>th{z-index:9999999!important}.introjs-disableInteraction{z-index:99999999!important;position:absolute;background-color:#fff;opacity:0}.introjs-relativePosition,tr.introjs-showElement>td,tr.introjs-showElement>th{position:relative}.introjs-helperLayer{box-sizing:content-box;position:absolute;z-index:9999998;background-color:#fff;background-color:rgba(255,255,255,.9);border:1px solid #777;border:1px solid rgba(0,0,0,.5);border-radius:4px;box-shadow:0 2px 15px rgba(0,0,0,.4);-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out}.introjs-tooltipReferenceLayer{box-sizing:content-box;position:absolute;visibility:hidden;z-index:100000000;background-color:transparent;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-ms-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out}.introjs-helperLayer *,.introjs-helperLayer :after,.introjs-helperLayer :before{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;-ms-box-sizing:content-box;-o-box-sizing:content-box;box-sizing:content-box}.introjs-helperNumberLayer{box-sizing:content-box;position:absolute;visibility:visible;top:-16px;left:-16px;z-index:9999999999!important;padding:2px;font-family:Arial,verdana,tahoma;font-size:13px;font-weight:700;color:#fff;text-align:center;text-shadow:1px 1px 1px rgba(0,0,0,.3);background:#ff3019;background:-webkit-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0,#ff3019),color-stop(100%,#cf0404));background:-moz-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-ms-linear-gradient(top,#ff3019 0,#cf0404 100%);background:-o-linear-gradient(top,#ff3019 0,#cf0404 100%);background:linear-gradient(to bottom,#ff3019 0,#cf0404 100%);width:20px;height:20px;line-height:20px;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 5px rgba(0,0,0,.4)}.introjs-arrow{border:5px solid transparent;content:'';position:absolute}.introjs-arrow.top{top:-10px;border-bottom-color:#fff}.introjs-arrow.top-right{top:-10px;right:10px;border-bottom-color:#fff}.introjs-arrow.top-middle{top:-10px;left:50%;margin-left:-5px;border-bottom-color:#fff}.introjs-arrow.right{right:-10px;top:10px;border-left-color:#fff}.introjs-arrow.right-bottom{bottom:10px;right:-10px;border-left-color:#fff}.introjs-arrow.bottom{bottom:-10px;border-top-color:#fff}.introjs-arrow.bottom-right{bottom:-10px;right:10px;border-top-color:#fff}.introjs-arrow.bottom-middle{bottom:-10px;left:50%;margin-left:-5px;border-top-color:#fff}.introjs-arrow.left{left:-10px;top:10px;border-right-color:#fff}.introjs-arrow.left-bottom{left:-10px;bottom:10px;border-right-color:#fff}.introjs-tooltip{box-sizing:content-box;position:absolute;visibility:visible;padding:10px;background-color:#fff;min-width:200px;max-width:300px;border-radius:3px;box-shadow:0 1px 10px rgba(0,0,0,.4);-webkit-transition:opacity .1s ease-out;-moz-transition:opacity .1s ease-out;-ms-transition:opacity .1s ease-out;-o-transition:opacity .1s ease-out;transition:opacity .1s ease-out}.introjs-tooltipbuttons{text-align:right;white-space:nowrap}.introjs-button{box-sizing:content-box;position:relative;overflow:visible;display:inline-block;padding:.3em .8em;border:1px solid #d4d4d4;margin:0;text-decoration:none;text-shadow:1px 1px 0 #fff;font:11px/normal sans-serif;color:#333;white-space:nowrap;cursor:pointer;outline:0;background-color:#ececec;background-image:-webkit-gradient(linear,0 0,0 100%,from(#f4f4f4),to(#ececec));background-image:-moz-linear-gradient(#f4f4f4,#ececec);background-image:-o-linear-gradient(#f4f4f4,#ececec);background-image:linear-gradient(#f4f4f4,#ececec);-webkit-background-clip:padding;-moz-background-clip:padding;-o-background-clip:padding-box;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em;zoom:1;margin-top:10px}.introjs-button:hover{border-color:#bcbcbc;text-decoration:none;box-shadow:0 1px 1px #e3e3e3}.introjs-button:active,.introjs-button:focus{background-image:-webkit-gradient(linear,0 0,0 100%,from(#ececec),to(#f4f4f4));background-image:-moz-linear-gradient(#ececec,#f4f4f4);background-image:-o-linear-gradient(#ececec,#f4f4f4);background-image:linear-gradient(#ececec,#f4f4f4)}.introjs-button::-moz-focus-inner{padding:0;border:0}.introjs-skipbutton{box-sizing:content-box;margin-right:5px;color:#7a7a7a}.introjs-prevbutton{-webkit-border-radius:.2em 0 0 .2em;-moz-border-radius:.2em 0 0 .2em;border-radius:.2em 0 0 .2em;border-right:none}.introjs-prevbutton.introjs-fullbutton{border:1px solid #d4d4d4;-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em}.introjs-nextbutton{-webkit-border-radius:0 .2em .2em 0;-moz-border-radius:0 .2em .2em 0;border-radius:0 .2em .2em 0}.introjs-nextbutton.introjs-fullbutton{-webkit-border-radius:.2em;-moz-border-radius:.2em;border-radius:.2em}.introjs-disabled,.introjs-disabled:focus,.introjs-disabled:hover{color:#9a9a9a;border-color:#d4d4d4;box-shadow:none;cursor:default;background-color:#f4f4f4;background-image:none;text-decoration:none}.introjs-hidden{display:none}.introjs-bullets{text-align:center}.introjs-bullets ul{box-sizing:content-box;clear:both;margin:15px auto 0;padding:0;display:inline-block}.introjs-bullets ul li{box-sizing:content-box;list-style:none;float:left;margin:0 2px}.introjs-bullets ul li a{box-sizing:content-box;display:block;width:6px;height:6px;background:#ccc;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;text-decoration:none;cursor:pointer}.introjs-bullets ul li a:hover{background:#999}.introjs-bullets ul li a.active{background:#999}.introjs-progress{box-sizing:content-box;overflow:hidden;height:10px;margin:10px 0 5px 0;border-radius:4px;background-color:#ecf0f1}.introjs-progressbar{box-sizing:content-box;float:left;width:0%;height:100%;font-size:10px;line-height:10px;text-align:center;background-color:#08c}.introjsFloatingElement{position:absolute;height:0;width:0;left:50%;top:50%}.introjs-fixedTooltip{position:fixed}.introjs-hint{box-sizing:content-box;position:absolute;background:0 0;width:20px;height:15px;cursor:pointer}.introjs-hint:focus{border:0;outline:0}.introjs-hidehint{display:none}.introjs-fixedhint{position:fixed}.introjs-hint:hover>.introjs-hint-pulse{border:5px solid rgba(60,60,60,.57)}.introjs-hint-pulse{box-sizing:content-box;width:10px;height:10px;border:5px solid rgba(60,60,60,.27);-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;background-color:rgba(136,136,136,.24);z-index:10;position:absolute;-webkit-transition:all .2s ease-out;-moz-transition:all .2s ease-out;-ms-transition:all .2s ease-out;-o-transition:all .2s ease-out;transition:all .2s ease-out}.introjs-hint-no-anim .introjs-hint-dot{-webkit-animation:none;-moz-animation:none;animation:none}.introjs-hint-dot{box-sizing:content-box;border:10px solid rgba(146,146,146,.36);background:0 0;-webkit-border-radius:60px;-moz-border-radius:60px;border-radius:60px;height:50px;width:50px;-webkit-animation:introjspulse 3s ease-out;-moz-animation:introjspulse 3s ease-out;animation:introjspulse 3s ease-out;-webkit-animation-iteration-count:infinite;-moz-animation-iteration-count:infinite;animation-iteration-count:infinite;position:absolute;top:-25px;left:-25px;z-index:1;opacity:0}@-webkit-keyframes introjspulse{0%{-webkit-transform:scale(0);opacity:0}25%{-webkit-transform:scale(0);opacity:.1}50%{-webkit-transform:scale(.1);opacity:.3}75%{-webkit-transform:scale(.5);opacity:.5}100%{-webkit-transform:scale(1);opacity:0}}@-moz-keyframes introjspulse{0%{-moz-transform:scale(0);opacity:0}25%{-moz-transform:scale(0);opacity:.1}50%{-moz-transform:scale(.1);opacity:.3}75%{-moz-transform:scale(.5);opacity:.5}100%{-moz-transform:scale(1);opacity:0}}@keyframes introjspulse{0%{transform:scale(0);opacity:0}25%{transform:scale(0);opacity:.1}50%{transform:scale(.1);opacity:.3}75%{transform:scale(.5);opacity:.5}100%{transform:scale(1);opacity:0}}
`);

// Common functions
(function() {
    'use strict';

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
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
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

    window._xero = window._xero || {};
    window._xero.waitForKeyElements = waitForKeyElements;
    window._xero.createElement = createElement;
})();


// My Time link
(function() {
    'use strict';

    const createElement = window._xero.createElement;

    const constants = {
        menuSelectedClass: 'xrh-tab--body-is-selected',
    };

    function addMyTimeLink() {
        console.log('- adding projects overlay');
        const menu = document.body.querySelector('.xrh-navigation');
        const link = createElement('<li class="xrh-tab" id="_link"><button type="button" class="xrh-focusable xrh-tab--body">My Time</button></li>');
        link.querySelector('button').addEventListener('click', navigateToMyTimeLink, false);
        menu.append(link);
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
        window._xero.showMyTime();
        document.location.hash = 'tampermonkey-my-time';
        const dataLoadedElement = document.body.querySelector('div[data-loaded]');
        if(dataLoadedElement) {
            dataLoadedElement.dataset.loaded = false;
        }
    }

    window._xero = window._xero || {};
    window._xero.addMyTimeLink = addMyTimeLink;
    window._xero.navigateToMyTimeLink = navigateToMyTimeLink;
})();

// Project stars
(function() {
    'use strict';

    const createElement = window._xero.createElement;

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
        const toggle = createElement('<div class="_projectStarToggle"><span class="_all">Show all projects</span><span class="_starred">Show starred projects</span></div>');
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

    window._xero = window._xero || {};
    window._xero.overlayProjects = overlayProjects;
})();

// My Time content
(function() {
    'use strict';

    const createElement = window._xero.createElement;

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
._tip { padding: 10px; font-size: 14px; }
._tip::before { content: " \\261e"; margin-right: 10px }

._intro ._timerecord:not([data-user-id="demo"]) { display: none }
.introjs-tooltipReferenceLayer, .introjs-tooltip { width: 360px; max-width: 360px; }
.introjs-tooltiptext ._delete { visibility: visible; float: none; }
._start_intro { padding: 4px; margin: 4px; }
`);

     function clearSelectedTimeRecords() {
         document.body.querySelectorAll('._selected').forEach(function(node) {
             node.classList.remove('_selected');
         });
         document.getElementById('app').className = '';
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

     function postTimeEntry(projectId, taskId, duration, dateId) {
         if(data.isDemo === true) {
             return;
         }

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
         if(data.isDemo === true) {
             return;
         }

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
         data.appElement = document.getElementById('app');
     }

    function finishIntro() {
        document.body.querySelectorAll('._demo,[data-user-id="demo"]').forEach(function(item) {
            item.remove();
        });

        document.body.classList.remove('_intro');

        clearSelectedTimeRecords();
        updateTotals();
        data.isDemo = false;
        data.isDeleteAllowed = true;
    }

    function showIntro() {

        const today = new Date();
        const targetDateUtc = today.toISOString();
        const sampleData1 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-1",
          taskName: "Design",
          duration: 75,
        };
        cloneTimeEntryElement(sampleData1, targetDateUtc);
        const sampleElement1 = document.body.querySelector('._timerecord[data-task-id="demo-1"]');
        sampleElement1.classList.add('_demo');
        sampleElement1.dataset.timeEntryId = 'demo-1';
        sampleElement1.dataset.step = 1;
        sampleElement1.dataset.intro = '<p><b>Welcome to the Xero Timesheets User Script Demo.</b></p>This is a sample time entry. You can select it by clicking on it<br>(it is currently selected for this demo).'
        sampleElement1.dataset.position = 'top';
        sampleElement1.click();

        const sampleData2 = {
          userId: "demo",
          projectName: "Demo Project",
          taskId: "demo-2",
          taskName: "Development",
          duration: 360,
        };
        cloneTimeEntryElement(sampleData2, targetDateUtc);
        const sampleElement2 = document.body.querySelector('._timerecord[data-task-id="demo-2"]');
        sampleElement2.classList.add('_demo');
        sampleElement2.dataset.timeEntryId = 'demo-2';
        sampleElement2.dataset.step = 2;
        sampleElement2.dataset.intro = '<p>You can select multiple time entries while holding a Shift key<p>You can try it now!'
        sampleElement2.dataset.position = 'top';

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowUtc = tomorrow.toISOString().substring(0,10);
        const tomorrowRow = document.getElementById(`_${tomorrowUtc}`);
        const buttonAdd = createElement('<button class="_add _demo" style="visibility:visible"></button>');
        buttonAdd.dataset.dateId = tomorrowUtc;
        buttonAdd.dataset.step = 3;
        buttonAdd.dataset.intro = '<p>You can use the <b>Paste</b> button to paste the selected time entries into any other day.</p><p>The Paste button will appear when you mouse over different days, but only if you have any time entries selected.</p><p>Note: You can\'t paste to past months so it won\'t appear there.</p>';
        buttonAdd.dataset.position = 'top';
        tomorrowRow.append(buttonAdd);

        const totalElement = document.body.querySelector('._today ._total');
        totalElement.dataset.step = 4;
        totalElement.dataset.intro = 'You can see the total number of hours from the time entries in each day.';
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
        sampleElement3.dataset.step = 5;
        sampleElement3.dataset.intro = '<p>You can delete a time entry using the <span class="_delete"></span> button which appears when you mouse over the time entry.'+
         '<p class="_tip">' +
         '  <b>Pro Tip:</b> <ul><li>Press <b>Delete</b> key to delete selected item(s) with a&nbsp;confirmation.</li><li>Hold <b>Shift</b> key and press the <b>Delete</b> key to delete the selected item(s) without the confirmation (be careful, there\'s no undo).</li></ul>'+
         '</p>' +
         '<p>You can try it now! Select the time entry below and try to delete it.</p>Don\'t worry, this is just a sample data, nothing will be actually deleted.';
        sampleElement3.dataset.position = 'bottom';

        const helpButton = document.querySelector('button[title="Help"]');
        helpButton.dataset.step = 6;
        helpButton.dataset.intro = '<p>You can always restart this guide using "Restart Guide" button in the Help menu</p>';

        document.body.classList.add('_intro');
        data.isDeleteAllowed = false;
        data.isDemo = true;
        updateTotals();

        const introOptions = {'showBullets': false, 'showProgress': true, 'hidePrev': true};
        introJs().setOptions(introOptions).start().oncomplete(finishIntro).onexit(finishIntro).onafterchange(function(targetElement) {
            if(targetElement.dataset.taskId === 'demo-3') {
                targetElement.click();
                data.isDeleteAllowed = true;
            }
        });
    }

    function addRestartIntroButton() {
        const helpList = document.querySelector('.help-list');
        const introButton = createElement('<li class="xn-h-header-info-item"><button class="_start_intro">Restart Guide</button></li>');
        introButton.addEventListener('click', showIntro, false);
        helpList.append(introButton);
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

         //addRestartIntroButton();
         //showIntro();
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

     function loadAppData() {
         data.appData = JSON.parse(document.getElementById('appData').innerText);
     }

    window._xero = window._xero || {};
    window._xero.showMyTime = showMyTime;
    window._xero.loadAppData = loadAppData;
})();

// Loader
(function() {
    'use strict';

     function load() {
         console.log(`Xero Timesheets User Script`);
         window._xero.loadAppData();
         window._xero.addMyTimeLink();
         switch(document.location.pathname) {
             case '/':
                 window._xero.overlayProjects();
                 break;
         }

         if(document.location.hash === '#tampermonkey-my-time') {
             if(document.location.pathname != '/') {
                 document.location.pathname = '/';
                 return false;
             }
             window._xero.navigateToMyTimeLink();
         }
         return false;
     }

    window._xero.waitForKeyElements('[data-loaded="true"]', load);
})();
