import { Particle, Exception, dco } from "@euglena/core";
import { vacuole } from "@euglena/template";
import { js } from "cessnalib";

let particles: Particle[] = [];

export type Sap = Particle<
    "Sap",
    { path: string; type: "FileSystemPath" | "NodeModules" | "Url" } | { particles: Particle[]; type: "InMemory" }
>;

export default dco<vacuole.Vacuole, Sap>({
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
            return;
        } catch (error: any) {
            return {} as Exception;
        }
    },
    GetAlive: async () => {},
    Hibernate: async () => {},
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
        } else {
            const { query, count, particle } = p.data;
            if (query) {
                let overrideCount = 0;
                for (let i = 0; i < particles.length && (count === "all" || overrideCount < count); i++) {
                    if (js.Class.doesMongoCover(particles[i], query)) {
                        particles[i] = particle;
                        overrideCount++;
                    }
                }
            } else {
                particles = [...particles, particle];
            }
        }
    },
    RemoveParticle: async (p, { cp }) => {
        const { query, count } = p.data;
        if (query) {
            let removeCount = 0;
            for (let i = 0; i < particles.length && (count === "all" || removeCount < count); i++) {
                if (js.Class.doesMongoCover(particles[i], query)) {
                    particles.splice(i, 1);
                    removeCount++;
                }
            }
        }
    }
});
