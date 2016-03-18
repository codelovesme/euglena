"use strict";
/// <reference path="C:/git/me.codeloves/cessnalib/cessnalib/typings/node/node.d.ts" />
/**
 * Created by codelovesme on 6/19/2015.
 */
import {cessnalib} from "../node_modules/cessnalib/cessnalib";
import * as path from "path";
import * as fs from "fs";
var jsonminify = require("jsonminify");
import Exception = cessnalib.sys.type.Exception;

import Impact = cessnalib.being.interaction.Impact;
import interaction = cessnalib.being.interaction;

export module cessnalib_template {
    export namespace injection {
        export class StaticTools {
            public static readConfigFile(applicationDirectory:string): cessnalib.injection.Configuration {
                let readConfigFile = fs.readFileSync(path.join(path.resolve(applicationDirectory), "config.json"), "utf8");
                return JSON.parse(jsonminify(readConfigFile));
            }
        }
    }
    export namespace being {
        export namespace particles {
            export class BooleanParticle extends cessnalib.being.Particle {
                constructor(name:string,content:boolean,of:string){ super(name,content,of); }
            }
            export class VoidParticle extends cessnalib.being.Particle {
                constructor(name:string,of:string){ super(name,null,of); }
            }
        }
        export namespace alive {
            import Particle = cessnalib.being.Particle;
            import Euglena = cessnalib.being.alive.Euglena;
            import Gene = cessnalib.being.alive.dna.Gene;
            import Reaction = cessnalib.being.alive.dna.Reaction;
            import Time = cessnalib.sys.type.Time;
            export namespace constants {
                export namespace particles {
                    export const EuglenaName = "EuglenaName";
                    export const EuglenaInfos = "EuglenaInfos";
                    export const ImpactReceived = "ImpactReceived";
                    export const EuglenaHasBeenBorn = "EuglenaHasBeenBorn";
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
                    export const ImpactTransmitterOrganelle = "ImpactTransmitterOrganelle";
                    export const ImpactThrowerOrganelle = "ImpactThrowerOrganelle";
                    export const ReceptionOrganelle = "ReceptionOrganelle";
                    export const TimeOrganelle = "TimeOrganelle";
                    export const WebOrganelle = "WebOrganelle";
                    export const DbOrganelle = "DbOrganelle";
                }
                export namespace impacts {
                    export const TimeChanged = "TimeChanged";
                    export const ExceptionOccurred = "ExceptionOccurred";
                    export const SaveParticle = "SaveParticle";
                    export const ReadParticle = "ReadParticle";
                    export const RemoveParticle = "RemoveParticle";
                }
            }
            export namespace organelles {
                import Organelle = cessnalib.being.alive.Organelle;
                export abstract class TimeOrganelle extends Organelle<{}> {
                    constructor() { super(alive.constants.organelles.TimeOrganelle);}
                }
                export abstract class ImpactThrowerOrganelle extends Organelle<{ euglenaInfos:cessnalib.sys.type.Map<string,cessnalib.being.alive.EuglenaInfo>}> {
                    constructor() { super(constants.organelles.ImpactThrowerOrganelle); }
                }
                export abstract class ImpactTransmitterOrganelle extends Organelle<{}> {
                    constructor() { super(alive.constants.organelles.ImpactTransmitterOrganelle); }
                }
                export abstract class ReceptionOrganelle extends Organelle<{port?:string}> {
                    constructor() { super(constants.organelles.ReceptionOrganelle); }
                }
                export abstract class WebOrganelle extends Organelle<{}>{
                    constructor() { super(constants.organelles.WebOrganelle); }
                }
                export abstract class DbOrganelle extends Organelle<{url:string,port:number}>{
                    constructor() { super(constants.organelles.DbOrganelle); }
                }
            }
            export namespace particles {
                export class EuglenaInfos extends Particle {
                    constructor(content:any,of:string){super(constants.particles.EuglenaInfos,content,of);}
                }
                export class Token extends Particle {
                    constructor(content:string,of:string){super(constants.particles.Token,content,of);}
                }
                export class Exception extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Exception,of:string) { super(constants.particles.Exception, content,of); }
                }
                export class Time extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Time,of:string) { super(constants.particles.Time, content,of); }
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
                export class SaveParticle extends Particle {
                    constructor(content:Particle,of:string) { super(constants.impacts.SaveParticle, content,of); }
                }
                export class ReadParticle extends Particle {
                    constructor(content:cessnalib.being.alive.dna.condition.ParticleReference,of:string){ super(constants.impacts.ReadParticle,content,of); }
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
                export class ImpactReceived extends cessnalib.being.Particle {
                    constructor(public content:Impact,of:string) { super(constants.particles.ImpactReceived,content,of); }
                }
            }
            export class StaticTools{
                public static instantiateEuglena(applicationDirectory: string, organelleBank: cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>>, chromosome: any[],euglenaName:string): Euglena {
                    const initialConfig = injection.StaticTools.readConfigFile(applicationDirectory);
                    let particles: any = {};
                    for (let valueChooser of initialConfig.values) {
                        particles[valueChooser.className] = new Particle(
                            valueChooser.className,
                            cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser),
                            euglenaName
                        );
                    }
                    particles[cessnalib_template.being.alive.constants.particles.EuglenaName] = new Particle(cessnalib_template.being.alive.constants.particles.EuglenaName,euglenaName,euglenaName);
                    let organelles: any = {};
                    let impactGenerator = new interaction.ImpactGenerator(euglenaName);
                    for (let objectProp of initialConfig.objects) {
                        let organelle = organelleBank.get(cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        organelle.impactGenerator = impactGenerator;
                        organelles[organelle.name] = organelle;
                    }
                    let euglena = cessnalib.being.alive.Euglena.generateInstance(chromosome, particles, organelles, impactGenerator);
                    euglena.receiveParticle(new cessnalib_template.being.alive.particles.EuglenaHasBeenBorn(euglena.getParticle(cessnalib_template.being.alive.constants.particles.EuglenaName).content));
                    return euglena;
                }
            }
        }
        export namespace ghost {
            export namespace euglena {
                export namespace impactthrower {
                    export namespace incomingparticles {
                        export interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: { to: cessnalib.being.alive.EuglenaInfo, impact: Impact },of:string) { super(constants.incomingparticles.ThrowImpact, content,of); }
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
                            to: cessnalib.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: ThrowImpactContent,of:string) { super(constants.incomingparticles.ThrowImpact, content,of); }
                        }
                    }
                    export namespace outgoingparticles {
                        export class ImpactReceived extends cessnalib.being.Particle {
                            constructor(impact:cessnalib.being.interaction.Impact,of:string) { super(constants.outgoingparticles.ImpactReceived,impact,of); }
                        }
                    }
                    export namespace constants {
                        export namespace incomingparticles {
                            export const Listen = "Listen";
                            export const ThrowImpact = "ThrowImpact";
                        }
                        export namespace outgoingparticles {
                            export const ImpactReceived = "ImpactReceived";
                        }
                    }
                }
                export namespace impacttransmitter {
                    export namespace incomingparticles {
                        export class ConnectToEuglena extends cessnalib.being.Particle {
                            constructor(euglenaInfo: cessnalib.being.alive.EuglenaInfo,of:string) {
                                super(constants.incomingparticles.ConnectToEuglena, euglenaInfo,of);
                            }
                        }
                        export interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends cessnalib.being.Particle {
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
                            export const ReturnIfConnectedToTheInternet: string = "ReturnIfConnectedToTheInternet";
                        }
                    }
                    export namespace incomingparticles {
                        import VoidParticle = cessnalib_template.being.particles.VoidParticle;
                        export class ReturnCurrentTime extends VoidParticle{
                            constructor(of:string){ super(constants.incomingparticles.ReturnCurrentTime,of); }
                        }
                        export class ReturnIfConnectedToTheInternet extends VoidParticle {
                            constructor(of:string){ super(constants.incomingparticles.ReturnIfConnectedToTheInternet,of); }
                        }
                    }
                }
                export namespace time {
                    import Particle = cessnalib.being.Particle;
                    export namespace outgoingparticles {

                    }
                    export namespace incomingparticles {
                        export class SetTime extends Particle {
                            constructor(time: cessnalib.sys.type.Time,of:string) { super(constants.incomingparticles.SetTime, time,of); }
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
                    import Particle = cessnalib.being.Particle;
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
            export const Particle = new cessnalib.being.Particle("Reference Particle", true,"mine");
            export namespace interaction {
                export const Impact:cessnalib.being.interaction.Impact = {
                    particle: being.Particle,
                    token: "token"
                }
            }
        }
    }
}

