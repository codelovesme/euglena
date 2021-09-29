import { domc } from "../../organelle/define-organelle-module-create";
import { CommonParticles } from "../particle/particles.h";

const vacuole = {
    v1: domc<{
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
    }>(
        ["ReadParticle", "RemoveParticle", "SaveParticle", "GetAlive", "Hibernate"],
        ["ACK", "Exception", "Metas", "Particles", "Log"]
    )
};

export { vacuole };
