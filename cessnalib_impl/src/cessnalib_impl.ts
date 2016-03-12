/**
 * Created by codelovesme on 6/19/2015.
 */

/*
* TODO List
* Environment geriye exception donmeli mi problem ciktiginda yoksa loglayip gecmeli mi ?0
*/

/// <reference path="../typings/socket.io/socket.io.d.ts" />


import {cessnalib} from "../node_modules/cessnalib/cessnalib";
import {cessnalib_template} from "../node_modules/cessnalib_template/src/cessnalib_template";
import * as io from "socket.io";
import * as http from "http";
import {RequestOptions} from "http";
import Exception = cessnalib.sys.type.Exception;
import Impact = cessnalib.being.interaction.Impact;

export module cessnalib_impl {
    export namespace sys {
        export namespace io {
            export namespace net {
                export class HttpRequestManager {
                    constructor(public post_options:RequestOptions){ }
                    public sendMessage(message:string,callback:cessnalib.sys.type.Callback<string>):void{
                        var req = http.request(this.post_options, (res) => {
                            res.setEncoding('utf8');
                            var str = '';
                            res.on('data', (data: string) => {
                                str += data;
                            });
                            res.on('end', (data: string) => {
                                callback(str);
                            });
                        });
                        req.setTimeout(10000, () => {
                            req.abort();
                            callback(new Exception("Request timed out."));
                        });
                        req.on('error', (e: any) => {
                            callback(new Exception("problem with request: " + e.message));
                        });
                        if(message) req.write(message);
                        req.end();
                    }
                }
            }
        }
    }
    export namespace being {
        export namespace alive {
            export class StaticTools {
                public static createOrganelleBank(): cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>> {
                    var bank = new cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>>();
                    bank.add(constants.organelles.ImpactThrowerOrganelleImplHttp, new alive.organelle.ImpactThrowerOrganelleImplHttp());
                    bank.add(constants.organelles.ImpactTransmitterOrganelleImplHttp, new alive.organelle.ImpactTransmitterOrganelleImplHttp());
                    bank.add(constants.organelles.ReceptionOrganelleImplHttp, new alive.organelle.ReceptionOrganelleImplHttp());
                    bank.add(constants.organelles.WebOrganelleImplHttp, new alive.organelle.WebOrganelleImplHttp());
                    bank.add(constants.organelles.TimeOrganelleImplJs,new alive.organelle.TimeOrganelleJs());
                    bank.add(constants.organelles.DbOrganelleImplNeDb,new alive.organelle.DbOrganelleImplNeDb());
                    return bank;
                }
            }
            export namespace constants {
                export namespace organelles {
                    export const DbOrganelleImplNeDb = "DbOrganelleImplNeDb";
                    export const WebOrganelleImplHttp = "WebOrganelleImplHttp";
                    export const ReceptionOrganelleImplHttp = "ReceptionOrganelleImplHttp";
                    export const ImpactTransmitterOrganelleImplHttp = "ImpactTransmitterOrganelleImplHttp";
                    export const ImpactThrowerOrganelleImplHttp = "ImpactThrowerOrganelleImplHttp";
                    export const TimeOrganelleImplJs = "TimeOrganelleImplJs";
                }
            }
            export namespace organelle {
                import Particle = cessnalib.being.Particle;
                export class WebOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebOrganelle {
                    public receiveParticle(particle:Particle) {
                        switch (particle.name){
                            case cessnalib_template.being.ghost.euglena.web.constants.incomingparticles.ReturnCurrentTime:
                                this.fetchCurrentTime();
                                break;
                            case cessnalib_template.being.ghost.euglena.web.constants.incomingparticles.ReturnIfConnectedToTheInternet:
                                this.checkInternetConnection();
                                break;
                        }
                    }
                    private checkInternetConnection(): void{
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
                                let jsDate = new Date(result as string);
                                let date = new cessnalib.sys.type.Date(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDay());
                                let clock = new cessnalib.sys.type.Clock(jsDate.getUTCHours(), jsDate.getUTCMinutes(), jsDate.getSeconds());
                                let time = new cessnalib.sys.type.Time(date, clock);
                                //this.receiveParticle(new cessnalib_template.being.alive.particles.Time(time));
                                this.receiveParticle(new cessnalib_template.being.alive.particles.ConnectedToTheInternet(
                                    cessnalib.js.Class.instanceOf(new cessnalib.sys.type.Time(new cessnalib.sys.type.Date(0,0,0),new cessnalib.sys.type.Clock(0,0,0)),time)
                                ));
                            } else {
                                //TODO
                            }
                        });
                    }
                    private fetchCurrentTime(): void {
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
                                let jsDate = new Date(result as string);
                                let date = new cessnalib.sys.type.Date(jsDate.getUTCFullYear(),jsDate.getUTCMonth()+1,jsDate.getUTCDay());
                                let clock = new cessnalib.sys.type.Clock(jsDate.getUTCHours(),jsDate.getUTCMinutes(),jsDate.getSeconds());
                                let time = new cessnalib.sys.type.Time(date,clock);
                                this.receiveParticle(new cessnalib_template.being.alive.particles.Time(time));
                            } else {
                                //TODO
                            }
                        });
                    }
                }
                export class DbOrganelleImplNeDb extends cessnalib_template.being.alive.organelles.DbOrganelle {
                    private array:Array<string>;
                    constructor(){
                        super();
                        this.array = [];
                    }
                    public receiveParticle(particle: Particle): void {
                        switch (particle.name) {
                            case cessnalib_template.being.ghost.euglena.db.constants.incomingparticles.Save:
                                break;
                            case cessnalib_template.being.ghost.euglena.db.constants.incomingparticles.Remove:
                                break;
                            case cessnalib_template.being.ghost.euglena.db.constants.incomingparticles.Read:
                                break;
                            case cessnalib_template.being.ghost.euglena.db.constants.incomingparticles.DoesTokenExist:
                                let content = particle.content as cessnalib_template.being.ghost.euglena.db.incomingparticles.DoesTokenExistContent;
                                this.nucleus.receiveParticle(new cessnalib_template.being.ghost.euglena.db.outgoingparticles.TokenIsValid(content.token)); 
                                break;
                        }
                    }
                }
                export class TimeOrganelleJs extends cessnalib_template.being.alive.organelles.TimeOrganelle {
                    private time: cessnalib.sys.type.Time;
                    public receiveParticle(particle: Particle): void {
                        switch (particle.name) {
                            case cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.SetTime:
                                this.time = particle.content;
                                break;
                            case cessnalib_template.being.ghost.euglena.time.constants.incomingparticles.StartClock:
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
                                                            //this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Year(this.time.date.year));
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Time(this.time));
                                }, 1000);
                                break;
                        }
                    }
                }
                export class ImpactTransmitterOrganelleImplHttp extends cessnalib_template.being.alive.organelles.ImpactTransmitterOrganelle {
                    private servers: any = {};
                    public receiveParticle(particle:Particle):void {
                        switch (particle.name){
                            case cessnalib_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ConnectToEuglena:
                                this.connectToEuglena(particle.content);
                                break;
                            case cessnalib_template.being.ghost.euglena.impacttransmitter.constants.incomingparticles.ThrowImpact:
                                let throwImpactContent = particle.content as cessnalib_template.being.ghost.euglena.impacttransmitter.incomingparticles.ThrowImpactContent;
                                this.throwImpact(throwImpactContent.to,throwImpactContent.impact);
                                break;
                        }
                    }
                    private connectToEuglena(euglenaInfo: cessnalib.being.alive.EuglenaInfo) {
                        if (this.servers[euglenaInfo.name]) {
                            return;
                        }
                        var post_options: http.RequestOptions;
                        post_options.host = euglenaInfo.url;
                        post_options.port = Number(euglenaInfo.port);
                        post_options.path = "/";
                        post_options.method = 'POST';
                        post_options.headers = {
                            'Content-Type': 'application/json'
                        };
                        let server = io("http://" + post_options.host + ":" + post_options.port);
                        this.servers[euglenaInfo.name] = server;
                        server.on("impact", (impactAssumption: any, callback: (impact:cessnalib.being.interaction.Impact) => void) => {
                            if (cessnalib.js.Class.instanceOf<cessnalib.being.interaction.Impact>(cessnalib_template.reference.being.interaction.Impact, impactAssumption)) {
                                //TODO
                                //callback(new cessnalib_template.being.alive.particles.Acknowledge());
                                this.nucleus.receiveParticle(new cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption));
                            } else {
                                //TODO
                            }
                        });
                        server.on("bind", (impactAssumption: any) => {
                            //TODO
                        });
                        server.on("disconnect", () => {
                            //TODO
                        });
                        server.on("connect", (socket: SocketIO.Socket) => {
                            socket.emit("bind", null);
                            //TODO
                        });
                    }
                    private throwImpact(to: cessnalib.being.alive.EuglenaInfo, impact: cessnalib.being.interaction.Impact): void {
                        let server = this.servers[to.name];
                        if (server){
                            server.emit("impact", impact);
                        } else {
                            //TODO
                        }
                    }
                }
                export class ReceptionOrganelleImplHttp extends cessnalib_template.being.alive.organelles.ReceptionOrganelle {
                    private sockets: any = {};
                    public receiveParticle(particle:Particle): void {
                        switch (particle.name){
                            case cessnalib_template.being.ghost.euglena.reception.constants.incomingparticles.Listen:
                                this.listen();
                                break;
                            case cessnalib_template.being.ghost.euglena.reception.constants.incomingparticles.ThrowImpact:
                                let throwImpactContent = particle.content as cessnalib_template.being.ghost.euglena.reception.incomingparticles.ThrowImpactContent;
                                this.throwImpact(throwImpactContent.to, throwImpactContent.impact);
                                break;
                        }
                    }
                    private listen():void {
                        let server = http.createServer((req, res) => {
                            if (req.method == 'POST') {
                                var body = '';
                                req.on('data', (data: string) => {
                                    body += data;
                                    // Too much POST data, kill the connection!
                                    if (body.length > 1e6)
                                        req.socket.destroy();
                                });
                                req.on('end', () => {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    try {
                                        var impactAssumption = JSON.parse(body);
                                        if (cessnalib.js.Class.instanceOf<cessnalib.being.interaction.Impact>(cessnalib_template.reference.being.interaction.Impact, impactAssumption) &&
                                            cessnalib.js.Class.instanceOf<cessnalib.being.Particle>(cessnalib_template.reference.being.Particle, (impactAssumption as cessnalib.being.interaction.Impact).particle)) {
                                            this.nucleus.receiveParticle(new cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption as cessnalib.being.interaction.Impact));
                                            res.end(JSON.stringify(new cessnalib_template.being.alive.particles.Acknowledge()));
                                        } else {
                                            //TODO
                                        }
                                    } catch (e) {
                                        //TODO
                                        res.end("Request format is uncorrect !");
                                    }
                                });
                            } else if (req.method == 'GET') {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end('Server is running...\n');
                            }

                        });
                        let socket = io.listen(server);
                        socket.listen(this.initialProperties.port);
                        socket.on("connection", (socket:any) => {
                            socket.on("bind", (impact:cessnalib.being.interaction.Impact) => {
                                this.sockets[impact.from] = socket;

                                //TODO
                                socket.emit("bind", null);
                            });
                            socket.on("impact", (impactAssumption:cessnalib.being.interaction.Impact) => {
                                //TODO
                                this.nucleus.receiveParticle(new cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption as cessnalib.being.interaction.Impact));
                                //var s = this.sockets[impulse];
                                //if (s) {
                                    //s.emit("response", response);
                                //}
                            });
                        });
                    }
                    private throwImpact(to: cessnalib.being.alive.EuglenaInfo, impact: cessnalib.being.interaction.Impact): void {
                        var client = this.sockets[to.name];
                        if (client) {
                            client.emit("impact", impact, (resp: cessnalib.being.interaction.Impact) => {
                                //TODO
                            });
                        } else {
                            //TODO
                            //response(new cessnalib_template.being.alive.particles.ExceptionOccurred(
                              //  new cessnalib.sys.type.Exception("There is no gateway connected with that id: " + userId)));
                        }
                    }
                }
                export class ImpactThrowerOrganelleImplHttp extends cessnalib_template.being.alive.organelles.ImpactThrowerOrganelle {
                    private httpConnector: cessnalib_impl.sys.io.net.HttpRequestManager;
                    public receiveParticle(particle: Particle): void {
                        switch (particle.name){
                            case cessnalib_template.being.ghost.euglena.impactthrower.constants.incomingparticles.ThrowImpact:
                                this.throwImpact(
                                    (particle.content as cessnalib_template.being.ghost.euglena.impactthrower.incomingparticles.ThrowImpactContent).to,
                                    (particle.content as cessnalib_template.being.ghost.euglena.impactthrower.incomingparticles.ThrowImpactContent).impact);
                                break;
                        }
                    }
                    private throwImpact(to:cessnalib.being.alive.EuglenaInfo,impact: cessnalib.being.interaction.Impact): void {
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
                                if (cessnalib.sys.type.StaticTools.Exception.isNotException<string>(message)) {
                                    try {
                                        let impactAssumption = JSON.parse(message);
                                        if (cessnalib.js.Class.instanceOf(cessnalib_template.reference.being.interaction.Impact,impactAssumption)){
                                            this.nucleus.receiveParticle(new cessnalib_template.being.ghost.euglena.reception.outgoingparticles.ImpactReceived(impactAssumption as cessnalib.being.interaction.Impact));
                                        } else {
                                            //TODO log
                                        }
                                    } catch (e) {
                                        //TODO
                                    }
                                } else {
                                    //TODO write a eligable exception message
                                    this.nucleus.receiveParticle(new cessnalib_template.being.alive.particles.Exception(new Exception("")));
                                }
                            
                        });
                    }
                }
            }
        }
    }
}