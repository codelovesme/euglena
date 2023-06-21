import { cell } from "@euglena/template";
export type Sap = cell.organelle.Sap<{
    database: string;
    /**
     * @example
     * "mongodb://dbdevc2scdlvsm:<password>@dbdevc2scdlvsm.documents.azure.com:10255/?ssl=true"
     */
    uri: string;
}>;
declare const _default: import("@euglena/core").CreateOrganelle<import("@euglena/core").OrganelleInteractions>;
export default _default;
//# sourceMappingURL=index.d.ts.map