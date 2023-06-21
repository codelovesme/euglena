import { Organelles } from "./genetics";
import { EuglenaName } from "./euglena-name.par.h";
import { Exception } from "../exception.par.h";
export declare const getEuglenaName: <O extends Organelles, V extends Exclude<keyof O, number | symbol>>(t: any, vacuole: V) => Promise<EuglenaName | Exception>;
//# sourceMappingURL=euglena-name.par.u.d.ts.map