import * as cessnalib from "cessnalib";
import { Particle, cp, dco } from "@euglena/core";
import { cell, sys, type } from "@euglena/template";

let particles: Particle[] = [];

export type Sap = cell.organelle.Sap<
    { path: string; type: "FileSystemPath" | "NodeModules" | "Url" } | { particles: Particle[]; type: "InMemory" }
>;

export default dco<sys.io.store.vacuole.Vacuole, [Sap, type.Exception | type.ACK]>({
    Sap: async (particle) => {
        switch (particle.data.type) {
            case "FileSystemPath":
            case "NodeModules":
            case "Url":
                try {
                    particles = require(particle.data.path).default;
                } catch (error) {
                    return cp<type.Exception>("Exception", new cessnalib.type.Exception((error as { message: string }).message));
                }
                break;
            case "InMemory":
                particles = particle.data.particles;
                break;
        }
        return cp<type.ACK>("ACK");
    },
    GetAlive: async () => {
        return cp<type.ACK>("ACK");
    },
    Hibernate: async () => { },
    ReadParticle: async (p, { cp }) => {
        const { query, count } = p.data;
        const retVal: Particle[] = [];
        for (let i = 0, len = 0; i < particles.length && (count === "all" || len < count); i++) {
            if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                retVal.push(particles[i]);
                len++;
            }
        }
        return cp("Particles", retVal);
    },
    SaveParticle: async (p) => {
        if (p.data instanceof Array) {
            particles = [...particles, ...p.data];
        } else {
            const { query, count, particle } = p.data;
            if (query) {
                let overrideCount = 0;
                for (let i = 0; i < particles.length && (count === "all" || overrideCount < count); i++) {
                    if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                        particles[i] = particle;
                        overrideCount++;
                    }
                }
            } else {
                particles = [...particles, particle];
            }
        }
        return cp<type.ACK>("ACK");
    },
    RemoveParticle: async (p) => {
        const { query, count } = p.data;
        if (query) {
            let removeCount = 0;
            for (let i = 0; i < particles.length && (count === "all" || removeCount < count); i++) {
                if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                    particles.splice(i, 1);
                    removeCount++;
                }
            }
        }
        return cp<type.ACK>("ACK");
    }
});
