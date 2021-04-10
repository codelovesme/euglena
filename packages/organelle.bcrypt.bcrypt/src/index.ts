import { bcrypt, Sap } from "@euglena/core";
import { hash, compare } from "bcrypt";

/**
 * 12
 */
let saltRounds: string | number;

export default bcrypt.v1.com<
    Sap<{
        saltRounds: string | number;
    }>
>({
    Sap: async (p) => {
        saltRounds = p.data.saltRounds;
    },
    Hash: async ({ data: plainPassword }, { cp }) => {
        return cp.HashedPassword(await hash(plainPassword, saltRounds));
    },
    Compare: async ({ data: { plainPassword, hashedPassword } }, { cp }) => {
        return cp.CompareResult(await compare(plainPassword, hashedPassword));
    }
});
