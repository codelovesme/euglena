import SerialPort from "serialport";
import GPS from "gps";
import * as core from "@euglena/core";
import { organelle, particle } from "@euglena/template";

import common = particle.common;
import gpsReceiver = organelle.gpsReceiver;

const cp = core.particle.cp;
const dco = core.organelle.dco;

export type Sap = particle.common.Sap<{ path: string; interval: number }>;

let gps: any;
let buffer: Array<{ lat: number; lng: number }> = [];
let sap: Sap["data"];

export default dco<gpsReceiver.GpsReceiver, Sap>({
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
                    t(cp<gpsReceiver.Coordinate>("Coordinate", result));
                    buffer = [];
                }
            }, interval);
            t(common.cp("Log", { message: "Listening GPS", level: "Info" }));

            return common.cp("ACK");
        } catch (e: any) {
            return common.cp("Exception", { message: JSON.stringify(e) });
        }
    }
});
