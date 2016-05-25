/**
 * Created by codelovesme on 6/19/2015.
 */
/*
* TODO List
* Environment geriye exception donmeli mi problem ciktiginda yoksa loglayip gecmeli mi ?0
*/
/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
var euglena_1 = require("../node_modules/euglena/euglena");
var euglena_template_1 = require("../node_modules/euglena_template/src/euglena_template");
var io = require("socket.io");
var http = require("http");
var Exception = euglena_1.euglena.sys.type.Exception;
var euglena_impl;
(function (euglena_impl) {
    var sys;
    (function (sys) {
        var io;
        (function (io) {
            var net;
            (function (net) {
                class HttpRequestManager {
                    constructor(post_options) {
                        this.post_options = post_options;
                    }
                    sendMessage(message, callback) {
                        var req = http.request(this.post_options, (res) => {
                            res.setEncoding('utf8');
                            var str = '';
                            res.on('data', (data) => {
                                str += data;
                            });
                            res.on('end', (data) => {
                                callback(str);
                            });
                        });
                        req.setTimeout(10000, () => {
                            req.abort();
                            callback(new Exception("Request timed out."));
                        });
                        req.on('error', (e) => {
                            callback(new Exception("problem with request: " + e.message));
                        });
                        if (message)
                            req.write(message);
                        req.end();
                    }
                }
                net.HttpRequestManager = HttpRequestManager;
            })(net = io.net || (io.net = {}));
        })(io = sys.io || (sys.io = {}));
    })(sys = euglena_impl.sys || (euglena_impl.sys = {}));
    var being;
    (function (being) {
        var alive;
        (function (alive) {
            class StaticTools {
                static createOrganelleBank() {
                    var bank = new euglena_1.euglena.sys.type.Map();
                    bank.add(constants.organelles.ImpactThrowerOrganelleImplHttp, new alive.organelle.ImpactThrowerOrganelleImplHttp());
                    bank.add(constants.organelles.ImpactTransmitterOrganelleImplHttp, new alive.organelle.ImpactTransmitterOrganelleImplHttp());
                    bank.add(constants.organelles.ReceptionOrganelleImplHttp, new alive.organelle.ReceptionOrganelleImplHttp());
                    bank.add(constants.organelles.WebOrganelleImplHttp, new alive.organelle.WebOrganelleImplHttp());
                    bank.add(constants.organelles.TimeOrganelleImplJs, new alive.organelle.TimeOrganelleJs());
                    bank.add(constants.organelles.DbOrganelleImplMongoDb, new alive.organelle.DbOrganelleImplMongoDb());
                    return bank;
                }
            }
            alive.StaticTools = StaticTools;
            var constants;
            (function (constants) {
                var organelles;
                (function (organelles) {
                    organelles.DbOrganelleImplMongoDb = "DbOrganelleImplMongoDb";
                    organelles.WebOrganelleImplHttp = "WebOrganelleImplHttp";
                    organelles.ReceptionOrganelleImplHttp = "ReceptionOrganelleImplHttp";
                    organelles.ImpactTransmitterOrganelleImplHttp = "ImpactTransmitterOrganelleImplHttp";
                    organelles.ImpactThrowerOrganelleImplHttp = "ImpactThrowerOrganelleImplHttp";
                    organelles.TimeOrganelleImplJs = "TimeOrganelleImplJs";
                })(organelles = constants.organelles || (constants.organelles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var organelle;
            (function (organelle) {
                class WebOrganelleImplHttp extends euglena_template_1.euglena_template.being.alive.organelles.WebOrganelle {
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case euglena_template_1.euglena_template.being.ghost.euglena.web.constants.incomingparticles.ReturnCurrentTime:
                                this.fetchCurrentTime();
                                break;
                            case euglena_template_1.euglena_template.being.ghost.euglena.web.constants.incomingparticles.ReturnIfConnectedToTheInternet:
                                this.checkInternetConnection();
                                break;
                        }
                    }
                    checkInternetConnection() {
                        new euglena_impl.sys.io.net.HttpRequestManager({
                            host: "http://www.timeapi.org/utc/now",
                            port: 80,
                            path: "/",
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).sendMessage(null, (result) => {
                            if (typeof result == "string") {
                                let jsDate = new Date(result);
                                let date = new euglena_1.euglena.sys.type.Date(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDay());
                                let clock = new euglena_1.euglena.sys.type.Clock(jsDate.getUTCHours(), jsDate.getUTCMinutes(), jsDate.getSeconds());
                                let time = new euglena_1.euglena.sys.type.Time(date, clock);
                                //this.receiveParticle(new euglena_template.being.alive.particles.Time(time));
                                this.receiveParticle(new euglena_template_1.euglena_template.being.alive.particles.ConnectedToTheInternet(euglena_1.euglena.js.Class.instanceOf(new euglena_1.euglena.sys.type.Time(new euglena_1.euglena.sys.type.Date(0, 0, 0), new euglena_1.euglena.sys.type.Clock(0, 0, 0)), time), euglena_template_1.euglena_template.being.alive.constants.organelles.WebOrganelle));
                            }
                            else {
                            }
                        });
                    }
                    fetchCurrentTime() {
                        new euglena_impl.sys.io.net.HttpRequestManager({
                            host: "http://www.timeapi.org/utc/now",
                            port: 80,
                            path: "/",
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).sendMessage(null, (result) => {
                            if (typeof result == "string") {
                                let jsDate = new Date(result);
                                let date = new euglena_1.euglena.sys.type.Date(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDay());
                                let clock = new euglena_1.euglena.sys.type.Clock(jsDate.getUTCHours(), jsDate.getUTCMinutes(), jsDate.getSeconds());
                                let time = new euglena_1.euglena.sys.type.Time(date, clock);
                                this.receiveParticle(new euglena_template_1.euglena_template.being.alive.particles.Time(time, euglena_template_1.euglena_template.being.alive.constants.organelles.WebOrganelle));
                            }
                            else {
                            }
                        });
                    }
                }
                organelle.WebOrganelleImplHttp = WebOrganelleImplHttp;
                class ImpactTransmitterOrganelleImplHttp extends euglena_template_1.euglena_template.being.alive.organelles.ImpactTransmitterOrganelle {
                    constructor() {
                        super();
                        this.servers = {};
                    }
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case euglena_template_1.euglena_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ConnectToEuglena:
                                this.connectToEuglena(particle.content);
                                break;
                            case euglena_template_1.euglena_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ThrowImpact:
                                let throwImpactContent = particle.content;
                                this.throwImpact(throwImpactContent.to, throwImpactContent.impact);
                                break;
                        }
                    }
                    connectToEuglena(euglenaInfo) {
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
                        let server = io("http://" + post_options.host + ":" + post_options.port);
                        this.servers[euglenaInfo.name] = server;
                        server.on("impact", (impactAssumption, callback) => {
                            if (euglena_1.euglena.js.Class.instanceOf(euglena_template_1.euglena_template.reference.being.interaction.Impact, impactAssumption)) {
                                //TODO
                                //callback(new euglena_template.being.alive.particles.Acknowledge());
                                this.nucleus.receiveParticle(new euglena_template_1.euglena_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption, euglena_template_1.euglena_template.being.alive.constants.organelles.ImpactTransmitterOrganelle));
                            }
                            else {
                            }
                        });
                        server.on("bind", (impactAssumption) => {
                            //TODO
                        });
                        server.on("disconnect", () => {
                            //TODO
                        });
                        server.on("connect", (socket) => {
                            socket.emit("bind", null);
                            //TODO
                        });
                    }
                    throwImpact(to, impact) {
                        let server = this.servers[to.name];
                        if (server) {
                            server.emit("impact", impact);
                        }
                        else {
                        }
                    }
                }
                organelle.ImpactTransmitterOrganelleImplHttp = ImpactTransmitterOrganelleImplHttp;
                class ImpactThrowerOrganelleImplHttp extends euglena_template_1.euglena_template.being.alive.organelles.ImpactThrowerOrganelle {
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case euglena_template_1.euglena_template.being.ghost.euglena.impactthrower.constants.incomingparticles.ThrowImpact:
                                this.throwImpact(particle.content.to, particle.content.impact);
                                break;
                        }
                    }
                    throwImpact(to, impact) {
                        var post_options = {
                            host: to.url,
                            port: Number(to.port),
                            path: "/",
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                        let httpConnector = new euglena_impl.sys.io.net.HttpRequestManager(post_options);
                        httpConnector.sendMessage(JSON.stringify(impact), (message) => {
                            if (euglena_1.euglena.sys.type.StaticTools.Exception.isNotException(message)) {
                                try {
                                    let impactAssumption = JSON.parse(message);
                                    if (euglena_1.euglena.js.Class.instanceOf(euglena_template_1.euglena_template.reference.being.interaction.Impact, impactAssumption)) {
                                        this.nucleus.receiveParticle(new euglena_template_1.euglena_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption, euglena_template_1.euglena_template.being.alive.constants.organelles.ImpactThrowerOrganelle));
                                    }
                                    else {
                                    }
                                }
                                catch (e) {
                                }
                            }
                            else {
                                //TODO write a eligable exception message
                                this.nucleus.receiveParticle(new euglena_template_1.euglena_template.being.alive.particles.Exception(new Exception(""), euglena_template_1.euglena_template.being.alive.constants.organelles.ImpactThrowerOrganelle));
                            }
                        });
                    }
                }
                organelle.ImpactThrowerOrganelleImplHttp = ImpactThrowerOrganelleImplHttp;
            })(organelle = alive.organelle || (alive.organelle = {}));
        })(alive = being.alive || (being.alive = {}));
    })(being = euglena_impl.being || (euglena_impl.being = {}));
})(euglena_impl = exports.euglena_impl || (exports.euglena_impl = {}));
//# sourceMappingURL=euglena_impl.js.map