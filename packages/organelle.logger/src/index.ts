import { CommonParticles, domc } from "@euglena/core";

export default domc("Logger")<{
    incoming: {
        Log: CommonParticles["Log"];
    };
    outgoing: {
        ACK: CommonParticles["ACK"];
        Exception: CommonParticles["Exception"];
    };
}>(["Log"], ["ACK", "Exception"]);
