import { cp, dco, Particle } from "@euglena/core";
import { fs as fsOrganelle, ccp } from "@euglena/template";
import * as fs from "fs";
import { sys } from "cessnalib";

export type Sap = Particle<"Sap">;

const _fsOrganelle = dco<fsOrganelle.FS, Sap>({
    Sap: async (p) => {},
    ReadFile: ({ data: { filePath, encoding } }) => {
        return new Promise((resolve) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err) return resolve(ccp("Exception", new sys.type.Exception(JSON.stringify(err))));
                return resolve(cp<fsOrganelle.FileContent>("FileContent", data as string));
            });
        });
    },
    WriteFile: ({ data: { filePath, content, encoding } }) => {
        return new Promise((resolve) => {
            fs.writeFile(filePath, content, { encoding }, (err) => {
                if (err) return resolve(ccp("Exception", new sys.type.Exception(JSON.stringify(err))));
                return resolve(ccp("ACK"));
            });
        });
    }
});

export default _fsOrganelle;
