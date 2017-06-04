/**
 * Created by codelovesme on 6/19/2015.
 */
/**
 * Next major version api changes
 * class Cytoplasm {
 *      constructor(particles: AnyParticle[], organelles: Organelle<any>[], chromosome: dna.AnyGene[], euglenaName?: string) {
 * //Get the euglenaName from particles if it is not set
 *
 */
import { sys } from "cessnalib";
export declare const JavascriptDate: DateConstructor;
export declare const JavascriptObject: ObjectConstructor;
import Named = sys.type.Named;
export declare type AnyParticle = ParticleV1 | ParticleV2<any>;
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
export declare type AnyMeta = MetaV1 | MetaV2;
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
        function validate(particle: AnyParticle): boolean;
    }
}
export declare namespace interaction {
    interface CanReceiveParticle {
        receive: Receive;
    }
    interface Receive {
        (particle: AnyParticle, source: string, callback?: interaction.Callback): void;
    }
    interface Callback extends sys.type.Callback<AnyParticle> {
    }
    class Impact extends ParticleV2<{
        token: string;
        particle: AnyParticle;
    }> {
        constructor(particle: AnyParticle, token: string, of: string);
    }
    namespace constants {
        const ReceivedParticleReference = "ReceivedParticleReference";
    }
}
export declare namespace alive {
    namespace dna {
        interface Reaction {
            (particle: AnyParticle, sourceOrganelle: string, callback?: interaction.Callback): void;
        }
        type AnyGene = GeneV1 | GeneV2;
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
            constructor(chromosome: AnyGene[], particles: AnyParticle[]);
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
    abstract class Organelle<SapContent> implements Named {
        name: string;
        private actions;
        send: (particle: AnyParticle, callback?: interaction.Callback) => void;
        constructor(name: string, send?: interaction.Receive);
        protected abstract bindActions(addAction: (particleName: string, action: (particle: AnyParticle, callback?: interaction.Callback) => void) => void): void;
        receive(particle: AnyParticle, callback?: interaction.Callback): void;
    }
    class Cytoplasm {
        private static _instance;
        private static _organelles;
        private static _particles;
        private static _garbageCollector;
        private static readonly _chromosome;
        static readonly euglenaName: any;
        private static _euglenaName;
        constructor(particles: AnyParticle[], organelles: Organelle<any>[], chromosome: dna.AnyGene[], euglenaName?: string);
        static receive(particle: AnyParticle, source: string, callback?: interaction.Callback): void;
        static transmit(organelleName: string, particle: AnyParticle, callback?: interaction.Callback): void;
        static saveParticle(particle: AnyParticle, query?: any): void;
        static removeParticles(query: any): AnyParticle[];
        private static _getParticleIndex(query);
        static getParticle(query: any): AnyParticle;
        static getParticles(query: any): AnyParticle[];
    }
}
