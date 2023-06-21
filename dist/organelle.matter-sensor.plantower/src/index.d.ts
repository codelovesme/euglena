import { cell } from "@euglena/template";
declare let sap: {
    path: string;
    model: "DS_CO2_20" | "PMS1003" | "PMS3003" | "PMS5003" | "PMS5003I" | "PMS5003P" | "PMS5003S" | "PMS5003ST" | "PMS5003T" | "PMS6003" | "PMS7003" | "PMS7003M" | "PMS7003P" | "PMSA003" | "PTQS1005";
};
export type Sap = cell.organelle.Sap<typeof sap>;
declare const _default: import("@euglena/core").CreateOrganelle<import("@euglena/core").OrganelleInteractions>;
export default _default;
//# sourceMappingURL=index.d.ts.map