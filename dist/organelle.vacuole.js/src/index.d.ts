import { Particle } from "@euglena/core";
import { cell } from "@euglena/template";
export type Sap = cell.organelle.Sap<{
    path: string;
    type: "FileSystemPath" | "NodeModules" | "Url";
} | {
    particles: Particle[];
    type: "InMemory";
}>;
declare const _default: import("@euglena/core").CreateOrganelle<import("@euglena/core").OrganelleInteractions>;
export default _default;
//# sourceMappingURL=index.d.ts.map