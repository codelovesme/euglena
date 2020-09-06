import { webServer, Sap } from "@euglena/core";
import express, { Express } from "express";

let app: Express;
let sap: {
    port: number;
};
const parsePathParams = (path: string): string[] => {
    return path.split("/:").slice(1);
};
export default webServer.v1.com<
    Sap<{
        port: number;
    }>
>({
    Sap: async ({ data }, { cp, t }) => {
        sap = data;
        app = express();
    },
    AddRoute: async ({ data: { method, path, queryParams } }, { cp, t }) => {
        const pathParams = parsePathParams(path);
        app[method](`${path}`, async (req, res) => {
            const resp: any = await t(
                cp.WebServerImpulse({
                    path,
                    method,
                    pathParams: pathParams
                        ? pathParams.reduce(
                              (acc, curr) => ({
                                  ...acc,
                                  [curr]: req.params[curr]
                              }),
                              {}
                          )
                        : {},
                    queryParams: queryParams
                        ? queryParams.reduce(
                              (acc, curr) => ({
                                  ...acc,
                                  [curr]: req.query[curr]
                              }),
                              {}
                          )
                        : {},
                    body: req.body
                })
            );
            Promise.all(resp).then((x) => {
                res.send(x[0]);
            });
        });
        return cp.ACK();
    },
    GetAlive: async () => {
        app.listen(sap.port, () => console.log(`app listening at ${sap.port}`));
    }
});
