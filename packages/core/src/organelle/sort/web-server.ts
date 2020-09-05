import { CommonParticles } from "../../common";
import { domc } from "../define-organelle-module-create";
import { P, FromP } from "../particles.h";

type PAddRoute = P<{
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams: string[];
    pathParams: string[];
}>;

type AddRoute = FromP<"AddRoute", PAddRoute>;

const webServer = {
    v1: domc<{
        incoming: {
            GetAlive: CommonParticles["GetAlive"];
            AddRoute: PAddRoute;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Impulse: P<{
                route: string;
                path: string;
                method: string;
                queryParams: object;
                pathParams: object;
                user?: {
                    id: string;
                    roles: string;
                };
                body: object;
            }>;
            Log: CommonParticles["Log"];
        };
    }>(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};

export { webServer, AddRoute, PAddRoute };
