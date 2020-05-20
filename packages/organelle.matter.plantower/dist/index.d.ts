declare const _default: import("@euglena/core").OrganelleModule<import("@euglena/core").InsertSapIntoParticles<{
    incoming: {
        Read: import("@euglena/core").P<undefined, {}>;
    };
    outgoing: {
        Matter: import("@euglena/core").P<{
            pm: number;
            value: number;
            type: "Normal" | "Atmos" | "Count";
        }[], {}>;
        Log: import("@euglena/core").P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        Exception: import("@euglena/core").P<import("cessnalib").sys.type.Exception, {}>;
    };
}, import("@euglena/core").P<{
    path: string;
    model: "DS_CO2_20" | "PMS1003" | "PMS3003" | "PMS5003" | "PMS5003I" | "PMS5003P" | "PMS5003S" | "PMS5003ST" | "PMS5003T" | "PMS6003" | "PMS7003" | "PMS7003M" | "PMS7003P" | "PMSA003" | "PTQS1005";
}, {
    organelleName: string;
}>>>;
export default _default;
