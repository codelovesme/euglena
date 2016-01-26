/**
 * Created by codelovesme on 6/19/2015.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* TODO List
* Environment geriye exception donmeli mi problem ciktiginda yoksa loglayip gecmeli mi ?0
*/
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib");
var cessnalib_template_1 = require("../node_modules/cessnalib_template/src/cessnalib_template");
var io = require("socket.io");
var http = require("http");
var Exception = cessnalib_1.cessnalib.sys.type.Exception;
var cessnalib_impl;
(function (cessnalib_impl) {
    var sys;
    (function (sys) {
        var io;
        (function (io) {
            var net;
            (function (net) {
                var HttpRequestManager = (function () {
                    function HttpRequestManager(post_options) {
                        this.post_options = post_options;
                    }
                    HttpRequestManager.prototype.sendMessage = function (message, callback) {
                        var req = http.request(this.post_options, function (res) {
                            res.setEncoding('utf8');
                            var str = '';
                            res.on('data', function (data) {
                                str += data;
                            });
                            res.on('end', function (data) {
                                callback(str);
                            });
                        });
                        req.setTimeout(10000, function () {
                            req.abort();
                            callback(new Exception("Request timed out."));
                        });
                        req.on('error', function (e) {
                            callback(new Exception("problem with request: " + e.message));
                        });
                        req.write(message);
                        req.end();
                    };
                    return HttpRequestManager;
                })();
                net.HttpRequestManager = HttpRequestManager;
            })(net = io.net || (io.net = {}));
        })(io = sys.io || (sys.io = {}));
    })(sys = cessnalib_impl.sys || (cessnalib_impl.sys = {}));
    var being;
    (function (being) {
        var alive;
        (function (alive) {
            var StaticTools = (function () {
                function StaticTools() {
                }
                StaticTools.createOrganelleBank = function () {
                    var bank = new cessnalib_1.cessnalib.sys.type.Map();
                    bank.add(constants.organelles.ImpactThrowerOrganelleImplHttp, new alive.organelle.ImpactThrowerOrganelleImplHttp());
                    bank.add(constants.organelles.ImpactTransmitterOrganelleImplHttp, new alive.organelle.ImpactTransmitterOrganelleImplHttp());
                    bank.add(constants.organelles.ReceptionOrganelleImplHttp, new alive.organelle.ReceptionOrganelleImplHttp());
                    bank.add(constants.organelles.WebOrganelleImplHttp, new alive.organelle.WebOrganelleImplHttp());
                    bank.add(constants.organelles.TimeOrganelleImplJs, new alive.organelle.TimeOrganelleJs());
                    return bank;
                };
                return StaticTools;
            })();
            alive.StaticTools = StaticTools;
            var constants;
            (function (constants) {
                var organelles;
                (function (organelles) {
                    organelles.WebOrganelleImplHttp = "WebOrganelleImplHttp";
                    organelles.ReceptionOrganelleImplHttp = "ReceptionOrganelleImplHttp";
                    organelles.ImpactTransmitterOrganelleImplHttp = "ImpactTransmitterOrganelleImplHttp";
                    organelles.ImpactThrowerOrganelleImplHttp = "ImpactThrowerOrganelleImplHttp";
                    organelles.TimeOrganelleImplJs = "TimeOrganelleImplJs";
                })(organelles = constants.organelles || (constants.organelles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var organelle;
            (function (organelle) {
                var WebOrganelleImplHttp = (function (_super) {
                    __extends(WebOrganelleImplHttp, _super);
                    function WebOrganelleImplHttp() {
                        _super.apply(this, arguments);
                    }
                    WebOrganelleImplHttp.prototype.receiveParticle = function (particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.web.constants.incomingparticles.ReturnCurrentTime:
                                this.fetchCurrentTime();
                                break;
                        }
                    };
                    WebOrganelleImplHttp.prototype.fetchCurrentTime = function () {
                        //TODO
                    };
                    return WebOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.WebOrganelle);
                organelle.WebOrganelleImplHttp = WebOrganelleImplHttp;
                var TimeOrganelleJs = (function (_super) {
                    __extends(TimeOrganelleJs, _super);
                    function TimeOrganelleJs() {
                        _super.apply(this, arguments);
                    }
                    TimeOrganelleJs.prototype.receiveParticle = function (particle) {
                        var _this = this;
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.SetTime:
                                this.time = particle.content;
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.StartClock:
                                setInterval(function () {
                                    var newDate = new Date(_this.time.date.year, _this.time.date.month - 1, _this.time.date.day, _this.time.clock.hour, _this.time.clock.minute, _this.time.clock.second + 1);
                                    if (newDate.getSeconds() != _this.time.clock.second) {
                                        _this.time.clock.second = newDate.getSeconds();
                                        //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Second(this.time.clock.second));
                                        if (newDate.getMinutes() != _this.time.clock.minute) {
                                            _this.time.clock.minute = newDate.getMinutes();
                                            //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Minute(this.time.clock.minute));
                                            if (newDate.getHours() != _this.time.clock.hour) {
                                                _this.time.clock.hour = newDate.getHours();
                                                //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Hour(this.time.clock.hour));
                                                if (newDate.getDate() != _this.time.date.day) {
                                                    _this.time.date.day = newDate.getDate();
                                                    //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Day(this.time.date.day));
                                                    if (newDate.getMonth() + 1 != _this.time.date.month) {
                                                        _this.time.date.month = newDate.getMonth() + 1;
                                                        //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Month(this.time.date.month));
                                                        if (newDate.getFullYear() != _this.time.date.year) {
                                                            _this.time.date.year = newDate.getFullYear();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    _this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Time(_this.time));
                                }, 1000);
                                break;
                        }
                    };
                    return TimeOrganelleJs;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.TimeOrganelle);
                organelle.TimeOrganelleJs = TimeOrganelleJs;
                var ImpactTransmitterOrganelleImplHttp = (function (_super) {
                    __extends(ImpactTransmitterOrganelleImplHttp, _super);
                    function ImpactTransmitterOrganelleImplHttp() {
                        _super.apply(this, arguments);
                        this.servers = {};
                    }
                    ImpactTransmitterOrganelleImplHttp.prototype.receiveParticle = function (particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ConnectToEuglena:
                                this.connectToEuglena(particle.content);
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ThrowImpact:
                                var throwImpactContent = particle.content;
                                this.throwImpact(throwImpactContent.to, throwImpactContent.impact);
                                break;
                        }
                    };
                    ImpactTransmitterOrganelleImplHttp.prototype.connectToEuglena = function (euglenaInfo) {
                        var _this = this;
                        if (this.servers[euglenaInfo.name]) {
                            return;
                        }
                        var post_options;
                        post_options.host = euglenaInfo.url;
                        post_options.port = Number(euglenaInfo.port);
                        post_options.path = "/";
                        post_options.method = 'POST';
                        post_options.headers = {
                            'Content-Type': 'application/json'
                        };
                        var server = io("http://" + post_options.host + ":" + post_options.port);
                        this.servers[euglenaInfo.name] = server;
                        server.on("impact", function (impactAssumption, callback) {
                            if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.interaction.Impact, impactAssumption)) {
                                //TODO
                                //callback(new cessnalib_template.being.alive.particles.Acknowledge());
                                _this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption));
                            }
                            else {
                            }
                        });
                        server.on("bind", function (impactAssumption) {
                            //TODO
                        });
                        server.on("disconnect", function () {
                            //TODO
                        });
                        server.on("connect", function (socket) {
                            socket.emit("bind", null);
                            //TODO
                        });
                    };
                    ImpactTransmitterOrganelleImplHttp.prototype.throwImpact = function (to, impact) {
                        var server = this.servers[to.name];
                        if (server) {
                            server.emit("impact", impact);
                        }
                        else {
                        }
                    };
                    return ImpactTransmitterOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.ImpactTransmitterOrganelle);
                organelle.ImpactTransmitterOrganelleImplHttp = ImpactTransmitterOrganelleImplHttp;
                var ReceptionOrganelleImplHttp = (function (_super) {
                    __extends(ReceptionOrganelleImplHttp, _super);
                    function ReceptionOrganelleImplHttp() {
                        _super.apply(this, arguments);
                        this.sockets = {};
                    }
                    ReceptionOrganelleImplHttp.prototype.receiveParticle = function (particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.constants.incomingparticles.Listen:
                                this.listen();
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.constants.incomingparticles.ThrowImpact:
                                var throwImpactContent = particle.content;
                                this.throwImpact(throwImpactContent.to, throwImpactContent.impact);
                                break;
                        }
                    };
                    ReceptionOrganelleImplHttp.prototype.listen = function () {
                        var _this = this;
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
                                        var impactAssumption = JSON.parse(body);
                                        if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.interaction.Impact, impactAssumption) &&
                                            cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.Particle, impactAssumption.particle)) {
                                            _this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption));
                                            res.end(JSON.stringify(new cessnalib_template_1.cessnalib_template.being.alive.particles.Acknowledge()));
                                        }
                                        else {
                                        }
                                    }
                                    catch (e) {
                                        //TODO
                                        res.end("Request format is uncorrect !");
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
                            socket.on("bind", function (impact) {
                                _this.sockets[impact.sender] = socket;
                                //TODO
                                socket.emit("bind", null);
                            });
                            socket.on("impact", function (impactAssumption) {
                                //TODO
                                _this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption));
                                //var s = this.sockets[impulse];
                                //if (s) {
                                //s.emit("response", response);
                                //}
                            });
                        });
                    };
                    ReceptionOrganelleImplHttp.prototype.throwImpact = function (to, impact) {
                        var client = this.sockets[to.name];
                        if (client) {
                            client.emit("impact", impact, function (resp) {
                                //TODO
                            });
                        }
                        else {
                        }
                    };
                    return ReceptionOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.ReceptionOrganelle);
                organelle.ReceptionOrganelleImplHttp = ReceptionOrganelleImplHttp;
                var ImpactThrowerOrganelleImplHttp = (function (_super) {
                    __extends(ImpactThrowerOrganelleImplHttp, _super);
                    function ImpactThrowerOrganelleImplHttp() {
                        _super.apply(this, arguments);
                    }
                    ImpactThrowerOrganelleImplHttp.prototype.receiveParticle = function (particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.impactthrower.constants.incomingparticles.ThrowImpact:
                                this.throwImpact(particle.content.to, particle.content.impact);
                                break;
                        }
                    };
                    ImpactThrowerOrganelleImplHttp.prototype.throwImpact = function (to, impact) {
                        var _this = this;
                        var post_options = {
                            host: to.url,
                            port: Number(to.port),
                            path: "/",
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                        var httpConnector = new cessnalib_impl.sys.io.net.HttpRequestManager(post_options);
                        httpConnector.sendMessage(JSON.stringify(impact), function (message) {
                            if (cessnalib_1.cessnalib.sys.type.StaticTools.Exception.isNotException(message)) {
                                try {
                                    var impactAssumption = JSON.parse(message);
                                    if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.interaction.Impact, impactAssumption)) {
                                        _this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption));
                                    }
                                    else {
                                    }
                                }
                                catch (e) {
                                }
                            }
                            else {
                                //TODO write a eligable exception message
                                _this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Exception(new Exception("")));
                            }
                        });
                    };
                    return ImpactThrowerOrganelleImplHttp;
                })(cessnalib_template_1.cessnalib_template.being.alive.organelles.ImpactThrowerOrganelle);
                organelle.ImpactThrowerOrganelleImplHttp = ImpactThrowerOrganelleImplHttp;
            })(organelle = alive.organelle || (alive.organelle = {}));
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib_impl.being || (cessnalib_impl.being = {}));
})(cessnalib_impl = exports.cessnalib_impl || (exports.cessnalib_impl = {}));
//# sourceMappingURL=cessnalib_impl.js.map