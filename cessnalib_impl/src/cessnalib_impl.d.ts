/**
 * Created by codelovesme on 6/19/2015.
 */
import { euglena } from "../node_modules/euglena/euglena";
import { euglena_template } from "../node_modules/euglena_template/src/euglena_template";
import { RequestOptions } from "http";
export declare module euglena_impl {
    namespace sys {
        namespace io {
            namespace net {
                class HttpRequestManager {
                    post_options: RequestOptions;
                    constructor(post_options: RequestOptions);
                    sendMessage(message: string, callback: euglena.sys.type.Callback<string>): void;
                }
            }
        }
    }
    namespace being {
        namespace alive {
            class StaticTools {
                static createOrganelleBank(): euglena.sys.type.Map<string, euglena.being.alive.Organelle<Object>>;
            }
            namespace constants {
                namespace organelles {
                    const WebOrganelleImplHttp: string;
                    const ReceptionOrganelleImplHttp: string;
                    const ImpactTransmitterOrganelleImplHttp: string;
                    const ImpactThrowerOrganelleImplHttp: string;
                    const TimeOrganelleImplJs: string;
                }
            }
            namespace organelle {
                import Particle = euglena.being.Particle;
                class WebOrganelleImplHttp extends euglena_template.being.alive.organelles.WebOrganelle {
                    receiveParticle(particle: Particle): void;
                    private checkInternetConnection();
                    private fetchCurrentTime();
                }
                class DbOrganelleImplNeDb extends euglena_template.being.alive.organelles.DbOrganelle {
                    receiveParticle(particle: Particle): void;
                }
                class TimeOrganelleJs extends euglena_template.being.alive.organelles.TimeOrganelle {
                    private time;
                    receiveParticle(particle: Particle): void;
                }
                class ImpactTransmitterOrganelleImplHttp extends euglena_template.being.alive.organelles.ImpactTransmitterOrganelle {
                    private servers;
                    receiveParticle(particle: Particle): void;
                    private connectToEuglena(euglenaInfo);
                    private throwImpact(to, impact);
                }
                class ReceptionOrganelleImplHttp extends euglena_template.being.alive.organelles.ReceptionOrganelle {
                    private sockets;
                    receiveParticle(particle: Particle): void;
                    private listen();
                    private throwImpact(to, impact);
                }
                class ImpactThrowerOrganelleImplHttp extends euglena_template.being.alive.organelles.ImpactThrowerOrganelle {
                    private httpConnector;
                    receiveParticle(particle: Particle): void;
                    private throwImpact(to, impact);
                }
            }
        }
    }
}
