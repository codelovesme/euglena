import { dco } from "@euglena/core";
import { cell, log } from "@euglena/template";

type Sap = cell.organelle.Sap<{
    printLevel: boolean;
}>;

let config: Sap["data"];

export default dco<log.Logger, Sap>({
    Sap: async (p) => {
        config = p.data;
    },
    Log: async (p, { cp, t }) => {
        console.log(config.printLevel ? `${p.data.level} - ${p.data.message}` : p.data.message);
        return cp("ACK");
    }
});
