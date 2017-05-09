import { sys } from "cessnalib";
export declare const JavascriptDate: DateConstructor;
export declare const JavascriptObject: ObjectConstructor;
import Named = sys.type.Named;
export declare type Particle = ParticleV1 | ParticleV2<any>;
export declare class ParticleV1 {
    meta: any;
    data: any;
    constructor(meta: any, data?: any);
}
export declare class ParticleV2<T> {
    meta: MetaV2;
    data: T;
    constructor(meta: MetaV2, data?: T);
}
export declare type Meta = MetaV1 | MetaV2;
export declare type MetaV1 = any;
export declare class MetaV2 {
    name: string;
    of: string;
    version: string;
    createTime: number;
    expireTime?: number;
    constructor(name: string, of: string, expireTime?: number);
}
export declare namespace StaticTools {
    namespace Particle {
        namespace Versions {
            const v1 = "v1";
            const v2 = "v2";
        }
        function validate(particle: Particle): boolean;
    }
}
export declare namespace interaction {
    interface CanReceiveParticle {
        receive: Receive;
    }
    interface Receive {
        (particle: Particle, source: string, callback?: interaction.Callback): void;
    }
    interface Callback extends sys.type.Callback<Particle> {
    }
    class Impact extends ParticleV2<{
        token: string;
        particle: Particle;
    }> {
        constructor(particle: Particle, token: string, of: string);
    }
    namespace constants {
        const ReceivedParticleReference = "ReceivedParticleReference";
    }
}
export declare namespace alive {
    import Classifiable = sys.type.Classifiable;
    namespace dna {
        interface Reaction {
            (particle: Particle, sourceOrganelle: string, callback?: interaction.Callback): void;
        }
        type Gene = GeneV1 | GeneV2;
        class GeneV1 extends ParticleV1 {
            constructor(name: string, triggers: Object, reaction: Reaction, override?: string, expiretime?: sys.type.Time);
        }
        interface GeneDataV2 {
            name: string;
            triggers: ParticleV2<GeneDataV2>;
            reaction: Reaction;
            override?: string;
        }
        class GeneV2 extends ParticleV2<GeneDataV2> {
            constructor(name: string, triggers: any, reaction: Reaction, of: string, override?: string, expireTime?: number);
        }
        class GarbageCollector {
            private timeout;
            private chromosome;
            private particles;
            constructor(chromosome: Gene[], particles: Particle[]);
            start(): void;
        }
    }
    namespace particles {
        interface SapContent {
            euglenaName: string;
        }
    }
    namespace constants {
        const OutSide = "OutSide";
        namespace particles {
            const Gene = "Gene";
            const Chromosome = "Chromosome";
        }
    }
    abstract class Organelle<SapContent> implements Named, Classifiable {
        name: string;
        className: string;
        send: interaction.Receive;
        private actions;
        constructor(name: string, className: string, send?: interaction.Receive);
        protected abstract bindActions(addAction: (particleName: string, action: (particle: Particle, callback?: interaction.Callback) => void) => void): void;
        receive(particle: Particle, callback?: interaction.Callback): void;
    }
    class Cytoplasm {
        static instance: Cytoplasm;
        private static organelles;
        static particles: Particle[];
        static garbageCollector: dna.GarbageCollector;
        private static readonly chromosome;
        constructor(euglenaName: string, particles: Particle[], organelles: Organelle<any>[], chromosome: dna.Gene[]);
        static receive(particle: Particle, source: string, callback?: interaction.Callback): void;
        static transmit(organelleName: string, particle: Particle, callback?: interaction.Callback): void;
        static saveParticle(particle: Particle): void;
        static removeParticles(query: any): Particle[];
        static getParticle(query: any): Particle;
        static getParticles(query: any): Particle[];
    }
}
