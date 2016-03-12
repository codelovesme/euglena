/// <reference path="../../../../cessnalib/typings/node/node.d.ts" />
/**
 * Created by codelovesme on 6/19/2015.
 */
import { cessnalib } from "../node_modules/cessnalib/cessnalib";
import Impact = cessnalib.being.interaction.Impact;
export declare module cessnalib_template {
    namespace injection {
        class StaticTools {
            static readConfigFile(applicationDirectory: string): cessnalib.injection.Configuration;
        }
    }
    namespace being {
        namespace particles {
            class BooleanParticle extends cessnalib.being.Particle {
                constructor(className: string, content: boolean);
            }
            class VoidParticle extends cessnalib.being.Particle {
                constructor(name: string);
            }
        }
        namespace alive {
            import Euglena = cessnalib.being.alive.Euglena;
            namespace constants {
                namespace particles {
                    const EuglenaName: string;
                    const EuglenaHasBeenBorn: string;
                    const Acknowledge: string;
                    const Time: string;
                    const Exception: string;
                    const ConnectedToTheInternet: string;
                }
                namespace organelles {
                    const ImpactTransmitterOrganelle: string;
                    const ImpactThrowerOrganelle: string;
                    const ReceptionOrganelle: string;
                    const TimeOrganelle: string;
                    const WebOrganelle: string;
                    const DbOrganelle: string;
                }
                namespace impacts {
                    const TimeChanged: string;
                    const ExceptionOccurred: string;
                }
            }
            namespace organelles {
                import Organelle = cessnalib.being.alive.Organelle;
                abstract class TimeOrganelle extends Organelle<{}> {
                    constructor();
                }
                abstract class ImpactThrowerOrganelle extends Organelle<{
                    euglenaInfos: cessnalib.sys.type.Map<string, cessnalib.being.alive.EuglenaInfo>;
                }> {
                    constructor();
                }
                abstract class ImpactTransmitterOrganelle extends Organelle<{}> {
                    constructor();
                }
                abstract class ReceptionOrganelle extends Organelle<{
                    port?: string;
                }> {
                    constructor();
                }
                abstract class WebOrganelle extends Organelle<{}> {
                    constructor();
                }
                abstract class DbOrganelle extends Organelle<{}> {
                    constructor();
                }
            }
            namespace particles {
                class Exception extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Exception);
                }
                class Time extends cessnalib.being.Particle {
                    constructor(content: cessnalib.sys.type.Time);
                }
                class Acknowledge extends being.particles.VoidParticle {
                    constructor();
                }
                class ConnectedToTheInternet extends being.particles.BooleanParticle {
                    constructor(content: boolean);
                }
                class EuglenaHasBeenBorn extends being.particles.BooleanParticle {
                    constructor();
                }
            }
            class StaticTools {
                static instantiateEuglena(applicationDirectory: string, organelleBank: cessnalib.sys.type.Map<string, cessnalib.being.alive.Organelle<Object>>, chromosome: any[]): Euglena;
            }
        }
        namespace ghost {
            namespace euglena {
                namespace impactthrower {
                    namespace incomingparticles {
                        interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo;
                            impact: Impact;
                        }
                        class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: {
                                to: string;
                                impact: ThrowImpactContent;
                            });
                        }
                    }
                    namespace constants {
                        namespace incomingparticles {
                            const ThrowImpact: string;
                        }
                    }
                }
                namespace reception {
                    namespace incomingparticles {
                        class Listen extends being.particles.VoidParticle {
                            constructor();
                        }
                        interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo;
                            impact: Impact;
                        }
                        class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: {
                                to: string;
                                impact: ThrowImpactContent;
                            });
                        }
                    }
                    namespace outgoingparticles {
                        class ImpactReceived extends cessnalib.being.Particle {
                            constructor(impact: cessnalib.being.interaction.Impact);
                        }
                    }
                    namespace constants {
                        namespace incomingparticles {
                            const Listen: string;
                            const ThrowImpact: string;
                        }
                        namespace outgoingparticles {
                            const ImpactReceived: string;
                        }
                    }
                }
                namespace impacttransmitter {
                    namespace incomingparticles {
                        class ConnectToEuglena extends cessnalib.being.Particle {
                            constructor(euglenaInfo: cessnalib.being.alive.EuglenaInfo);
                        }
                        interface ThrowImpactContent {
                            to: cessnalib.being.alive.EuglenaInfo;
                            impact: Impact;
                        }
                        class ThrowImpact extends cessnalib.being.Particle {
                            constructor(content: {
                                to: string;
                                impact: ThrowImpactContent;
                            });
                        }
                    }
                    namespace constants {
                        namespace incomingparticles {
                            const ConnectToEuglena: string;
                            const ThrowImpact: string;
                        }
                    }
                }
                namespace web {
                    namespace constants {
                        namespace incomingparticles {
                            const ReturnCurrentTime: string;
                            const ReturnIfConnectedToTheInternet: string;
                        }
                    }
                    namespace incomingparticles {
                        import VoidParticle = cessnalib_template.being.particles.VoidParticle;
                        class ReturnCurrentTime extends VoidParticle {
                            constructor();
                        }
                        class ReturnIfConnectedToTheInternet extends VoidParticle {
                            constructor();
                        }
                    }
                }
                namespace time {
                    import Particle = cessnalib.being.Particle;
                    namespace outgoingparticles {
                    }
                    namespace incomingparticles {
                        class SetTime extends Particle {
                            constructor(time: cessnalib.sys.type.Time);
                        }
                        class StartClock extends being.particles.VoidParticle {
                            constructor();
                        }
                    }
                    namespace constants {
                        namespace outgoingparticles {
                        }
                        namespace incomingparticles {
                            const SetTime: string;
                            const StartClock: string;
                        }
                    }
                }
                namespace db {
                    import Particle = cessnalib.being.Particle;
                    namespace outgoingparticles {
                    }
                    namespace incomingparticles {
                        class Save extends Particle {
                            constructor();
                        }
                    }
                    namespace constants {
                        namespace outgoingparticles {
                        }
                        namespace incomingparticles {
                            const Save: string;
                        }
                    }
                }
            }
        }
    }
    namespace reference {
        namespace being {
            const Particle: cessnalib.being.Particle;
            namespace interaction {
                const Impact: cessnalib.being.interaction.Impact;
            }
        }
    }
}
