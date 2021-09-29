import { domc } from "../../organelle/define-organelle-module-create";
import { FromP, P } from "../../organelle/particles.h";
import { CommonParticles } from "../particle/particles.h";

export type PHash = P<string>;
export type PHashedPassword = P<string>;
export type PCompare = P<{
    plainPassword: string;
    hashedPassword: string;
}>;
export type PCompareResult = P<boolean>;

export type Hash = FromP<"Hash", PHash>;
export type Compare = FromP<"Compare", PCompare>;
export type HashedPassword = FromP<"HashedPassword", PHashedPassword>;
export type CompareResult = FromP<"CompareResult", PCompareResult>;

const bcrypt = {
    v1: domc<{
        incoming: {
            Hash: PHash;
            Compare: PCompare;
        };
        outgoing: {
            HashedPassword: PHashedPassword;
            Exception: CommonParticles["Exception"];
            ACK: CommonParticles["ACK"];
            CompareResult: PCompareResult
        };
    }>(["Hash", "Compare"], ["Exception", "ACK", "HashedPassword", "CompareResult"])
};

export { bcrypt };
