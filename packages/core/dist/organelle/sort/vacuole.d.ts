import { CommonParticles } from "../../common";
declare const vacuole: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            SaveParticle: CommonParticles["SaveParticle"];
            ReadParticle: CommonParticles["ReadParticle"];
            RemoveParticle: CommonParticles["RemoveParticle"];
            GetAlive: CommonParticles["GetAlive"];
            Hibernate: CommonParticles["Hibernate"];
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Exception: CommonParticles["Exception"];
            Particles: CommonParticles["Particles"];
            Metas: CommonParticles["Metas"];
            Log: CommonParticles["Log"];
        };
    }, undefined>;
};
export { vacuole };
