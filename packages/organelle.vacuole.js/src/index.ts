import { Sap, Particle, Meta, FromP, Exception } from "@euglena/core";
import { ACK, vacuole } from "@euglena/template";
import { js } from "cessnalib";

let particles: Particle[] = [];
export default vacuole.v1.com<
    [
        FromP<
            "Sap",
            Sap<
                | { path: string; type: "FileSystemPath" | "NodeModules" | "Url" }
                | { particles: Particle[]; type: "InMemory" }
            >
        >,
        ACK
    ]
>({
    Sap: async (particle) => {
        try {
            switch (particle.data.type) {
                case "FileSystemPath":
                case "NodeModules":
                case "Url":
                    particles = require(particle.data.path).default;
                    break;
                case "InMemory":
                    particles = particle.data.particles;
                    break;
            } 
            return {} as ACK;
        } catch (error: any) {
            return {} as Exception;
        }
    },
    GetAlive: async () => {
        return true;
    },
    Hibernate: async () => ,
    ReadParticle: async (p, { cp }) => {
        const { query, count } = p.data;
        const retVal: Particle[] = [];
        for (let i = 0, len = 0; i < particles.length && (count === "all" || len < count); i++) {
            if (js.Class.doesMongoCover(particles[i], query)) {
                retVal.push(particles[i]);
                len++;
            }
        }
        return cp("Particles", retVal);
    },
    SaveParticle: async (p, { cp }) => {
        if (p.data instanceof Array) {
            particles = [...particles, ...p.data];
            return cp(
                "Metas",
                p.data.map((p) => p.meta)
            );
        } else {
            const overridedParticles: Meta[] = [];
            const { query, count, particle } = p.data;
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
                overridedParticles.push(particle.meta);
                particles = [...particles, particle];
            }
            return cp("Metas", overridedParticles);
        }
    },
    RemoveParticle: async (p, { cp }) => {
        const { query, count } = p.data;
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
        return cp("Metas", removedParticles);
    }
});
