import { FromP, P } from "../../organelle";
import { CommonParticles } from "..";
export declare type PHash = P<string>;
export declare type PHashedPassword = P<string>;
export declare type PCompare = P<{
    plainPassword: string;
    hashedPassword: string;
}>;
export declare type PCompareResult = P<boolean>;
export declare type Hash = FromP<"Hash", PHash>;
export declare type Compare = FromP<"Compare", PCompare>;
export declare type HashedPassword = FromP<"HashedPassword", PHashedPassword>;
export declare type CompareResult = FromP<"CompareResult", PCompareResult>;
declare const bcrypt: {
    v1: import("../../organelle").CreateOrganelleModuleInterface<{
        incoming: {
            Hash: PHash;
            Compare: PCompare;
        };
        outgoing: {
            HashedPassword: PHashedPassword;
            Exception: CommonParticles["Exception"];
            ACK: CommonParticles["ACK"];
            CompareResult: PCompareResult;
        };
    }, undefined>;
};
export { bcrypt };
