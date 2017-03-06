/**
 * Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

// Universal Module Loader
// https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/v1.0.0/returnExports.js

// Inspired by MomentJS
// https://github.com/moment/moment
// Threshold parsing taken from:
// https://github.com/moment/moment/blob/master/src/lib/duration/humanize.js

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.score.extend('relatime', [], factory);
    }
})(this, function() {

    "use strict";

    var DEFAULTS = {
        grammar: {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: 'a few seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years'
        },
        thresholds: {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        }
    };

    var relativeTime = function(boundGrammar, date/*, relDate=new Date(), modGrammar={}*/) {
        var relDate, modGrammar;
        var grammar = boundGrammar;
        var args = Array.prototype.slice.call(arguments, 2);
        if (args.length === 2) {
            relDate = args[0];
            modGrammar = args[1];
        } else if (args.length === 1) {
            if (allowAsDateArg(args[0])) {
                relDate = args[0];
            } else {
                modGrammar = args[0];
            }
        }
        date = parseDate(date);
        if (typeof relDate !== 'undefined') {
            relDate = parseDate(relDate);
        } else {
            relDate = new Date();
        }
        if (modGrammar) {
            grammar = mergeGrammar(boundGrammar, modGrammar);
        }
        return humanize(date, relDate, grammar);
    };

    var humanize = function(date, relDate, grammar) {
        var round = Math.round;
        var abs = Math.abs;
        var years = date.getFullYear() - relDate.getFullYear();
        var months = date.getMonth() - relDate.getMonth() + years * 12;
        var seconds = (date - relDate) / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var futurePast = (seconds > 0) ? 'future' : 'past';
        seconds = abs(round(seconds));
        minutes = abs(round(minutes));
        hours = abs(round(hours));
        days = abs(round(days));
        months = abs(months);
        years = abs(years);
        var thresholds = DEFAULTS.thresholds;
        var a = 
            seconds <= 1 && ['s'] ||
            seconds < thresholds.s && ['ss', seconds] ||
            minutes <= 1 && ['m'] ||
            minutes < thresholds.m && ['mm', minutes] ||
            hours <= 1 && ['h'] ||
            hours < thresholds.h && ['hh', hours] ||
            days <= 1 && ['d'] ||
            days < thresholds.d && ['dd', days] ||
            months <= 1 && ['M'] ||
            months < thresholds.M && ['MM', months] ||
            years <= 1 && ['y'] ||
            ['yy', years];
        if (a.length === 1) {
            return grammar[futurePast].replace("%s", grammar[a[0]]);
        }
        return grammar[futurePast].replace("%s", grammar[a[0]].replace("%d", a[1]));
    };

    var mergeGrammar = function(grammar, mods) {
        var k;
        var newGrammar = {};
        for (k in DEFAULTS.grammar) {
            newGrammar[k] = DEFAULTS.grammar[k];
        }
        for (k in grammar) {
            newGrammar[k] = grammar[k];
        }
        for (k in mods) {
            newGrammar[k] = mods[k];
        }
        return newGrammar;
    };

    var allowAsDateArg = function(arg) {
        return (typeof arg === 'object' && arg instanceof Date) ||
            typeof arg === 'string' ||
            typeof arg === 'number';
    };

    var parseDate = function(dateArg) {
        var date = new Date(dateArg);
        if (isNaN(date.getTime())) {
            throw Error('Invalid or unparsable date argument');
        }
        return date;
    };

    var create = function(grammar) {
        if (typeof this !== 'undefined' && this._grammar) {
            grammar = mergeGrammar(this._grammar, grammar);
        } else {
            grammar = mergeGrammar(grammar, {});
        }
        var newFunc = relativeTime.bind(null, grammar);
        newFunc._grammar = grammar;
        newFunc.create = create.bind(newFunc);
        return newFunc;
    };

    var relatime = create();

    relatime.__version__ = '0.0.3';

    return relatime;

});
