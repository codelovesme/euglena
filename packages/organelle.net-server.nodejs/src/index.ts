import * as http from "http";
import { netServer, Sap, isParticle, Particles, ccp } from "@euglena/core";

let server: http.Server;
let sap: {
    port: number;
    euglenaName: string;
};
export default netServer.v1.com<
    Sap<{
        port: number;
        euglenaName: string;
    }>
>({
    Sap: async ({ data }, { cp, t }) => {
        sap = data;
        server = http.createServer((req, res) => {
            if (req.method == "POST") {
                var body = "";
                req.on("data", (data: string) => {
                    body += data;
                    // Too much POST data, kill the connection!
                    if (body.length > 1e6) req.socket.destroy();
                });
                req.on("end", () => {
                    res.writeHead(200, {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    });
                    try {
                        const particle = JSON.parse(body);
                        if (isParticle(particle) && particle.meta.class === "Impulse") {
                            t(particle as any).then((resp: any) => {
                                const results: Particles = resp;
                                res.end(
                                    JSON.stringify(
                                        ccp.Impulse({
                                            particle: results.data[0],
                                            source: sap.euglenaName
                                        })
                                    )
                                );
                            });
                        }
                    } catch (e) {
                        t(
                            cp.Log({
                                message: `In ${"Net Server"} error occurred while receiving impulse Err: ${e.message}`,
                                level: "Error"
                            })
                        );
                        return res.end("Inccorect particle format!");
                    }
                });
            } else if (req.method == "GET") {
                res.writeHead(200, { "Content-Type": "text/plain" });
                return res.end("Only POST method accepted!");
            }
        });
    },
    GetAlive: async (p, { t, cp }) => {
        server.listen(sap.port, () => {
            t(
                cp.Log({
                    message: `Server running at ${sap.port}`,
                    level: "Info"
                })
            );
        });
    }
});
