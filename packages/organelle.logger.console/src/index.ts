import moment from "moment";
import { cp, dco } from "@euglena/core";
import { cell, sys, type } from "@euglena/template";

export default dco<sys.log.Logger, cell.organelle.Sap>({
    Sap: async (particle) => { },
    Log: async (particle, { t }) => {
        console.log(`${particle.data.level} - ${moment().format("YYYY.MM.DD HH:mm:ss")} - ${particle.data.message}`);
        return cp<type.ACK>("ACK");
    }
});
