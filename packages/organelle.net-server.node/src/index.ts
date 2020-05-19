import { netServer } from "@euglena/organelle";
import * as http from "http";
import { Sap, isParticle } from "@euglena/core";

let server: http.Server;
let sap: {
    port: number;
};
export default netServer.com<
    Sap<{
        port: number;
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
                                Promise.all(resp).then((x) => {
                                    res.end(JSON.stringify(x[0]));
                                });
                            });
                        }
                    } catch (e) {
                        t(
                            cp.Log({
                                message: `In ${netServer.n} error occurred while receiving impulse Err: ${e.message}`,
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
    GetAlive: async () => {
        server.listen(sap.port, () => {
            console.log(`Server running at ${sap.port}`);
        });
    }
});
