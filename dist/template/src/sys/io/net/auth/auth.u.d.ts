import { Particle } from "@euglena/core";
import { vacuole } from "../../store";
import { EuglenaInfo } from "./euglena-info.par.h";
import { Permission } from "./permission.par.h";
import { Particles } from "../../../../particles.par.h";
import { Exception } from "../../../../exception.par.h";
import * as sys from "../../../../sys";
export declare const getSender: <O extends {
    [x: string]: {
        in: [[vacuole.SaveParticle<Particle<string, any, {}>>, import("../../../..").ACK | Exception], [vacuole.ReadParticle<Particle<string, any, {}>>, Particle<"Particles", Particle<string, any, {}>[], {}> | Exception], [vacuole.RemoveParticle<Particle<string, any, {}>>, import("../../../..").ACK | Exception], [import("../../../../cell/organelle").GetAlive, import("../../../..").ACK | Exception], vacuole.Hibernate];
        out: [sys.log.Log];
    } | {
        in: [[sys.crypt.Encrypt, sys.crypt.Hash], [sys.crypt.Decrypt, Exception | sys.crypt.Plain], [sys.crypt.Compare, import("../../../..").Boolean | Exception]];
        out: [];
    };
}, VacuoleName extends Exclude<keyof O, number | symbol>, JWTName extends Exclude<keyof O, number | symbol>>(t: any, vacuole: VacuoleName, jwt: JWTName, token: string) => Promise<EuglenaInfo | Exception>;
export declare const getSenderPermissions: <O extends {
    [x: string]: {
        in: [[vacuole.SaveParticle<Particle<string, any, {}>>, import("../../../..").ACK | Exception], [vacuole.ReadParticle<Particle<string, any, {}>>, Particle<"Particles", Particle<string, any, {}>[], {}> | Exception], [vacuole.RemoveParticle<Particle<string, any, {}>>, import("../../../..").ACK | Exception], [import("../../../../cell/organelle").GetAlive, import("../../../..").ACK | Exception], vacuole.Hibernate];
        out: [sys.log.Log];
    };
}, VacuoleName extends Exclude<keyof O, number | symbol>>(t: any, vacuole: VacuoleName, receiverEuglenaName: string, sender?: EuglenaInfo) => Promise<Exception | Particles<Permission>>;
export declare const getPermission: any;
export declare const isSenderPermitted: (senderPermissions: Particles<Permission>, particleClass: string) => boolean;
//# sourceMappingURL=auth.u.d.ts.map