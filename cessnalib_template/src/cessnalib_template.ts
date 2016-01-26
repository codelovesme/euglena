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
                constructor(className:string,content:boolean){ super(className,content); }
            }
            export class VoidParticle extends cessnalib.being.Particle {
                constructor(name:string){ super(name,null); }
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
                    export const EuglenaHasBeenBorn = "EuglenaHasBeenBorn";
                    export const Acknowledge = "Acknowledge";
                    export const Time = "Time";
                    export const Year = "Year";
                    export const Month = "Month";
                    export const Day = "Day";
                    export const Hour = "Hour";
                    export const Minute = "Minute";
                    export const Second = "Second";
                    export const Clock = "Clock";
                    export const Date = "Date";
                    export const Exception = "Exception";
                    export const ConnectedToTheInternet = "cessnalib_template.being.alive.particles.ConnectedToTheInternet";
                }
                export namespace organelles {
                    export const ImpactTransmitterOrganelle = "ImpactTransmitterOrganelle";
                    export const ImpactThrowerOrganelle = "ImpactThrowerOrganelle";
                    export const ReceptionOrganelle = "ReceptionOrganelle";
                    export const TimeOrganelle = "TimeOrganelle";
                    export const WebOrganelle = "WebOrganelle";
                }
                export namespace impacts {
                    export const TimeChanged = "TimeChanged";
                    export const ExceptionOccurred = "ExceptionOccurred";
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
            }
            export namespace particles {
                export class Exception extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Exception) { super(constants.particles.Exception, content); }
                }
                export class Hour extends cessnalib.being.Particle {
                    constructor(content: number) { super(constants.particles.Hour, content); }
                }
                export class Minute extends cessnalib.being.Particle {
                    constructor(content: number) { super(constants.particles.Minute,content); }
                }
                export class Second extends cessnalib.being.Particle {
                    constructor(content: number) { super(constants.particles.Second, content); }
                }
                export class Year extends cessnalib.being.Particle {
                    constructor(content: number) { super(constants.particles.Year, content); }
                }
                export class Month extends cessnalib.being.Particle {
                    constructor(content: number) { super(constants.particles.Month, content); }
                }
                export class Day extends cessnalib.being.Particle {
                    constructor(content: number) { super(constants.particles.Day, content); }
                }
                export class Date extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Date) { super(constants.particles.Date, content); }
                }
                export class Clock extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Clock) { super(constants.particles.Clock, content); }
                }
                export class Time extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Time) { super(constants.particles.Time, content); }
                }
                export class Acknowledge extends being.particles.VoidParticle {
                    constructor(){ super(constants.particles.Acknowledge); }
                }
                export class ConnectedToTheInternet extends being.particles.BooleanParticle{
                    constructor(content:boolean){ super(constants.particles.ConnectedToTheInternet,content); }
                }
                export class EuglenaHasBeenBorn extends being.particles.BooleanParticle {
                    constructor() { super(constants.particles.EuglenaHasBeenBorn,true); }
                }
            }
            export class StaticTools{
                public static instantiateEuglena(applicationDirectory: string, organelleBank: cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>>, chromosome: Gene[]): Euglena {
                    const initialConfig = injection.StaticTools.readConfigFile(applicationDirectory);
                    let particles: any = {};
                    for (let valueChooser of initialConfig.values) {
                        particles[valueChooser.className] = new Particle(
                            valueChooser.className,
                            cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser)
                        );
                    }
                    let organelles:Array<cessnalib.being.alive.Organelle<any>> = [];
                    let euglenaName = (particles[cessnalib.being.alive.constants.particles.EuglenaName] as Particle).content;
                    let impactGenerator = new interaction.ImpactGenerator(euglenaName);
                    for (let objectProp of initialConfig.objects) {
                        let organelle = organelleBank.get(cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        organelle.impactGenerator = impactGenerator;
                        organelles.push(organelle);
                    }
                    let euglena = new cessnalib.being.alive.Euglena(chromosome, particles, organelles, impactGenerator);
                    euglena.receiveParticle(new cessnalib_template.being.alive.particles.EuglenaHasBeenBorn());
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
                            constructor(content: { to: string, impact: ThrowImpactContent }) { super(constants.incomingparticles.ThrowImpact, content); }
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
                            constructor() { super(constants.incomingparticles.Listen); }
                        }
                        export interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: { to: string, impact: ThrowImpactContent }) { super(constants.incomingparticles.ThrowImpact, content); }
                        }
                    }
                    export namespace outgoingparticles {
                        export class ImpactReceived extends cessnalib.being.Particle {
                            constructor(impact:cessnalib.being.interaction.Impact) { super(constants.outgoingparticles.ImpactReceived,impact); }
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
                            constructor(euglenaInfo: cessnalib.being.alive.EuglenaInfo) {
                                super(constants.incomingparticles.ConnectToEuglena, euglenaInfo);
                            }
                        }
                        export interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo,
                            impact: Impact
                        }
                        export class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: { to: string, impact: ThrowImpactContent}) { super(constants.incomingparticles.ThrowImpact,content); }
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
                            constructor(){ super(constants.incomingparticles.ReturnCurrentTime); }
                        }
                        export class ReturnIfConnectedToTheInternet extends VoidParticle {
                            constructor(){ super(constants.incomingparticles.ReturnIfConnectedToTheInternet); }
                        }
                    }
                }
                export namespace time {
                    import Particle = cessnalib.being.Particle;
                    export namespace outgoingparticles {

                    }
                    export namespace incomingparticles {
                        export class SetTime extends Particle {
                            constructor(time: cessnalib.sys.type.Time) { super(constants.incomingparticles.SetTime, time); }
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
            }
        }
    }
    export namespace reference {
        export namespace being {
            export const Particle = new cessnalib.being.Particle("Reference Particle", true);
            export namespace interaction {
                export const Impact:cessnalib.being.interaction.Impact = {
                    name: "Reference",
                    sender: "Reference",
                    particle: being.Particle
                }
            }
        }
    }
}

