/// <reference path="../../euglena/typings/node/node.d.ts" />

"use strict";

/**
 * Created by codelovesme on 6/19/2015.
 */
import {euglena} from "../node_modules/euglena/euglena/src/euglena";
import * as path from "path";
import * as fs from "fs";
var jsonminify = require("jsonminify");
import Exception = euglena.sys.type.Exception;
import ParticleReference = euglena.being.alive.dna.ParticleReference;

import Impact = euglena.being.interaction.Impact;
import interaction = euglena.being.interaction;

export module euglena_template {
    export namespace injection {
        export class StaticTools {
            public static readFileParticles(applicationDirectory:string): euglena.injection.Configuration {
                let particles = fs.readFileSync(path.join(path.resolve(applicationDirectory), "particles.json"), "utf8");
                return JSON.parse(jsonminify(particles));
            }
        }
    }
    export namespace being {
        export namespace particles {
            export class BooleanParticle extends euglena.being.Particle {
                constructor(name:string,content:boolean,of:string){ super(name,content,of); }
            }
            export class VoidParticle extends euglena.being.Particle {
                constructor(name:string,of:string){ super(name,null,of); }
            }
        }
        export namespace alive {
            import Particle = euglena.being.Particle;
            import Body = euglena.being.alive.Body;
            import Gene = euglena.being.alive.dna.Gene;
            import Reaction = euglena.being.alive.dna.Reaction;
            import Time = euglena.sys.type.Time;
            export namespace constants {
                export namespace particles {
                    export const OrganelleList = "OrganelleList";
                    export const DbOrganelleInitialProperties = "DbOrganelleInitialProperties";
                    export const WebOrganelleInitialProperties = "WebOrganelleInitialProperties";
                    export const ReceptionOrganelleInitialProperties = "ReceptionOrganelleInitialProperties";
                    export const EuglenaName = "EuglenaName";
                    export const ImpactReceived = "ImpactReceived";
                    export const EuglenaHasBeenBorn = "EuglenaHasBeenBorn";
                    export const EuglenaHasBeenDivided = "EuglenaHasBeenDivided";
                    export const Acknowledge = "Acknowledge";
                    export const Time = "Time";
                    export const Exception = "Exception";
                    export const ConnectedToTheInternet = "ConnectedToTheInternet";
                    export const Token = "Token";
                    export const Impacts = "Impacts";
                    export const DoesParticleExist = "DoesParticleExist";
                    export const DoesUniqueParticleExist = "DoesUniqueParticleExist";
                }
                export namespace organelles {
                    export const Net = "ReceptionOrganelle";
                    export const TimeOrganelle = "TimeOrganelle";
                    export const WebOrganelle = "WebOrganelle";
                    export const Db = "DbOrganelle";
                    export const Nucleus = "NucleusOrganelle";
                }
                export namespace impacts {
                    export const TimeChanged = "TimeChanged";
                    export const ExceptionOccurred = "ExceptionOccurred";
                    export const SaveParticle = "SaveParticle";
                    export const ReadParticle = "ReadParticle";
                    export const ReadParticles = "ReadParticles";
                    export const RemoveParticle = "RemoveParticle";
                }
            }
            export namespace organelles {
                import Organelle = euglena.being.alive.Organelle;
                export abstract class Nucleus extends Organelle<{applicationDir:string}>{
                    constructor(className:string){super(alive.constants.organelles.Nucleus,className)}
                }
                export abstract class TimeOrganelle extends Organelle<{}> {
                    constructor(className:string) { super(alive.constants.organelles.TimeOrganelle,className);}
                }
                export abstract class ReceptionOrganelle extends Organelle<{port:string,euglenaInfo:euglena.being.alive.EuglenaInfo}> {
                    constructor(className:string) { super(constants.organelles.Net,className); }
                }
                export abstract class WebOrganelle extends Organelle<{port:string}>{
                    constructor(className:string) { super(constants.organelles.WebOrganelle,className); }
                }
                export abstract class DbOrganelle extends Organelle<{url:string,port:number}>{
                    constructor(className:string) { super(constants.organelles.Db,className); }
                }
            }
            export namespace particles {
                export class OrganelleList extends Particle {
                    constructor(content:Array<string>,of:string){super(constants.particles.OrganelleList,content,of);}
                }
                export class Token extends Particle {
                    constructor(content:string,of:string){super(constants.particles.Token,content,of);}
                }
                export class Exception extends euglena.being.Particle {
                    constructor(content: euglena.sys.type.Exception,of:string) { super(constants.particles.Exception, content,of); }
                }
                export class Time extends euglena.being.Particle {
                    constructor(content: euglena.sys.type.Time,of:string) { super(constants.particles.Time, content,of); }
                }
                export interface AcknowledgeContent{
                    of:string,
                    id:string
                }
                export class Acknowledge extends being.particles.VoidParticle {
                    constructor(content:AcknowledgeContent,of:string){ super(constants.particles.Acknowledge,of); }
                }
                export class ConnectedToTheInternet extends being.particles.BooleanParticle{
                    constructor(content:boolean,of:string){ super(constants.particles.ConnectedToTheInternet,content,of); }
                }
                export class EuglenaHasBeenBorn extends being.particles.BooleanParticle {
                    constructor(of:string) { super(constants.particles.EuglenaHasBeenBorn,true,of); }
                }
                export class EuglenaHasBeenDivided extends being.particles.BooleanParticle {
                    constructor(of:string) { super(constants.particles.EuglenaHasBeenDivided,true,of); }
                }
                export class SaveParticle extends Particle {
                    constructor(content:Particle,of:string) { super(constants.impacts.SaveParticle, content,of); }
                }
                export class ReadParticle extends Particle {
                    constructor(content:euglena.being.alive.dna.ParticleReference,of:string){ super(constants.impacts.ReadParticle,content,of); }
                }
                export class ReadParticles extends Particle {
                    constructor(particleName:string,of:string){ super(constants.impacts.ReadParticles,particleName,of); }
                }
                export interface RemoveParticleContent {
                    name: string,
                    of: string
                }
                export class RemoveParticle extends Particle {
                    constructor(content:RemoveParticleContent,of:string){ super(constants.impacts.RemoveParticle,content,of); }
                }
                export interface DoesParticleExistContent {
                    name:string,
                    of:string
                }
                export class DoesParticleExist extends Particle {
                    constructor(content:DoesParticleExistContent,of:string){super(alive.constants.particles.DoesParticleExist,content,of);}
                }
                export class ImpactReceived extends euglena.being.Particle {
                    constructor(public content:Impact,of:string) { super(constants.particles.ImpactReceived,content,of); }
                }
            }
            export class StaticTools{
                public static instantiateEuglena(applicationDirectory: string,euglenaName:string): Body {
                    let receive = (particle:Particle,response?:interaction.Response)=>{
                        //TODO
                    }
                    let body = euglena.being.alive.Body.generateInstance(injection.StaticTools.readFileParticles(applicationDirectory),receive);
                    
                    let files = fs.readdirSync(path.join(applicationDirectory, "./organelles"));
                    let organelleList: Array<string> = body.getParticle(new ParticleReference(constants.particles.OrganelleList, euglenaName)).content;
                    for (let file of files) {
                        let organelle = <euglena.being.alive.Organelle<{}>>new (require(path.join(applicationDirectory, "./organelles/", file))).Organelle();
                        if (organelleList.indexOf(organelle.name) < 0) continue;
                        switch (organelle.name) {
                            case euglena_template.being.alive.constants.organelles.WebOrganelle:
                                organelle.initialProperties = body.getParticle(new ParticleReference(euglena_template.being.alive.constants.particles.WebOrganelleInitialProperties, euglenaName)).content;
                                break;
                            case euglena_template.being.alive.constants.organelles.Net:
                                organelle.initialProperties = body.getParticle(new ParticleReference(euglena_template.being.alive.constants.particles.ReceptionOrganelleInitialProperties, euglenaName)).content;
                            default:
                                break;
                        }
                        body.setOrganelle(organelle);
                    }
                    
                    body.transmit(
                        constants.organelles.Nucleus,
                        new euglena_template.being.alive.particles.EuglenaHasBeenDivided(
                            body.getParticle(
                                new euglena.being.alive.dna.ParticleReference(
                                    euglena_template.being.alive.constants.particles.EuglenaName,
                                    euglenaName)
                            ).content
                        )
                    );
                    return body;
                }
            }
        }
        export namespace ghost {
            export namespace organelle {
                export namespace impactthrower {
                    export namespace incomingparticles {
                        export interface ThrowImpactContent {
                            to: euglena.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends euglena.being.Particle {
                            constructor(content: { to: euglena.being.alive.EuglenaInfo, impact: Impact },of:string) { super(constants.incomingparticles.ThrowImpact, content,of); }
                        }
                    }
                    export namespace constants {
                        export namespace incomingparticles {
                            export const ThrowImpact = "ThrowImpact";
                        }
                    }
                }
                export namespace reception {
                    export namespace incomingparticles {
                        export class Listen extends being.particles.VoidParticle {
                            constructor(of:string) { super(constants.incomingparticles.Listen,of); }
                        }
                        export interface ThrowImpactContent {
                            to: euglena.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends euglena.being.Particle {
                            constructor(content: ThrowImpactContent,of:string) { super(constants.incomingparticles.ThrowImpact, content,of); }
                        }
                    }
                    export namespace outgoingparticles {
                        export class ImpactReceived extends euglena.being.Particle {
                            constructor(impact:euglena.being.interaction.Impact,of:string) { super(constants.outgoingparticles.ImpactReceived,impact,of); }
                        }
                        export class ConnectedToEuglena extends euglena.being.Particle{
                            constructor(euglenaInfo:euglena.being.alive.EuglenaInfo,of:string){super(constants.outgoingparticles.ConnectedToEuglena,euglenaInfo,of);}
                        }
                        export class DisconnectedFromEuglena extends euglena.being.Particle{
                            constructor(euglenaInfo:euglena.being.alive.EuglenaInfo,of:string){super(constants.outgoingparticles.ConnectedToEuglena,euglenaInfo,of);}
                        }
                    }
                    export namespace constants {
                        export namespace incomingparticles {
                            export const Listen = "Listen";
                            export const ThrowImpact = "ThrowImpact";
                        }
                        export namespace outgoingparticles {
                            export const ImpactReceived = "ImpactReceived";
                            export const ConnectedToEuglena = "ConnectedToEuglena";
                            export const DisconnectedFromEuglena = "DisconnectedFromEuglena";
                        }
                    }
                }
                export namespace impacttransmitter {
                    export namespace incomingparticles {
                        export class ConnectToEuglena extends euglena.being.Particle {
                            constructor(euglenaInfo: euglena.being.alive.EuglenaInfo,of:string) {
                                super(constants.incomingparticles.ConnectToEuglena, euglenaInfo,of);
                            }
                        }
                        export interface ThrowImpactContent {
                            to: euglena.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends euglena.being.Particle {
                            constructor(content: { to: string, impact: ThrowImpactContent},of:string) { super(constants.incomingparticles.ThrowImpact,content,of); }
                        }
                    }
                    export namespace constants {
                        export namespace incomingparticles {
                            export const ConnectToEuglena = "ConnectToEuglena";
                            export const ThrowImpact = "ThrowImpact";
                        }
                    }
                }
                export namespace web {
                    export namespace constants {
                        export namespace incomingparticles {
                            export const ReturnCurrentTime:string = "ReturnCurrentTime";
                            export const Serve:string = "Serve";
                            export const ReturnIfConnectedToTheInternet: string = "ReturnIfConnectedToTheInternet";
                        }
                    }
                    export namespace incomingparticles {
                        import VoidParticle = euglena_template.being.particles.VoidParticle;
                        export class Serve extends VoidParticle{
                            constructor(of:string){super(constants.incomingparticles.Serve,of);}
                        }
                        export class ReturnCurrentTime extends VoidParticle{
                            constructor(of:string){ super(constants.incomingparticles.ReturnCurrentTime,of); }
                        }
                        export class ReturnIfConnectedToTheInternet extends VoidParticle {
                            constructor(of:string){ super(constants.incomingparticles.ReturnIfConnectedToTheInternet,of); }
                        }
                    }
                }
                export namespace time {
                    import Particle = euglena.being.Particle;
                    export namespace outgoingparticles {

                    }
                    export namespace incomingparticles {
                        export class SetTime extends Particle {
                            constructor(time: euglena.sys.type.Time,of:string) { super(constants.incomingparticles.SetTime, time,of); }
                        }
                        export class StartClock extends being.particles.VoidParticle {
                            constructor(of:string) { super(constants.incomingparticles.StartClock,of); }
                        }
                    }
                    export namespace constants {
                        export namespace outgoingparticles {

                        }
                        export namespace incomingparticles {
                            export const SetTime = "SetTime";
                            export const StartClock = "StartClock";
                        }
                    }
                }
                export namespace db {
                    import Particle = euglena.being.Particle;
                    export namespace outgoingparticles {
                        
                    }
                    export namespace incomingparticles {
                        export class StartDatabase extends Particle {
                            constructor(content:{euglenaName:string},of:string){super(constants.StartDatabase,content,of);}
                        }
                    }
                    export namespace outgoingparticles{
                        export class DbIsOnline extends being.particles.VoidParticle {
                            constructor(of:string){super(constants.DbIsOnline,of);}
                        }
                    }
                    export namespace constants {
                        export const StartDatabase = "StartDatabase";
                        export const DbIsOnline = "DbIsOnline";
                    }
                }
            }
        }
    }
    export namespace reference {
        export namespace being {
            export const Particle = new euglena.being.Particle("Reference Particle", true,"mine");
            export namespace interaction {
                export const Impact:euglena.being.interaction.Impact = {
                    particle: being.Particle,
                    token: "token"
                }
            }
        }
    }
}

