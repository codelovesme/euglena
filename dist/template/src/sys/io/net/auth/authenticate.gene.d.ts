import { Particle } from "@euglena/core";
import { vacuole } from "../../store";
import { Encryptor } from "../../../crypt";
export type Authenticate = Particle<"Authenticate", {
    euglenaName: string;
    password: string;
}>;
export declare const createGeneAuthenticate: (organelles: import("../../../../cell/genetics").Stringify<{
    vacuole: vacuole.Vacuole;
    bcrypt: Encryptor;
    jwt: Encryptor;
}>) => import("../../../../cell/genetics").Gene<Particle<string, any, {}>, import("../../../../cell/genetics").Organelles>;
//# sourceMappingURL=authenticate.gene.d.ts.map