import { fs as fsOrganelle } from "@euglena/core";
import * as fs from "fs";

export default fsOrganelle.v1.com({
    Sap: async (p) => {},
    ReadFile: async ({ data: { filePath, encoding } }, { cp }) => {
        return new Promise((resolve) => {
            fs.readFile(filePath, encoding, (err, data) => {
                if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                return resolve(cp.FileContent(data as string));
            });
        });
    },
    WriteFile: async ({ data: { filePath, content, encoding } }, { cp }) => {
        return new Promise((resolve) => {
            fs.writeFile(filePath, content, { encoding }, (err) => {
                if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                return resolve(cp.ACK());
            });
        });
    }
});
