import SerialPort from "serialport";
import GPS from "gps";
import { ACK, Exception, cell, env, sys } from "@euglena/template";
import { cp, dco } from "@euglena/core";

export type Sap = cell.organelle.Sap<{ path: string; interval: number }>;

let gps: any;
let buffer: Array<{ lat: number; lng: number }> = [];
let sap: Sap["data"];

export default dco<sys.io.sensor.GpsReceiver, Sap>({
    Sap: async (p) => {
        sap = p.data;
    },
    Listen: async (p, { t }) => {
        try {
            gps = new GPS();
            const { path, interval } = sap;
            console.log("connection via serialport");
            // t(cp.Log("Trying to connect via serial port", "Info"));
            const port = new SerialPort(path, {
                baudRate: 4800
            });
            console.log("listening");
            port.on("data", (data: any) => {
                // console.log("gps update");
                gps.updatePartial(data);
            });

            gps.on("data", () => {
                // console.log("on gps data");
                if (typeof gps.state.lat !== undefined && typeof gps.state.lon !== undefined) {
                    // console.log("on gps data inner");
                    buffer = [...buffer, { lat: Number(gps.state.lat), lng: Number(gps.state.lon) }];
                }
            });
            const avg = (coordinates: Array<{ lat: number; lng: number }>) => {
                if (coordinates instanceof Array && coordinates.length <= 0) return undefined;
                const sum = coordinates.reduce((acc, curr) => ({ lat: acc.lat + curr.lat, lng: acc.lng + curr.lng }), {
                    lat: 0,
                    lng: 0
                });
                return {
                    lat: sum.lat / coordinates.length,
                    lng: sum.lng / coordinates.length
                };
            };
            setInterval(() => {
                const result = avg(buffer);
                if (result) {
                    t(cp<env.geo.Coordinate>("Coordinate", result));
                    buffer = [];
                }
            }, interval);
            t(cp<sys.log.Log>("Log", { message: "Listening GPS", level: "Info" }));

            return cp<ACK>("ACK");
        } catch (e: any) {
            return cp<Exception>("Exception", { message: JSON.stringify(e) });
        }
    }
});
