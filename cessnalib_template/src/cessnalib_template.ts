/**
 * Created by codelovesme on 6/19/2015.
 */
import {cessnalib} from "../node_modules/cessnalib/cessnalib";
import * as path from "path";
import * as fs from "fs";

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
                return JSON.parse(readConfigFile);
            }
        }
    }
    export namespace being {
        export namespace alive {
            import Particle = cessnalib.being.Particle;
            export class Euglena extends cessnalib.being.alive.Euglena {
                constructor() {
                    let chromosome = new Array<cessnalib.being.alive.dna.Gene>();
                    chromosome.push(new cessnalib.being.alive.dna.Gene(
                        "WhenEuglenaHasBeenBorn",
                        [constants.particles.EuglenaHasBeenBorn],
                        (triggerParticle:Particle,particles:any,organelles:any) => {
                            let timeOrganelle: organelles.TimeOrganelle = <organelles.TimeOrganelle>organelles[constants.organelles.TimeOrganelle];
                            timeOrganelle.fetchCurrentTime();
                        }
                    ));
                    super(chromosome);
                }
            }
            export namespace constants {
                export namespace particles {
                    export const EuglenaId = "cessnalib_template.being.alive.particles.EuglenaId";
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
                }
            }
            export namespace particles {
                export class Time implements cessnalib.being.Particle {
                    public className = constants.particles.Time;
                    constructor(public content:cessnalib.sys.type.Time) { }
                }
                export class EuglenaHasBeenBorn implements cessnalib.being.Particle {
                    public className = constants.particles.EuglenaHasBeenBorn;
                    public content = true;
                }
                export class Acknowledge implements cessnalib.being.Particle {
                    public className = constants.particles.Acknowledge;
                    public content = true;
                }
                export class ExceptionOccurred implements cessnalib.being.Particle {
                    public className = constants.particles.ExceptionOccurred;
                    constructor(public content: cessnalib.sys.type.Exception) { }
                }
            }
            export class StaticTools{
                public static createEuglena(applicationDirectory:string,organelleBank:cessnalib.sys.type.Map<string,cessnalib.being.alive.Organelle<Object>>): Euglena {
                    let euglena = new Euglena();
                    let initialConfig = injection.StaticTools.readConfigFile(applicationDirectory);
                    euglena.receiveParticle(new particles.EuglenaHasBeenBorn());
                    for (let objectProp of initialConfig.objects) {
                        let organelle = organelleBank.get(cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        euglena.addOrganelle(organelle);
                    }
                    for (let valueChooser of initialConfig.values){
                        euglena.receiveParticle(
                            new cessnalib.being.Particle(
                                valueChooser.className,
                                cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser)
                            ));
                    }
                    return euglena;
                }
            }
        }
    }
}

