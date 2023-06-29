import { Particle } from "@euglena/core";
import { Exception } from "./exception.par.h";
export declare const isException: (particle: Particle) => particle is Exception;
export declare const createException: (class_: "Exception", data: import("cessnalib").sys.Exception) => Exception;
//# sourceMappingURL=exception.par.u.d.ts.map