/// <reference path="../../cessnalib_template/typings/tsd.d.ts" />
/**
 * Created by codelovesme on 6/19/2015.
 */
import { cessnalib } from "../node_modules/cessnalib/cessnalib";
import { cessnalib_template } from "../node_modules/cessnalib_template/src/cessnalib_template";
export declare module cessnalib_impl {
    namespace being {
        namespace alive {
            namespace particles {
                class ConnectedToEuglena implements cessnalib.being.Particle {
                    content: cessnalib.being.alive.EuglenaInfo;
                    className: string;
                    constructor(content: cessnalib.being.alive.EuglenaInfo);
                }
                class ConnectToEuglenaRequest implements cessnalib.being.Particle {
                    content: {
                        euglenaId: string;
                    };
                    className: string;
                    constructor(content: {
                        euglenaId: string;
                    });
                }
            }
            namespace organelles {
                class TimeOrganelleImplNistGov extends cessnalib_template.being.alive.organelles.TimeOrganelle {
                    fetchCurrentTime(): void;
                }
                class WebParticleTransmitterOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebParticleTransmitterOrganelle {
                    private server;
                    connectToEuglena(): void;
                    throwParticle(particle: cessnalib.being.Particle): void;
                }
                class WebReceptionOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebReceptionOrganelle {
                    private sockets;
                    listen(): void;
                    throwImpulse(userId: string, impulse: cessnalib.being.Particle): void;
                }
                class WebParticleThrowerOrganelleImplHttp extends cessnalib_template.being.alive.organelles.WebParticleThrowerOrganelle {
                    private socket;
                    private callbackStack;
                    private post_options;
                    initialize(): void;
                    throwParticle(particle: cessnalib.being.Particle): void;
                }
            }
        }
    }
}
