import { matter, Sap } from "@euglena/core";
import Plantower from "plantower";

interface Value {
    value: number;
    unit: string | null;
}

interface Result {
    "concentration_pm1.0_normal": Value;
    "concentration_pm2.5_normal": Value;
    concentration_pm10_normal: Value;
    "concentration_pm1.0_atmos": Value;
    "concentration_pm2.5_atmos": Value;
    concentration_pm10_atmos: Value;
    "count_pm_0.3": Value;
    "count_pm_0.5": Value;
    "count_pm_1.0": Value;
    "count_pm_2.5": Value;
    count_pm_5: Value;
    count_pm_10: Value;
    formaldehyde: Value;
    model: typeof sap["model"];
    timestamp: number;
}

let sap: {
    path: string;
    model:
        | "DS_CO2_20"
        | "PMS1003"
        | "PMS3003"
        | "PMS5003"
        | "PMS5003I"
        | "PMS5003P"
        | "PMS5003S"
        | "PMS5003ST"
        | "PMS5003T"
        | "PMS6003"
        | "PMS7003"
        | "PMS7003M"
        | "PMS7003P"
        | "PMSA003"
        | "PTQS1005";
};
let plantower: any;

export default matter.v1.com<Sap<typeof sap>>({
    Sap: async (p) => {
        sap = p.data;
        plantower = new Plantower(sap.model, sap.path);
    },
    Read: async (p, { cp }) => {
        const result: Result = await plantower.read();
        return cp.Matter([
            { pm: 1, type: "Normal", value: result["concentration_pm1.0_normal"].value },
            { pm: 2.5, type: "Normal", value: result["concentration_pm2.5_normal"].value },
            { pm: 10, type: "Normal", value: result["concentration_pm10_normal"].value },
            { pm: 1, type: "Normal", value: result["concentration_pm1.0_normal"].value },
            { pm: 1, type: "Normal", value: result["concentration_pm1.0_normal"].value },
            { pm: 1, type: "Normal", value: result["concentration_pm1.0_normal"].value }
        ]);
    }
});
