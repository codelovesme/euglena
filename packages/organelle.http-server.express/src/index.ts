import { dco } from "@euglena/core";
import { cell, sys, type } from "@euglena/template";
import express, { Express } from "express";

export type Sap = cell.organelle.Sap<{
    port: number;
}>;

let app: Express;
let sap: {
    port: number;
};
const parsePathParams = (path: string): string[] => {
    return path.split("/:").slice(1);
};
export default dco<sys.io.net.http.HttpServer, Sap>({
    Sap: async ({ data }, { cp, t }) => {
        sap = data;
        app = express();
    },
    AddRoute: async ({ data: { method, path, queryParams } }, { cp, t }) => {
        const pathParams = parsePathParams(path);
        app[method](`${path}`, async (req, res) => {
            const resp = (await t(
                cp("HttpImpulse", {
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
                    body: req.body,
                    headers: req.headers
                })
            )) as type.Particles;
            res.send(resp.data[0]);
        });
    },
    GetAlive: async () => {
        app.listen(sap.port, () => console.log(`app listening at ${sap.port}`));
    }
});
