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
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib");
var cessnalib_template_1 = require("../node_modules/cessnalib_template/src/cessnalib_template");
var io = require("socket.io");
var http = require("http");
var Exception = cessnalib_1.cessnalib.sys.type.Exception;
var mongodb = require("mongodb");
var cessnalib_impl;
(function (cessnalib_impl) {
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
    })(sys = cessnalib_impl.sys || (cessnalib_impl.sys = {}));
    var being;
    (function (being) {
        var alive;
        (function (alive) {
            class StaticTools {
                static createOrganelleBank() {
                    var bank = new cessnalib_1.cessnalib.sys.type.Map();
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
                class WebOrganelleImplHttp extends cessnalib_template_1.cessnalib_template.being.alive.organelles.WebOrganelle {
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.web.constants.incomingparticles.ReturnCurrentTime:
                                this.fetchCurrentTime();
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.web.constants.incomingparticles.ReturnIfConnectedToTheInternet:
                                this.checkInternetConnection();
                                break;
                        }
                    }
                    checkInternetConnection() {
                        new cessnalib_impl.sys.io.net.HttpRequestManager({
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
                                let date = new cessnalib_1.cessnalib.sys.type.Date(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDay());
                                let clock = new cessnalib_1.cessnalib.sys.type.Clock(jsDate.getUTCHours(), jsDate.getUTCMinutes(), jsDate.getSeconds());
                                let time = new cessnalib_1.cessnalib.sys.type.Time(date, clock);
                                //this.receiveParticle(new cessnalib_template.being.alive.particles.Time(time));
                                this.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.ConnectedToTheInternet(cessnalib_1.cessnalib.js.Class.instanceOf(new cessnalib_1.cessnalib.sys.type.Time(new cessnalib_1.cessnalib.sys.type.Date(0, 0, 0), new cessnalib_1.cessnalib.sys.type.Clock(0, 0, 0)), time), cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.WebOrganelle));
                            }
                            else {
                            }
                        });
                    }
                    fetchCurrentTime() {
                        new cessnalib_impl.sys.io.net.HttpRequestManager({
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
                                let date = new cessnalib_1.cessnalib.sys.type.Date(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDay());
                                let clock = new cessnalib_1.cessnalib.sys.type.Clock(jsDate.getUTCHours(), jsDate.getUTCMinutes(), jsDate.getSeconds());
                                let time = new cessnalib_1.cessnalib.sys.type.Time(date, clock);
                                this.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Time(time, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.WebOrganelle));
                            }
                            else {
                            }
                        });
                    }
                }
                organelle.WebOrganelleImplHttp = WebOrganelleImplHttp;
                class DbOrganelleImplMongoDb extends cessnalib_template_1.cessnalib_template.being.alive.organelles.DbOrganelle {
                    constructor() {
                        super();
                        this.euglenaInfos = new cessnalib_1.cessnalib.sys.type.Map();
                        this.euglenaInfos.add("idcore", new cessnalib_1.cessnalib.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
                        this.euglenaInfos.add("postman", new cessnalib_1.cessnalib.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
                    }
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.db.constants.StartDatabase:
                                let this3_ = this;
                                let startDatabase = particle;
                                mongodb.MongoClient.connect("mongodb://" + this.initialProperties.url + ":" + this.initialProperties.port + "/" + startDatabase.content.euglenaName, (err, db) => {
                                    if (!err) {
                                        this.db = db;
                                        this3_.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.db.outgoingparticles.DbIsOnline(particle.of));
                                    }
                                    else {
                                    }
                                });
                                break;
                            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.ReadParticle:
                                let readParticle = particle;
                                let this_ = this;
                                this.db.collection(readParticle.name).find({ of: readParticle.of }).toArray((err, doc) => {
                                    this_.nucleus.receiveParticle(doc[0]);
                                });
                                break;
                            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.RemoveParticle:
                                this.db.collection(particle.name).findOneAndDelete({ of: particle.of }, (err, doc) => {
                                    //TODO
                                });
                                break;
                            case cessnalib_template_1.cessnalib_template.being.alive.constants.impacts.SaveParticle:
                                let saveParticle = particle;
                                let this2_ = this;
                                this.db.collection(saveParticle.name).findOneAndUpdate({ name: saveParticle.content.name }, saveParticle.content, { upsert: true }, (err, document) => {
                                    if (err) {
                                    }
                                    else {
                                        this2_.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Acknowledge({ of: saveParticle.name, id: saveParticle.content.particle.name }, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.DbOrganelle));
                                    }
                                });
                                break;
                        }
                    }
                }
                organelle.DbOrganelleImplMongoDb = DbOrganelleImplMongoDb;
                class TimeOrganelleJs extends cessnalib_template_1.cessnalib_template.being.alive.organelles.TimeOrganelle {
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.SetTime:
                                this.time = particle.content;
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.StartClock:
                                setInterval(() => {
                                    //let newDate = new Date(this.time.date.year, this.time.date.month - 1, this.time.date.day,
                                    //    this.time.clock.hour, this.time.clock.minute, this.time.clock.second + 1);
                                    let newDate = new Date();
                                    if (newDate.getSeconds() != this.time.clock.second) {
                                        this.time.clock.second = newDate.getSeconds();
                                        //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Second(this.time.clock.second));
                                        if (newDate.getMinutes() != this.time.clock.minute) {
                                            this.time.clock.minute = newDate.getMinutes();
                                            //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Minute(this.time.clock.minute));
                                            if (newDate.getHours() != this.time.clock.hour) {
                                                this.time.clock.hour = newDate.getHours();
                                                //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Hour(this.time.clock.hour));
                                                if (newDate.getDate() != this.time.date.day) {
                                                    this.time.date.day = newDate.getDate();
                                                    //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Day(this.time.date.day));
                                                    if (newDate.getMonth() + 1 != this.time.date.month) {
                                                        this.time.date.month = newDate.getMonth() + 1;
                                                        //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Month(this.time.date.month));
                                                        if (newDate.getFullYear() != this.time.date.year) {
                                                            this.time.date.year = newDate.getFullYear();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    this.saveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Time(this.time, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.TimeOrganelle));
                                }, 1000);
                                break;
                        }
                    }
                }
                organelle.TimeOrganelleJs = TimeOrganelleJs;
                class ImpactTransmitterOrganelleImplHttp extends cessnalib_template_1.cessnalib_template.being.alive.organelles.ImpactTransmitterOrganelle {
                    constructor() {
                        super();
                        this.servers = {};
                    }
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ConnectToEuglena:
                                this.connectToEuglena(particle.content);
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ThrowImpact:
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
                            if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.interaction.Impact, impactAssumption)) {
                                //TODO
                                //callback(new cessnalib_template.being.alive.particles.Acknowledge());
                                this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.ImpactTransmitterOrganelle));
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
                class ReceptionOrganelleImplHttp extends cessnalib_template_1.cessnalib_template.being.alive.organelles.ReceptionOrganelle {
                    constructor() {
                        super();
                        this.sockets = {};
                    }
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.constants.incomingparticles.Listen:
                                this.listen();
                                break;
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.constants.incomingparticles.ThrowImpact:
                                let throwImpactContent = particle.content;
                                this.throwImpact(throwImpactContent.to, throwImpactContent.impact);
                                break;
                        }
                    }
                    listen() {
                        let server = http.createServer((req, res) => {
                            if (req.method == 'POST') {
                                var body = '';
                                req.on('data', (data) => {
                                    body += data;
                                    // Too much POST data, kill the connection!
                                    if (body.length > 1e6)
                                        req.socket.destroy();
                                });
                                req.on('end', () => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    let impactAssumption = null;
                                    let result = { result: "Internal Server Error!" };
                                    try {
                                        impactAssumption = JSON.parse(body);
                                        if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.interaction.Impact, impactAssumption) &&
                                            cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.Particle, impactAssumption.particle)) {
                                            result = { result: "ok" };
                                        }
                                        else {
                                            //TODO
                                            result = { result: "Request format is uncorrect !" };
                                            impactAssumption = null;
                                        }
                                    }
                                    catch (e) {
                                        //TODO
                                        result = { result: "Request format is uncorrect !" };
                                        impactAssumption = null;
                                    }
                                    if (impactAssumption) {
                                        this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.ReceptionOrganelle));
                                    }
                                    else {
                                    }
                                    res.end(JSON.stringify(result));
                                });
                            }
                            else if (req.method == 'GET') {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end('Server is running...\n');
                            }
                        });
                        let socket = io.listen(server);
                        server.listen(this.initialProperties.port);
                        socket.on("connection", (socket) => {
                            socket.on("bind", (impact) => {
                                this.sockets[impact.particle.of] = socket;
                                //TODO
                                socket.emit("bind", null);
                            });
                            socket.on("impact", (impactAssumption) => {
                                //TODO
                                this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.ReceptionOrganelle));
                                //var s = this.sockets[impulse];
                                //if (s) {
                                //s.emit("response", response);
                                //}
                            });
                        });
                    }
                    throwImpact(to, impact) {
                        var client = this.sockets[to.name];
                        if (client) {
                            client.emit("impact", impact, (resp) => {
                                //TODO
                            });
                        }
                        else {
                        }
                    }
                }
                organelle.ReceptionOrganelleImplHttp = ReceptionOrganelleImplHttp;
                class ImpactThrowerOrganelleImplHttp extends cessnalib_template_1.cessnalib_template.being.alive.organelles.ImpactThrowerOrganelle {
                    receiveParticle(particle) {
                        switch (particle.name) {
                            case cessnalib_template_1.cessnalib_template.being.ghost.euglena.impactthrower.constants.incomingparticles.ThrowImpact:
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
                        let httpConnector = new cessnalib_impl.sys.io.net.HttpRequestManager(post_options);
                        httpConnector.sendMessage(JSON.stringify(impact), (message) => {
                            if (cessnalib_1.cessnalib.sys.type.StaticTools.Exception.isNotException(message)) {
                                try {
                                    let impactAssumption = JSON.parse(message);
                                    if (cessnalib_1.cessnalib.js.Class.instanceOf(cessnalib_template_1.cessnalib_template.reference.being.interaction.Impact, impactAssumption)) {
                                        this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption, cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.ImpactThrowerOrganelle));
                                    }
                                    else {
                                    }
                                }
                                catch (e) {
                                }
                            }
                            else {
                                //TODO write a eligable exception message
                                this.nucleus.receiveParticle(new cessnalib_template_1.cessnalib_template.being.alive.particles.Exception(new Exception(""), cessnalib_template_1.cessnalib_template.being.alive.constants.organelles.ImpactThrowerOrganelle));
                            }
                        });
                    }
                }
                organelle.ImpactThrowerOrganelleImplHttp = ImpactThrowerOrganelleImplHttp;
            })(organelle = alive.organelle || (alive.organelle = {}));
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib_impl.being || (cessnalib_impl.being = {}));
})(cessnalib_impl = exports.cessnalib_impl || (exports.cessnalib_impl = {}));
//# sourceMappingURL=cessnalib_impl.js.map