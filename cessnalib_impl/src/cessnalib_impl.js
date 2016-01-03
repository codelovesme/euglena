/// <reference path="../../cessnalib_template/typings/tsd.d.ts" />
/**
 * Created by codelovesme on 6/19/2015.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib");
var cessnalib_template_1 = require("../node_modules/cessnalib_template/src/cessnalib_template");
var io = require("socket.io");
var http = require("http");
var cessnalib_impl;
(function (cessnalib_impl) {
    var being;
    (function (being) {
        var alive;
        (function (alive) {
            var particles;
            (function (particles) {
                var ConnectedToEuglena = (function () {
                    function ConnectedToEuglena(content) {
                        this.content = content;
                        this.className = "cessnalib_impl.being.alive.particles.ConnectedToEuglena";
                    }
                    return ConnectedToEuglena;
                })();
                particles.ConnectedToEuglena = ConnectedToEuglena;
                var ConnectToEuglenaRequest = (function () {
                    function ConnectToEuglenaRequest(content) {
                        this.content = content;
                        this.className = "cessnalib_impl.being.alive.particles.ConnectToEuglenaRequest";
                    }
                    return ConnectToEuglenaRequest;
                })();
                particles.ConnectToEuglenaRequest = ConnectToEuglenaRequest;
            })(particles = alive.particles || (alive.particles = {}));
            var organelles;
            (function (organelles) {
                var TimeOrganelleImplNistGov = (function (_super) {
                    __extends(TimeOrganelleImplNistGov, _super);
                    function TimeOrganelleImplNistGov() {
                        _super.apply(this, arguments);
                    }
                    TimeOrganelleImplNistGov.prototype.fetchCurrentTime = function () {
                        //TODO
                        this.seed.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Time(new cessnalib_1.cessnalib.sys.type.Time(new cessnalib_1.cessnalib.sys.type.Date(2016, 1, 12), new cessnalib_1.cessnalib.sys.type.Clock(23, 12, 3))));
                    };
                    return TimeOrganelleImplNistGov;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.TimeOrganelle);
                organelles.TimeOrganelleImplNistGov = TimeOrganelleImplNistGov;
                //TODO test
                var WebParticleTransmitterOrganelleImplHttp = (function (_super) {
                    __extends(WebParticleTransmitterOrganelleImplHttp, _super);
                    function WebParticleTransmitterOrganelleImplHttp() {
                        _super.apply(this, arguments);
                    }
                    WebParticleTransmitterOrganelleImplHttp.prototype.connectToEuglena = function () {
                        var _this = this;
                        var post_options;
                        post_options.host = this.initialProperties.host;
                        post_options.port = Number(this.initialProperties.port);
                        post_options.path = this.initialProperties.path ? this.initialProperties.path : "/";
                        post_options.method = 'POST';
                        post_options.headers = {
                            'Content-Type': 'application/json'
                        };
                        var server = io("http://" + post_options.host + ":" + post_options.port);
                        server.on("particle", function (particleAssumption, callback) {
                            if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_1.cessnalib.reference.being.Particle, particleAssumption)) {
                                _this.seed.receiveParticle(particleAssumption);
                            }
                            else {
                            }
                        });
                        server.on("bind", function (particleAssumption) {
                            if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_1.cessnalib.reference.being.Particle, particleAssumption)) {
                                _this.seed.receiveParticle(particleAssumption);
                            }
                            else {
                            }
                        });
                        server.on("disconnect", function () {
                            //TODO
                        });
                        server.on("connect", function (socket) {
                            //TODO
                        });
                    };
                    WebParticleTransmitterOrganelleImplHttp.prototype.throwParticle = function (particle) {
                        this.server.emit("particle", particle);
                    };
                    return WebParticleTransmitterOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.WebParticleTransmitterOrganelle);
                organelles.WebParticleTransmitterOrganelleImplHttp = WebParticleTransmitterOrganelleImplHttp;
                //TODO test
                var WebReceptionOrganelleImplHttp = (function (_super) {
                    __extends(WebReceptionOrganelleImplHttp, _super);
                    function WebReceptionOrganelleImplHttp() {
                        _super.apply(this, arguments);
                    }
                    WebReceptionOrganelleImplHttp.prototype.listen = function () {
                        var _this = this;
                        this.sockets = new cessnalib_1.cessnalib.sys.type.Map();
                        var server = http.createServer(function (req, res) {
                            if (req.method == 'POST') {
                                var body = '';
                                req.on('data', function (data) {
                                    body += data;
                                    // Too much POST data, kill the connection!
                                    if (body.length > 1e6)
                                        req.socket.destroy();
                                });
                                req.on('end', function () {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    try {
                                        var particleAssumption = JSON.parse(body);
                                        if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_1.cessnalib.reference.being.Particle, particleAssumption)) {
                                            _this.seed.receiveParticle(particleAssumption);
                                            res.end(JSON.stringify(new cessnalib_template_1.cessnalib_template.being.alive.particles.Acknowledge()));
                                        }
                                        else {
                                        }
                                    }
                                    catch (e) {
                                        res.end(JSON.stringify(new cessnalib_template_1.cessnalib_template.being.alive.particles.ExceptionOccurred(new cessnalib_1.cessnalib.sys.type.Exception(e.message))));
                                    }
                                });
                            }
                            else if (req.method == 'GET') {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end('Server is running...\n');
                            }
                        });
                        var socket = io.listen(server);
                        socket.listen(this.initialProperties.port);
                        socket.on("connection", function (socket) {
                            socket.on("bind", function (impulse) {
                                _this.sockets.set(impulse.param.userId, socket);
                                //TODO fix EuglenaInfo
                                socket.emit("bind", new cessnalib_impl.being.alive.particles.ConnectedToEuglena(null));
                            });
                            socket.on("impulse", function (impulse) {
                                _this.seed.receiveParticle(impulse);
                                var s = _this.sockets.get(impulse.param.userId);
                                if (s) {
                                }
                            });
                        });
                    };
                    WebReceptionOrganelleImplHttp.prototype.throwImpulse = function (userId, impulse) {
                        var connectedMiddlewares = '';
                        if (this.sockets) {
                            this.sockets.getKeys().forEach(function (e) {
                                connectedMiddlewares += e + ",";
                            });
                        }
                        var client = this.sockets.get(userId);
                        if (client) {
                        }
                        else {
                        }
                    };
                    return WebReceptionOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.WebReceptionOrganelle);
                organelles.WebReceptionOrganelleImplHttp = WebReceptionOrganelleImplHttp;
                var WebParticleThrowerOrganelleImplHttp = (function (_super) {
                    __extends(WebParticleThrowerOrganelleImplHttp, _super);
                    function WebParticleThrowerOrganelleImplHttp() {
                        _super.apply(this, arguments);
                    }
                    WebParticleThrowerOrganelleImplHttp.prototype.initialize = function () {
                        this.callbackStack = [];
                        this.post_options = {
                            host: this.initialProperties.host,
                            port: Number(this.initialProperties.port),
                            path: this.initialProperties.path ? this.initialProperties.path : "/",
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                    };
                    WebParticleThrowerOrganelleImplHttp.prototype.throwParticle = function (particle) {
                        var _this = this;
                        var post_req = http.request(this.post_options, function (res) {
                            res.setEncoding('utf8');
                            var str = '';
                            res.on('data', function (data) {
                                str += data;
                            });
                            res.on('end', function (data) {
                                var particle = JSON.parse(str);
                                _this.seed.receiveParticle(particle);
                            });
                        });
                        // post the data
                        var s = JSON.stringify(particle);
                        post_req.write(s);
                        post_req.end();
                    };
                    return WebParticleThrowerOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.WebParticleThrowerOrganelle);
                organelles.WebParticleThrowerOrganelleImplHttp = WebParticleThrowerOrganelleImplHttp;
            })(organelles = alive.organelles || (alive.organelles = {}));
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib_impl.being || (cessnalib_impl.being = {}));
})(cessnalib_impl = exports.cessnalib_impl || (exports.cessnalib_impl = {}));
//# sourceMappingURL=cessnalib_impl.js.map