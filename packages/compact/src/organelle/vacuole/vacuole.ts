import { Exception, Log, Particle } from "../../particle";

export interface Nucleus {
    log(message: string, level: Log["level"]): void;
}

export abstract class Vacuole {
    constructor(protected nucleus: Nucleus) { }
    abstract getAlive(): Promise<void | Exception>;
    abstract read(query: Partial<Particle>, count?: number | "All"): Promise<Particle[] | Exception>;
    abstract save(particle: Particle, query?: Partial<Particle>, count?: number | "All"): Promise<void | Exception>;
    abstract saveAll(particles: Particle[]): Promise<void | Exception>;
    abstract remove(query: Partial<Particle>, count?: number | "All"): Promise<void | Exception>;
}