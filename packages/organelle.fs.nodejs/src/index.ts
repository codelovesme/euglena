import { cp, dco, Particle } from "@euglena/core";
import { particle, organelle } from "@euglena/template";
import * as fs from "fs";
import { sys } from "cessnalib";

import fsOrganelle = organelle.fs;
import common = particle.common;

export type Sap = particle.Particle<"Sap">;

const _fsOrganelle = dco<fsOrganelle.FS, Sap>({
    Sap: async (p) => {},
    ReadFile: ({ data: { filePath, encoding } }) => {
        return new Promise((resolve) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                return resolve(cp<fsOrganelle.FileContent>("FileContent", data as string));
            });
        });
    },
    WriteFile: ({ data: { filePath, content, encoding } }) => {
        return new Promise((resolve) => {
            fs.writeFile(filePath, content, { encoding }, (err) => {
                if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                return resolve(common.cp("ACK"));
            });
        });
    }
});

export default _fsOrganelle;
