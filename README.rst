.. image:: https://raw.githubusercontent.com/score-framework/py.doc/master/docs/score-banner.png
    :target: http://score-framework.org

`The SCORE Framework`_ is a collection of harmonized python and javascript
libraries for the development of large scale web projects. Powered by strg.at_.

.. _The SCORE Framework: http://score-framework.org
.. _strg.at: http://strg.at


**************
score.relatime
**************

.. _js_relatime:

Lightweight humanized relative time formatting, inspired by Moment.js

Quickstart
==========

.. code-block:: html

    <script src="score.init.js"></script>
    <script src="score.relatime.js"></script>
    <script>
        score.relatime(new Date());
        // 'a few seconds ago';
        score.relatime("2015-10-21", "1985-10-25");
        // 'in 30 years';
        score.relatime("1955-11-12", "1985-10-25", {future: "Marty travelled %s back to the future"});
        // 'Marty travelled 30 years back to the future';
    </script>

Details
=======

Grammar
-------

An Object consisting of key/value pairs used to format the time span.

**default grammar**

.. code-block:: javascript

    {
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
    }

Negative time spans will use the ``past`` key, positive time spans the ``future`` key as the base string.

**changing the base string**

.. code-block:: javascript

    var grammar = {
       past: "Marty McFly arrived in the future %s ago",
       future: "Marty McFly will arrive in the future in %s"
    }

    score.relatime("2015-10-21", "2016-10-21", grammar);
    // "Marty McFly arrived in the future a year ago"

    score.relatime("2015-10-21", "2013-10-21", grammar);
    // "Marty McFly will arrive in the future in 2 years"

Grammars can be used for **i18n**:

.. code-block:: javascript

    var grammar = {
        future : 'in %s',
        past : 'vor %s',
        s : 'ein paar Sekunden',
        ss : 'ein paar Sekunden',
        m: 'einer Minute',
        mm : '%d Minuten',
        h: 'einer Stunde',
        hh : '%d Stunden',
        d: '%d Tag',
        dd: '%d Tagen',
        M: 'einem Monat',
        MM: '%d Monaten',
        y: 'einem Jahr',
        yy: '%d Jahren'
    };

    var localized = score.relatime.create(grammar);
    localized(new Date());
    // "vor ein paar Sekunden"



**Changing the base string from the localized function**

.. code-block:: javascript

    var variant = localized.create({past: "seit %s"});
    variant(new Date());
    // "seit ein paar Sekunden"

API
===

function ``score.relatime(date, relDate, grammar)``
    Returns a humanized string representation for the time span between a given
    *date* and the current time.

    The *date* can be an instance of ``Date()``, a timestamp or a
    string that will be parsed by the browser's native Date() function. But
    be careful, `cross-browser JavaScript Date parsing behavior
    <http://dygraphs.com/date-formats.html>`_ is an issue on older Browsers.

    The optional *relDate* accepts the same formats as *date* and will serve as
    the base date to compare the actual date to.

    It is also possible to override (parts of) the conversion strings by
    passing a *grammar* object. The expected format for this object can be
    found in the Grammar section, above.

function ``score.relatime.create(grammar)``
    Returns a new ``score.relatime`` function, bound to the given *grammar*.

    The expected format for the *grammar* argument can be found in the Grammar
    section, above.


License
=======

Copyright © 2015-2017 STRG.AT GmbH, Vienna, Austria

All files in and beneath this directory are part of The SCORE Framework.
The SCORE Framework and all its parts are free software: you can redistribute
them and/or modify them under the terms of the GNU Lesser General Public
License version 3 as published by the Free Software Foundation which is in the
file named COPYING.LESSER.txt.

The SCORE Framework and all its parts are distributed without any WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. For more details see the GNU Lesser General Public License.

If you have not received a copy of the GNU Lesser General Public License see
http://www.gnu.org/licenses/.

The License-Agreement realised between you as Licensee and STRG.AT GmbH as
Licenser including the issue of its valid conclusion and its pre- and
post-contractual effects is governed by the laws of Austria. Any disputes
concerning this License-Agreement including the issue of its valid conclusion
and its pre- and post-contractual effects are exclusively decided by the
competent court, in whose district STRG.AT GmbH has its registered seat, at the
discretion of STRG.AT GmbH also the competent court, in whose district the
Licensee has his registered seat, an establishment or assets.
