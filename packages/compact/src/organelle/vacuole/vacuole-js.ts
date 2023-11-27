import * as cessnalib from "cessnalib";
import { Exception, Particle } from "../../particle";
import { Nucleus, Vacuole } from "../vacuole";

export class VacuoleJs extends Vacuole {
    constructor(private particles: Particle[], nucleus: Nucleus) {
        super(nucleus);
    }
    getAlive(): Promise<void | Exception> {
        throw new Error("Method not implemented.");
    }
    async read(query: Partial<Particle>, count: number | "All" = 1) {
        const retVal = [];
        for (let i = 0, len = 0; i < this.particles.length && (count === "All" || len < count); i++) {
            if (cessnalib.js.Class.doesMongoCover(this.particles[i], query)) {
                retVal.push(this.particles[i]);
                len++;
            }
        }
        return retVal;
    }
    async save(particle: Particle, query: Partial<Particle> = {}, count: number | "All" = 1) {
        if (query) {
            let overrideCount = 0;
            for (let i = 0; i < this.particles.length && (count === "All" || overrideCount < count); i++) {
                if (cessnalib.js.Class.doesMongoCover(this.particles[i], query)) {
                    this.particles[i] = particle;
                    overrideCount++;
                }
            }
        } else {
            this.particles = [...this.particles, particle];
        }
    }
    async saveAll(particles: Particle[]) {
        this.particles = [...this.particles, ...particles];
    }
    async remove(query: Partial<Particle>, count: number | "All" = 1) {
        if (query) {
            let removeCount = 0;
            for (let i = 0; i < this.particles.length && (count === "All" || removeCount < count); i++) {
                if (cessnalib.js.Class.doesMongoCover(this.particles[i], query)) {
                    this.particles.splice(i, 1);
                    removeCount++;
                }
            }
        }
    }
}
