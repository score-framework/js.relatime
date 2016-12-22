if (typeof loadScore === 'undefined') {

    var loadScore = function loadScore(modules, callback) {
        var fs = require('fs'),
            request = require('sync-request'),
            vm = require('vm');
        if (typeof modules === 'function') {
            callback = modules;
            modules = [];
        } else if (!modules) {
            modules = [];
        }
        var loaded = {};
        var customRequire = function(module) {
            if (loaded[module]) {
                return loaded[module];
            }
            var script, url, name = module.substring('score.'.length);
            if (testConf[name] === 'local') {
                script = fs.readFileSync(__dirname + '/../' + name.replace('.', '/') + '.js', {encoding: 'UTF-8'});
            } else if (testConf[name]) {
                url = 'https://cdn.rawgit.com/score-framework/js.' + name + '/' + testConf[name] + '/' + name + '.js';
            } else {
                url = 'https://cdn.rawgit.com/score-framework/js.' + name + '/master/' + name + '.js';
            }
            if (url) {
                if (!loadScore.cache[url]) {
                    loadScore.cache[url] = request('GET', url).getBody('utf8');
                }
                script = loadScore.cache[url];
            }
            var sandbox = vm.createContext({require: customRequire, module: {exports: {}}});
            vm.runInContext(script, sandbox, module + '.js');
            loaded[module] = sandbox.module.exports;
            return loaded[module];
        };
        var score = customRequire('score.init');
        for (var i = 0; i < modules.length; i++) {
            customRequire('score.' + modules[i]);
        }
        callback(score);
    };

    loadScore.cache = {};

    var expect = require('expect.js');
}

var testConf = {
    'relatime': 'local'
};

describe('score.relatime', function() {

    describe('module', function() {

        it('should add the score.relatime function', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    done();
                });
            });
        });

    });

    describe('function', function() {

        it('should accept new Date() and return string', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime(new Date())).to.be.a('string');
                    done();
                });
            });
        });

        it('should accept timestamp and return string', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime(new Date().getTime())).to.be.a('string');
                    done();
                });
            });
        });

        it('should throw an error on unparsable date argument', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(function() {
                        score.relatime("foobar");
                    }).to.throwError();
                    done();
                });
            });
        });

        it('should accept additional relative date argument', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score.relatime(new Date(), new Date())).to.be.a('string');
                    expect(score.relatime("2015-10-21", "1985-10-26")).to.be.a('string');
                    done();
                });
            });
        });

        it('should accept grammar dict as second and third argument', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score.relatime(new Date(), {m: '1 month'})).to.be.a('string');
                    expect(score.relatime(new Date(), new Date(), {m: '1 month'})).to.be.a('string');
                    done();
                });
            });
        });
    });

    describe('defaults', function() {

        it('should properly parse defaults for dates in the past and future', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime("1984-10-26", "1985-11-26")).to.be("a year ago");
                    expect(score.relatime("1983-10-26", "1985-11-26")).to.be("2 years ago");
                    expect(score.relatime("1985-10-26", "1985-11-26")).to.be("a month ago");
                    expect(score.relatime("1985-09-26", "1985-11-26")).to.be("2 months ago");
                    expect(score.relatime("1985-10-25", "1985-10-26")).to.be("a day ago");
                    expect(score.relatime("1985-10-24", "1985-10-26")).to.be("2 days ago");
                    expect(score.relatime("1985-10-26T00:00:00", "1985-10-26T01:00:00")).to.be("an hour ago");
                    expect(score.relatime("1985-10-26T01:00:00", "1985-10-26T03:00:00")).to.be("2 hours ago");
                    expect(score.relatime("1985-10-26T01:21:00", "1985-10-26T01:22:00")).to.be("a minute ago");
                    expect(score.relatime("1985-10-26T01:20:00", "1985-10-26T01:22:00")).to.be("2 minutes ago");
                    expect(score.relatime("1985-10-26T01:22:00", "1985-10-26T01:22:01")).to.be("a few seconds ago");
                    expect(score.relatime("1985-10-26T01:22:01", "1985-10-26T01:22:00")).to.be("in a few seconds");
                    done();
                });
            });
        });

        it('same dates should be treated as past dates', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    var date = new Date();
                    expect(score.relatime(date, date)).to.be("a few seconds ago");
                    done();
                });
            });
        });

    });

    describe('#create', function() {

        it('should bind grammar to new function', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime.create).to.be.a('function');
                    var newFunc = score.relatime.create({m: '1 month'});
                    expect(newFunc).to.be.a('function');
                    expect(newFunc === score.relatime).to.be(false);
                    done();
                });
            });
        });

        it('new grammar function should affect output', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime.create).to.be.a('function');
                    var newFunc = score.relatime.create({M: '1 month'});
                    expect(newFunc("1985-10-26", "1985-11-26")).to.be.a('string');
                    expect(newFunc("1985-10-26", "1985-11-26")).to.be('1 month ago');
                    done();
                });
            });
        });

        it('new function should leave default grammar intact', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime.create).to.be.a('function');
                    var newFunc = score.relatime.create({M: '1 month'});
                    expect(newFunc("1985-10-26", "1985-11-26")).to.be('1 month ago');
                    expect(score.relatime("1985-10-26", "1985-11-26")).to.be('a month ago');
                    done();
                });
            });
        });

        it('new grammar should be expandable', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime.create).to.be.a('function');
                    var newFunc = score.relatime.create({M: '1 month'});
                    var newFunc2 = newFunc.create({MM: '%d M'});
                    expect(newFunc("1985-10-26", "1985-11-26")).to.be('1 month ago');
                    expect(newFunc2("1985-10-26", "1985-11-26")).to.be('1 month ago');
                    expect(newFunc2("1985-09-26", "1985-11-26")).to.be('2 M ago');
                    done();
                });
            });
        });

        it('new func should also accept grammar arg and leave its grammar intact', function(done) {
            loadScore(function(score) {
                expect(score).to.be.an('object');
                expect(score.relatime).to.be(undefined);
                loadScore(['relatime'], function(score) {
                    expect(score).to.be.an('object');
                    expect(score.relatime).to.be.a('function');
                    expect(score.relatime.create).to.be.a('function');
                    var newFunc = score.relatime.create({M: '1 month'});
                    expect(newFunc("1985-10-26", "1985-11-26")).to.be('1 month ago');
                    expect(newFunc("1985-10-26", "1985-11-26", {M: "one month"})).to.be('one month ago');
                    expect(newFunc("1985-10-26", "1985-11-26")).to.be('1 month ago');
                    done();
                });
            });
        });

    });

});

