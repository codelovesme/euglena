import { webServer, Sap } from "@euglena/core";
import express, { Express } from "express";

let app: Express;
let sap: {
    port: number;
};
const getPathParamsAsString = (pathParams: string[] | undefined): string => {
    if (pathParams?.length! > 0) {
        return pathParams!.reduce((acc, curr) => `${acc}/:${curr}`, "/");
    }
    return "";
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
    AddRoute: async ({ data: { method, path, pathParams, queryParams } }, { cp, t }) => {
        const route: string = `${path}${getPathParamsAsString(pathParams)}`;
        app[method](`${route}`, async (req, res) => {
            const resp: any = await t(
                cp.WebServerImpulse({
                    route,
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
