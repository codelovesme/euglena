import { dco } from "@euglena/core";
import { cell, sys } from "@euglena/template";

let _package: any;

export default dco<sys.LibOrganelle, cell.organelle.Sap<{
    packageName: string
}>>({
    Sap: async (p) => {
        _package = import(p.data.packageName);
    },
    GetPackage: async () => _package
});
