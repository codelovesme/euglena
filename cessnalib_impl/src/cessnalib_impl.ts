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
import {euglena} from "../node_modules/euglena/euglena";
import {euglena_template} from "../../euglena_template/src/euglena_template";
import * as io from "socket.io";
import * as http from "http";
import {RequestOptions} from "http";
import Exception = euglena.sys.type.Exception;
import Impact = euglena.being.interaction.Impact;
import * as mongodb from "mongodb";

export module euglena_impl {
    export namespace being {
        export namespace alive {
            export namespace organelle {
                import Particle = euglena.being.Particle;
                export class WebOrganelleImplHttp extends euglena_template.being.alive.organelles.WebOrganelle {
                    public receiveParticle(particle:Particle) {
                        switch (particle.name){
                            case euglena_template.being.ghost.euglena.web.constants.incomingparticles.ReturnCurrentTime:
                                this.fetchCurrentTime();
                                break;
                            case euglena_template.being.ghost.euglena.web.constants.incomingparticles.ReturnIfConnectedToTheInternet:
                                this.checkInternetConnection();
                                break;
                        }
                    }
                    private checkInternetConnection(): void{
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
                                let jsDate = new Date(result as string);
                                let date = new euglena.sys.type.Date(jsDate.getUTCFullYear(), jsDate.getUTCMonth() + 1, jsDate.getUTCDay());
                                let clock = new euglena.sys.type.Clock(jsDate.getUTCHours(), jsDate.getUTCMinutes(), jsDate.getSeconds());
                                let time = new euglena.sys.type.Time(date, clock);
                                //this.receiveParticle(new euglena_template.being.alive.particles.Time(time));
                                this.receiveParticle(new euglena_template.being.alive.particles.ConnectedToTheInternet(
                                    euglena.js.Class.instanceOf(new euglena.sys.type.Time(new euglena.sys.type.Date(0,0,0),new euglena.sys.type.Clock(0,0,0)),time),
                                    euglena_template.being.alive.constants.organelles.WebOrganelle
                                ));
                            } else {
                                //TODO
                            }
                        });
                    }
                    private fetchCurrentTime(): void {
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
                                let jsDate = new Date(result as string);
                                let date = new euglena.sys.type.Date(jsDate.getUTCFullYear(),jsDate.getUTCMonth()+1,jsDate.getUTCDay());
                                let clock = new euglena.sys.type.Clock(jsDate.getUTCHours(),jsDate.getUTCMinutes(),jsDate.getSeconds());
                                let time = new euglena.sys.type.Time(date,clock);
                                this.receiveParticle(new euglena_template.being.alive.particles.Time(time,euglena_template.being.alive.constants.organelles.WebOrganelle));
                            } else {
                                //TODO
                            }
                        });
                    }
                }
            }
        }
    }
}