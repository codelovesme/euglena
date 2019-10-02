import SerialPort from "serialport";
import * as GPS from "gps";
import gpsTracker from "@euglena/organelle.gps";

let gps: any;

export default gpsTracker.com<{ path: string }>({
    Sap: async (particle, { t, cp }) => {
        gps = new GPS();
        const { path } = particle.data;
        console.log("connection via serialport");
        // t(cp.Log("Trying to connect via serial port", "Info"));
        const port = new SerialPort(path, {
            baudRate: 4800
        });
        console.log("listening");
        port.on("data", (data: any) => {
            console.log("gps update");
            gps.updatePartial(data);
        });

        gps.on("data", () => {
            console.log("on gps data");
            if (gps.state.lat && gps.state.lon) {
                console.log("on gps data inner");
                t(cp.Coordinate(Number(gps.state.lat), Number(gps.state.lon)));
            }
        });
    }
});
