/**
 * Created by codelovesme on 6/19/2015.
 */
import {cessnalib} from "../node_modules/cessnalib/cessnalib";
import * as path from "path";
import * as fs from "fs";
var jsonminify = require("jsonminify");

export module cessnalib_template {
    export namespace reference {
        export namespace being {
            export const Particle = new cessnalib.being.Particle("Reference Particle",true);
        }
    }
    export namespace injection {
        export class StaticTools {
            public static readConfigFile(applicationDirectory:string): cessnalib.injection.Configuration {
                let readConfigFile = fs.readFileSync(path.join(path.resolve(applicationDirectory), "config.json"), "utf8");
                return JSON.parse(jsonminify(readConfigFile));
            }
        }
    }
    export namespace being {
        export namespace alive {
            import Particle = cessnalib.being.Particle;
            import Euglena = cessnalib.being.alive.Euglena;
            import Gene = cessnalib.being.alive.dna.Gene;
            import Reaction = cessnalib.being.alive.dna.Reaction;
            import Time = cessnalib.sys.type.Time;
            export class RegularlyTriggeredGene extends Gene {
                constructor(public className: string, timeSpan:Time, public reaction: Reaction){
                    super(className,[constants.particles.Time],reaction);
                }
            }
            export namespace constants {
                export namespace particles {
                    export const EuglenaName = "cessnalib_template.being.alive.particles.EuglenaName";
                    export const EuglenaHasBeenBorn = "cessnalib_template.being.alive.particles.EuglenaHasBeenBorn";
                    export const Acknowledge = "cessnalib_template.being.alive.particles.Acknowledge";
                    export const ExceptionOccurred = "cessnalib_template.being.alive.particles.ExceptionOccurred";
                    export const Time = "cessnalib_template.being.alive.particles.Time";
                }
                export namespace organelles {
                    export const WebParticleTransmitterOrganelle = "cessnalib_template.being.alive.organelles.WebParticleTransmitterOrganelle";
                    export const WebParticleThrowerOrganelle = "cessnalib_template.being.alive.organelles.WebParticleThrowerOrganelle";
                    export const WebReceptionOrganelle = "cessnalib_template.being.alive.organelles.WebReceptionOrganelle";
                    export const TimeOrganelle = "cessnalib_template.being.alive.organelles.TimeOrganelle";
                }
            }
            export namespace organelles {
                import Limb = cessnalib.being.alive.Limb;
                import Organelle = cessnalib.being.alive.Organelle;
                import Identifiable = cessnalib.sys.type.Identifiable;
                export abstract class TimeOrganelle extends Organelle<{}> implements Identifiable {
                    constructor() {
                        super(constants.organelles.TimeOrganelle);
                    }
                    public abstract fetchCurrentTime(): void;
                }
                export abstract class WebParticleThrowerOrganelle extends Limb<{ host: string, port: string, path?: string }> implements Identifiable {
                    constructor() {
                        super(constants.organelles.WebParticleThrowerOrganelle);
                    }
                }
                export abstract class WebParticleTransmitterOrganelle extends Limb<{ host: string, port: string, path?: string }> implements Identifiable {
                    constructor() {
                        super(constants.organelles.WebParticleTransmitterOrganelle);
                    }
                }
                export abstract class WebReceptionOrganelle extends Organelle<{port?:string}> implements Identifiable {
                    constructor() {
                        super(constants.organelles.WebReceptionOrganelle);
                    }
                    public abstract listen():void;
                }
            }
            export namespace particles {
                export class Time extends cessnalib.being.Particle {
                    constructor(content:cessnalib.sys.type.Time) {
                        super(constants.particles.Time,content);
                    }
                }
                export class EuglenaHasBeenBorn extends cessnalib.being.Particle {
                    constructor() {
                        super(constants.particles.EuglenaHasBeenBorn,true);
                    }
                }
                export class Acknowledge extends cessnalib.being.Particle {
                    public className = constants.particles.Acknowledge;
                    public content = true;
                }
                export class ExceptionOccurred extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Exception) {
                        super(constants.particles.ExceptionOccurred,content);
                    }
                }
            }
            export class StaticTools{
                public static createEuglena(applicationDirectory:string,organelleBank:cessnalib.sys.type.Map<string,cessnalib.being.alive.Organelle<Object>>): Euglena {
                    let euglena = new cessnalib.being.alive.Euglena();
                    let initialConfig = injection.StaticTools.readConfigFile(applicationDirectory);
                    for (let objectProp of initialConfig.objects) {
                        let organelle = organelleBank.get(cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        euglena.addOrganelle(organelle);
                        organelle.seed = euglena;
                    }
                    for (let valueChooser of initialConfig.values){
                        euglena.receiveParticle(
                            new cessnalib.being.Particle(
                                valueChooser.className,
                                cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser)
                            ));
                    }
                    euglena.receiveParticle(new particles.EuglenaHasBeenBorn());
                    return euglena;
                }
            }
        }
    }
}

