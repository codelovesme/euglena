/// <reference path="../../cessnalib_template/typings/tsd.d.ts" />
/**
 * Created by codelovesme on 6/19/2015.
 */

import {cessnalib} from "../node_modules/cessnalib/cessnalib";
import {cessnalib_template} from "../node_modules/cessnalib_template/src/cessnalib_template";
import * as io from "socket.io";
import * as http from "http";

export module cessnalib_impl {
    export namespace being {
        export namespace alive {
            export class StaticTools {
                public static createOrganelleBank(): cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>> {
                    var bank = new cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>>();
                    for (let key in organelles){
                        bank.add(key, new organelles[key]());
                    }
                    return bank;
                }
            }
            export namespace particle {
                export class ConnectedToEuglena implements cessnalib.being.Particle {
                    public className: string = "cessnalib_impl.being.alive.particles.ConnectedToEuglena";
                    constructor(public content: cessnalib.being.alive.EuglenaInfo) { }
                }
                export class ConnectToEuglenaRequest implements cessnalib.being.Particle {
                    public className: string = "cessnalib_impl.being.alive.particles.ConnectToEuglenaRequest";
                    constructor(public content: {
                        euglenaId: string
                    }){ }
                }
            }
            export namespace organelle {
                export class TimeOrganelleImplNistGov extends cessnalib_template.being.alive.organelles.TimeOrganelle {
                    public fetchCurrentTime():void {
                        //TODO
                        this.seed.receiveParticle(new cessnalib_template.being.alive.particles.Time(new cessnalib.sys.type.Time(
                            new cessnalib.sys.type.Date(2016,1,12),
                            new cessnalib.sys.type.Clock(23,12,3)
                        )));
                    }
                }
                //TODO test
                export class WebParticleTransmitterOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebParticleTransmitterOrganelle {
                    private server: SocketIO.Server;
                    public connectToEuglena() {
                        var post_options: http.RequestOptions;
                        post_options.host = this.initialProperties.host;
                        post_options.port = Number(this.initialProperties.port);
                        post_options.path = this.initialProperties.path ? this.initialProperties.path : "/";
                        post_options.method = 'POST';
                        post_options.headers = {
                            'Content-Type': 'application/json'
                        };
                        var server = io("http://" + post_options.host + ":" + post_options.port);
                        server.on("particle", (particleAssumption: any, callback: () => void) => {
                            if (cessnalib.js.Class.instanceOf<cessnalib.being.Particle>(cessnalib_template.reference.being.Particle, particleAssumption)) {
                                this.seed.receiveParticle(particleAssumption);
                            } else {
                                //TODO
                            }
                        });
                        server.on("bind", (particleAssumption: any) => {
                            if (cessnalib.js.Class.instanceOf<cessnalib.being.Particle>(cessnalib_template.reference.being.Particle, particleAssumption)) {
                                this.seed.receiveParticle(particleAssumption);
                            } else {
                                //TODO
                            }
                        });
                        server.on("disconnect", () => {
                            //TODO
                        });
                        server.on("connect", (socket: SocketIO.Socket) => {
                            //TODO
                        });
                    }

                    public throwParticle(particle:cessnalib.being.Particle):void {
                        this.server.emit("particle", particle);
                    }
                }
                //TODO test
                export class WebReceptionOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebReceptionOrganelle {
                    private sockets: cessnalib.sys.type.Map<string, SocketIO.Socket>;
                    public listen():void {
                        this.sockets = new cessnalib.sys.type.Map<string, SocketIO.Socket>();
                        var server = http.createServer((req, res) => {
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
                                        var particleAssumption: cessnalib.being.Particle = JSON.parse(body);
                                        if (cessnalib.js.Class.instanceOf<cessnalib.being.Particle>(cessnalib_template.reference.being.Particle, particleAssumption)) {
                                            this.seed.receiveParticle(particleAssumption);
                                            res.end(JSON.stringify(new cessnalib_template.being.alive.particles.Acknowledge()));
                                        } else {
                                            //TODO
                                        }
                                    } catch (e) {
                                        res.end(JSON.stringify(new cessnalib_template.being.alive.particles.ExceptionOccurred(new cessnalib.sys.type.Exception(e.message))));
                                    }
                                });
                            } else if (req.method == 'GET') {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end('Server is running...\n');
                            }

                        });
                        let socket = io.listen(server);
                        socket.listen(this.initialProperties.port);
                        socket.on("connection", (socket) => {
                            socket.on("bind", (impulse:any) => {
                                this.sockets.set(impulse.param.userId, socket);
                                //TODO fix EuglenaInfo
                                socket.emit("bind", new cessnalib_impl.being.alive.particle.ConnectedToEuglena(null));
                            });
                            socket.on("impulse", (impulse:any) => {
                                this.seed.receiveParticle(impulse);
                                var s = this.sockets.get(impulse.param.userId);
                                if (s) {
                                    //s.emit("response", response);
                                }
                            });
                        });
                    }
                    public throwImpulse(userId: string, impulse: cessnalib.being.Particle): void {
                        var connectedMiddlewares = '';
                        if (this.sockets) {
                            this.sockets.getKeys().forEach((e) => {
                                connectedMiddlewares += e + ",";
                            });
                        }
                        var client = this.sockets.get(userId);
                        if (client) {
                            //client.emit("particle", impulse, (resp: dantoulib.nature.pulse.Impulse) => {
                                //response(resp);
                            //});
                        } else {
                            //response(new cessnalib_template.being.alive.particles.ExceptionOccurred(
                              //  new cessnalib.sys.type.Exception("There is no gateway connected with that id: " + userId)));
                        }
                    }
                }
                export class WebParticleThrowerOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebParticleThrowerOrganelle {
                    private socket: SocketIOClient.Socket;
                    private callbackStack: ((impulse: cessnalib.being.Particle) => void)[];
                    private post_options: http.RequestOptions;

                    initialize() {
                        this.callbackStack = [];
                        this.post_options = {
                            host : this.initialProperties.host,
                            port : Number(this.initialProperties.port),
                            path : this.initialProperties.path ? this.initialProperties.path : "/",
                            method : 'POST',
                            headers : {
                                'Content-Type': 'application/json'
                            }
                        };
                    }
                    public throwParticle(particle: cessnalib.being.Particle): void {
                        var post_req = http.request(this.post_options, (res) => {
                            res.setEncoding('utf8');
                            var str = '';
                            res.on('data', (data: string) => {
                                str += data;
                            });
                            res.on('end', (data: string) => {
                                var particle = JSON.parse(str);
                                this.seed.receiveParticle(particle);
                            });
                        });
                        // post the data
                        var s = JSON.stringify(particle);
                        post_req.write(s);
                        post_req.end();
                    }
                }
            }
            export var organelles:any = {
                "TimeOrganelleImplNistGov": organelle.TimeOrganelleImplNistGov,
                "WebParticleTransmitterOrganelleImplHttp": organelle.WebParticleTransmitterOrganelleImplHttp,
                "WebReceptionOrganelleImplHttp": organelle.WebReceptionOrganelleImplHttp,
                "WebParticleThrowerOrganelleImplHttp": organelle.WebParticleThrowerOrganelleImplHttp
            }
        }
    }
}