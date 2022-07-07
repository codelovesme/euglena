import { thermometer, Sap } from "@euglena/core";
import i2c from "i2c-bus";

let sap: { ic2Address: number; deviceAddress: number; interval: number };

export default thermometer.v1.com<Sap<typeof sap>>({
    Sap: async (p) => {
        sap = p.data;
    },
    Listen: async (p, { t, cp }) => {
        try {
            const { ic2Address: MCP9808_ADDR, deviceAddress: TEMP_REG, interval } = sap;

            const toCelsius = (rawData: any) => {
                rawData = (rawData >> 8) + ((rawData & 0xff) << 8);
                let celsius = (rawData & 0x0fff) / 16;
                if (rawData & 0x1000) {
                    celsius -= 256;
                }
                return celsius;
            };

            setInterval(() => {
                i2c.openPromisified(1)
                    .then((i2c1: any) =>
                        i2c1
                            .readWord(MCP9808_ADDR, TEMP_REG)
                            .then((d: any) => {
                                console.log(d);
                            })
                            .then((rawData: any) => console.log(toCelsius(rawData)))
                            .then((_: any) => i2c1.close())
                    )
                    .catch(console.error);
            }, interval);
            return cp.ACK();
        } catch (e:any) {
            return cp.Exception({ message: JSON.stringify(e) });
        }
    }
});
