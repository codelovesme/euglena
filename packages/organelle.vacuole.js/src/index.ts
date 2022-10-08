import { Particle, dco } from "@euglena/core";
import { organelle, particle } from "@euglena/template";
import { js, sys } from "cessnalib";

import vacuole = organelle.vacuole;
import common = particle.common;
import ACK = common.ACK;
import Exception = common.Exception;
import S = common.Sap;

let particles: Particle[] = [];

export type Sap = S<
    { path: string; type: "FileSystemPath" | "NodeModules" | "Url" } | { particles: Particle[]; type: "InMemory" }
>;

export default dco<vacuole.Vacuole, [Sap, Exception | ACK]>({
    Sap: async (particle) => {
        switch (particle.data.type) {
            case "FileSystemPath":
            case "NodeModules":
            case "Url":
                try {
                    particles = require(particle.data.path).default;
                } catch (error) {
                    return common.cp("Exception", new sys.type.Exception((error as { message: string }).message));
                }
                break;
            case "InMemory":
                particles = particle.data.particles;
                break;
        }
        return common.cp("ACK");
    },
    GetAlive: async () => {
        return common.cp("ACK");
    },
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
        return common.cp("ACK");
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
        return common.cp("ACK");
    }
});
