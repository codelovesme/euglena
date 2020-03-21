import { CommonParticles, domc } from "@euglena/core";

export default domc("NetServer")<{
    incoming: {
        GetAlive: CommonParticles["GetAlive"];
    };
    outgoing: {
        ACK: CommonParticles["ACK"];
        Exception: CommonParticles["Exception"];
        Impulse: CommonParticles["Impulse"];
        Log: CommonParticles["Log"];
    };
}>(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"]);
