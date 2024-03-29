import * as cessnalib from "cessnalib";
import { cp, dco } from "@euglena/core";
import { ACK, Exception, cell, sys } from "@euglena/template";
import * as fs from "fs";

const _fsOrganelle = dco<sys.io.store.fs.FS, cell.organelle.Sap>({
    Sap: async (p) => { },
    ReadFile: ({ data: { filePath, encoding } }) => {
        return new Promise((resolve) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err) return resolve(cp<Exception>("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                return resolve(cp<sys.io.store.fs.FileContent>("FileContent", data as string));
            });
        });
    },
    WriteFile: ({ data: { filePath, content, encoding } }) => {
        return new Promise((resolve) => {
            fs.writeFile(filePath, content, { encoding }, (err) => {
                if (err) return resolve(cp<Exception>("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                return resolve(cp<ACK>("ACK"));
            });
        });
    }
});

export default _fsOrganelle;
