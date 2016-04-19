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
import {cessnalib} from "../node_modules/cessnalib/cessnalib";
import {cessnalib_template} from "../../cessnalib_template/src/cessnalib_template";
import * as io from "socket.io";
import * as http from "http";
import {RequestOptions} from "http";
import Exception = cessnalib.sys.type.Exception;
import Impact = cessnalib.being.interaction.Impact;
import * as mongodb from "mongodb";

export module cessnalib_impl {
    export namespace being {
        export namespace alive {
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
                                    cessnalib.js.Class.instanceOf(new cessnalib.sys.type.Time(new cessnalib.sys.type.Date(0,0,0),new cessnalib.sys.type.Clock(0,0,0)),time),
                                    cessnalib_template.being.alive.constants.organelles.WebOrganelle
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
                                this.receiveParticle(new cessnalib_template.being.alive.particles.Time(time,cessnalib_template.being.alive.constants.organelles.WebOrganelle));
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