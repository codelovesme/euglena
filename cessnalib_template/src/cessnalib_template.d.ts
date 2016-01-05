/**
 * Created by codelovesme on 6/19/2015.
 */
import { cessnalib } from "../node_modules/cessnalib/cessnalib";
export declare module cessnalib_template {
    namespace reference {
        namespace being {
            const Particle: cessnalib.being.Particle;
        }
    }
    namespace injection {
        class StaticTools {
            static readConfigFile(applicationDirectory: string): cessnalib.injection.Configuration;
        }
    }
    namespace being {
        namespace alive {
            class Euglena extends cessnalib.being.alive.Euglena {
                constructor();
            }
            namespace constants {
                namespace particles {
                    const EuglenaId: string;
                    const EuglenaHasBeenBorn: string;
                    const Acknowledge: string;
                    const ExceptionOccurred: string;
                    const Time: string;
                }
                namespace organelles {
                    const WebParticleTransmitterOrganelle: string;
                    const WebParticleThrowerOrganelle: string;
                    const WebReceptionOrganelle: string;
                    const TimeOrganelle: string;
                }
            }
            namespace organelles {
                import Limb = cessnalib.being.alive.Limb;
                import Organelle = cessnalib.being.alive.Organelle;
                import Identifiable = cessnalib.sys.type.Identifiable;
                abstract class TimeOrganelle extends Organelle<{}> implements Identifiable {
                    constructor();
                    abstract fetchCurrentTime(): void;
                }
                abstract class WebParticleThrowerOrganelle extends Limb<{
                    host: string;
                    port: string;
                    path?: string;
                }> implements Identifiable {
                    constructor();
                }
                abstract class WebParticleTransmitterOrganelle extends Limb<{
                    host: string;
                    port: string;
                    path?: string;
                }> implements Identifiable {
                    constructor();
                }
                abstract class WebReceptionOrganelle extends Organelle<{
                    port?: string;
                }> implements Identifiable {
                    constructor();
                }
            }
            namespace particles {
                class Time implements cessnalib.being.Particle {
                    content: cessnalib.sys.type.Time;
                    className: string;
                    constructor(content: cessnalib.sys.type.Time);
                }
                class EuglenaHasBeenBorn implements cessnalib.being.Particle {
                    className: string;
                    content: boolean;
                }
                class Acknowledge implements cessnalib.being.Particle {
                    className: string;
                    content: boolean;
                }
                class ExceptionOccurred implements cessnalib.being.Particle {
                    content: cessnalib.sys.type.Exception;
                    className: string;
                    constructor(content: cessnalib.sys.type.Exception);
                }
            }
            class StaticTools {
                static createEuglena(applicationDirectory: string, organelleBank: cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>>): Euglena;
            }
        }
    }
}
