import { FromP, P } from "../../organelle";
import { CommonParticles } from "..";
export declare type PGenerateToken = P<CommonParticles["Token"]["data"]["decrypted"]>;
export declare type PVerifyToken = P<string>;
export declare type GenerateToken = FromP<"GenerateToken", PGenerateToken>;
export declare type VerifyToken = FromP<"VerifyToken", PVerifyToken>;
declare const jwt: {
    v1: import("../../organelle").CreateOrganelleModuleInterface<{
        incoming: {
            GenerateToken: PGenerateToken;
            VerifyToken: PVerifyToken;
        };
        outgoing: {
            Token: CommonParticles["Token"];
            Exception: CommonParticles["Exception"];
            ACK: CommonParticles["ACK"];
        };
    }, undefined>;
};
export { jwt };
