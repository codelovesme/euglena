import { Particle } from "@euglena/core";
export type AddRoute = Particle<"AddRoute", {
    method: "get" | "post" | "put" | "delete";
    path: string;
    queryParams?: string[];
}>;
//# sourceMappingURL=add-route.par.h.d.ts.map