import { dco, Particle } from "@euglena/core";
import { organelle, particle } from "@euglena/template";
import express, { Express } from "express";

import webServer = organelle.webServer;
import Particles = particle.common.Particles;

export type Sap = Particle<
    "Sap",
    {
        port: number;
    }
>;

let app: Express;
let sap: {
    port: number;
};
const parsePathParams = (path: string): string[] => {
    return path.split("/:").slice(1);
};
export default dco<webServer.WebServer, Sap>({
    Sap: async ({ data }, { cp, t }) => {
        sap = data;
        app = express();
    },
    AddRoute: async ({ data: { method, path, queryParams } }, { cp, t }) => {
        const pathParams = parsePathParams(path);
        app[method](`${path}`, async (req, res) => {
            const resp = (await t(
                cp("WebServerImpulse", {
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
            )) as Particles;
            res.send(resp.data[0]);
        });
    },
    GetAlive: async () => {
        app.listen(sap.port, () => console.log(`app listening at ${sap.port}`));
    }
});
