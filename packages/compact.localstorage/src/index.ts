import * as cessnalib from "cessnalib";
import { Exception, Particle, vacuole } from "@euglena/compact";

const getParticles = (): Particle[] => {
    return (JSON.parse(localStorage.getItem("particles") || "[]")) as Particle[];
}

const setParticles = (particles: Particle[]) => {
    localStorage.setItem("particles", JSON.stringify(particles));
}

export class VacuoleLocalstorage extends vacuole.Vacuole {
    constructor(nucleus: vacuole.Nucleus) {
        super(nucleus);
    }
    getAlive(): Promise<void | Exception> {
        throw new Error("Method not implemented.");
    }
    async read(query: Partial<Particle>, count: number | "All" = 1) {
        const retVal: Particle[] = [];
        const particles = getParticles();
        for (let i = 0, len = 0; i < particles.length && (count === "All" || len < count); i++) {
            if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                retVal.push(particles[i]);
                len++;
            }
        }
        return retVal;
    }
    async save(particle: Particle, query: Partial<Particle> = {}, count: number | "All" = 1) {
        let particles = getParticles();
        if (query) {
            let overrideCount = 0;
            for (let i = 0; i < particles.length && (count === "All" || overrideCount < count); i++) {
                if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                    particles[i] = particle;
                    overrideCount++;
                }
            }
        } else {
            particles = [...particles, particle];
        }
        setParticles(particles);
    }
    async saveAll(additions: Particle[]) {
        let particles = getParticles();
        particles = [...particles, ...additions];
        setParticles(particles);
    }
    async remove(query: Partial<Particle>, count: number | "All" = 1) {
        if (query) {
            let particles = getParticles();
            let removeCount = 0;
            for (let i = 0; i < particles.length && (count === "All" || removeCount < count); i++) {
                if (cessnalib.js.Class.doesMongoCover(particles[i], query)) {
                    particles.splice(i, 1);
                    removeCount++;
                }
            }
            setParticles(particles);
        }
    }
}
