import { bcrypt, Sap } from "@euglena/core";
import { hash, compare } from "bcrypt";

// const secret: string = "92f119fe-e5c5-46fc-a8d5-814c17aea307";
let saltRounds: string;

export default bcrypt.v1.com<Sap<{
    saltRounds: string;
}>>({
    Sap: async (p) => {
        saltRounds = p.data.saltRounds;
    },
    Hash: async ({ data: plainPassword }, { cp }) => {
        return cp.HashedPassword(await hash(plainPassword, saltRounds));
    },
    Compare: async ({ data: { plainPassword, hashedPassword } }, { cp }) => {
        return cp.CompareResult(await compare(plainPassword, hashedPassword))
    }
});
