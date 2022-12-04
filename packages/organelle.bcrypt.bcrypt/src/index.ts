import * as core from "@euglena/core";
import { organelle, particle } from "@euglena/template";
import { hash, compare } from "bcrypt";

import bcrypt = organelle.bcrypt;

const cp = core.particle.cp;
const dco = core.organelle.dco;

/**
 * 12
 */
let saltRounds: string | number;

export type Sap = particle.common.Sap<{
    saltRounds: string | number;
}>;

export default dco<bcrypt.Bcrypt, Sap>({
    Sap: async (p) => {
        saltRounds = p.data.saltRounds;
    },
    Hash: async ({ data: plainPassword }) => {
        return cp<bcrypt.HashedPassword>("HashedPassword", await hash(plainPassword, saltRounds));
    },
    Compare: async ({ data: { plainPassword, hashedPassword } }) => {
        return cp<bcrypt.CompareResult>("CompareResult", await compare(plainPassword, hashedPassword));
    }
});
