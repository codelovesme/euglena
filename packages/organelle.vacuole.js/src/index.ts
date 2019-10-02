import vacuole from "@euglena/organelle.vacuole";
import { Particle, Meta } from "@euglena/particle";
import { js } from "cessnalib";

let particles: Particle[] = [];
export default vacuole.com<{ path: string; type: "FileSystemPath" | "NodeModules" | "Url" }>({
    Sap: async (particle, { cp }) => {
        try {
            switch (particle.data.type) {
                case "FileSystemPath":
                case "NodeModules":
                case "Url":
                    particles = require(particle.data.path).default;
            }
            return cp.ACK();
        } catch (error) {
            return cp.Exception(error.message);
        }
    },
    ReadParticle: async (particle, { cp }) => {
        const { query, count } = particle.data;
        const retVal: Particle[] = [];
        for (let i = 0, len = 0; i < particles.length && (count === "all" || len < count); i++) {
            if (js.Class.doesMongoCover(particles[i], query)) {
                retVal.push(particles[i]);
                len++;
            }
        }
        return cp.Particles(retVal);
    },
    SaveParticle: async (particle, { cp }) => {
        const { query, count } = particle.data;
        const overridedParticles: Meta[] = [];
        if (query) {
            let overrideCount = 0;
            for (let i = 0; i < particles.length && (count === "all" || overrideCount < count); i++) {
                if (js.Class.doesMongoCover(particles[i], query)) {
                    overridedParticles.push(particles[i].meta);
                    particles[i] = particle;
                    overrideCount++;
                }
            }
        } else {
            particles.push(particle);
        }
        return cp.Metas(overridedParticles);
    },
    RemoveParticle: async (particle, { cp }) => {
        const { query, count } = particle.data;
        const removedParticles: Meta[] = [];
        if (query) {
            let removeCount = 0;
            for (let i = 0; i < particles.length && (count === "all" || removeCount < count); i++) {
                if (js.Class.doesMongoCover(particles[i], query)) {
                    const removed = particles.splice(i--, 1)[0];
                    removedParticles.push(removed.meta);
                    removeCount++;
                }
            }
        }
        return cp.Metas(removedParticles);
    }
});
