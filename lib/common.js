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
    Date.prototype.toIdString = function() {
         // careful with the UTC timezone
         // … if you create a time entry in Xero Projects e.g. for the date 2020-04-12
         // it may actually create a record as "2020-04-11T23:00:00Z" because your browser's timezone is UTC+01
         // so just getting the first 10 characters of ISO string would get 2020-04-11 incorrectly:
         // `date.toISOString().substring(0,10);`
         // so rather than that, create the dateId string using yyyy-MM-dd format
         const year = this.getFullYear();
         // JavaScript months are 0-based
         const month = this.getMonth() + 1;
         const day = this.getDate();
         // pad month and day with zero to always return two digits
         return `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day}`;
    };

    document.__proto__.createElementFromHtml = function(html) {
        var template = document.createElement('template');
        // Never return a text node of whitespace as the result
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
})();
