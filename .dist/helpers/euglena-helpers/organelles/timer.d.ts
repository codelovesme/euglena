import { sys } from "cessnalib";
import { OrganelleDefaultExport, CreateOrganelle } from "../../../organelle";
import { ParticleV3, MetaV3Optionals } from "../../../particle";
export declare type TimerDefaultExport = OrganelleDefaultExport<typeof organelleName, typeof createOrganelle, typeof createTimerParticle, typeof timerParticles>;
declare namespace timerParticles {
    const SetTime: "timer.SetTime";
    type SetTime = ParticleV3<typeof SetTime, sys.type.Time>;
    const ReadTime: "timer.ReadTime";
    type ReadTime = ParticleV3<typeof ReadTime, number>;
    const Time: "timer.Time";
    type Time = ParticleV3<typeof Time, sys.type.Time>;
    const Sap: "timer.Sap";
    type Sap = ParticleV3<typeof Sap, sys.type.Time>;
}
declare function createTimerParticle(name: typeof timerParticles.SetTime, createdBy: string, time: sys.type.Time, optionals?: MetaV3Optionals): timerParticles.SetTime;
declare function createTimerParticle(name: typeof timerParticles.ReadTime, createdBy: string, optionals?: MetaV3Optionals): timerParticles.ReadTime;
declare function createTimerParticle(name: typeof timerParticles.Time, createdBy: string, time: sys.type.Time, optionals?: MetaV3Optionals): timerParticles.Time;
declare function createTimerParticle(name: typeof timerParticles.Sap, createdBy: string, time: sys.type.Time, optionals?: MetaV3Optionals): timerParticles.Sap;
declare const organelleName: "timer";
declare const createOrganelle: CreateOrganelle;
declare const defaultExport: TimerDefaultExport;
export default defaultExport;
