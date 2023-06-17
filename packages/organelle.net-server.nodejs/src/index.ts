import { dco, isParticle } from "@euglena/core";
import { cell, sys } from "@euglena/template";
import * as http from "http";

export type Sap = cell.organelle.Sap<{
    port: number;
    euglenaName: string;
}>;

let server: http.Server;
let sap: {
    port: number;
    euglenaName: string;
};
export default dco<sys.io.net.bare.NetServer, Sap>({
    Sap: async ({ data }, { t, cp }) => {
        sap = data;
        server = http.createServer((req, res) => {
            if (req.method == "POST") {
                var body = "";
                req.on("data", (data: string) => {
                    body += data;
                    // Too much POST data, kill the connection!
                    if (body.length > 1e6) req.socket.destroy();
                });
                req.on("end", async () => {
                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    });
                    try {
                        const particle = JSON.parse(body);
                        if (isParticle(particle) && particle.meta.class === "Impulse") {
                            const results = await t(particle as any);
                            res.end(
                                JSON.stringify(
                                    cp("Impulse", {
                                        particle: results,
                                        source: sap.euglenaName
                                    })
                                )
                            );
                        }
                    } catch (e: any) {
                        t(
                            cp("Log", {
                                message: `In ${"Net Server"} error occurred while receiving impulse Err: ${e.message}`,
                                level: "Error"
                            })
                        );
                        res.end("Inccorect particle format!");
                    }
                });
            } else if (req.method == "GET") {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Only POST method accepted!");
            }
        });
    },
    GetAlive: async (p, { t, cp }) => {
        server.listen(sap.port, () => {
            t(
                cp("Log", {
                    message: `Server running at ${sap.port}`,
                    level: "Info"
                })
            );
        });
    }
});
