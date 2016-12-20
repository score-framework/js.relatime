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

    });

});

