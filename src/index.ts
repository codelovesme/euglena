"use strict";
/**
 * Created by codelovesme on 6/19/2015.
 */
/*
*TODO List
*
* #Generate impact for particle value change
* #Seperate nucleus to a organelle
* #Seperate particle, request, event
*
*/
/**
 * Next major version api changes
 * class Cytoplasm {
 *      constructor(particles: AnyParticle[], organelles: Organelle<any>[], chromosome: dna.AnyGene[], euglenaName?: string) {
 * //Get the euglenaName from particles if it is not set
 * 
 */
import { sys, js } from "cessnalib";
export const JavascriptDate = Date;
export const JavascriptObject = Object;
import Classifiable = sys.type.Classifiable;
import Named = sys.type.Named;
export type AnyParticle = ParticleV1 | ParticleV2<any>;
export class ParticleV1 {
    constructor(public meta: any, public data?: any) { }
}
export class ParticleV2<T> {
    constructor(public meta: MetaV2, public data?: T) { }
}
export type AnyMeta = MetaV1 | MetaV2;
export type MetaV1 = any;
export class MetaV2 {
    public version: string;
    public createTime: number;
    public expireTime?: number;
    constructor(public name: string, public of: string, expireTime?: number) {
        this.version = StaticTools.Particle.Versions.v2;
        this.createTime = new JavascriptDate().getTime();
        if (expireTime) this.expireTime = expireTime;
    }
}
export namespace StaticTools {
    export namespace Particle {
        export namespace Versions {
            export const v1 = "v1";
            export const v2 = "v2";
        }
        export function validate(particle: AnyParticle): boolean {
            if (!particle || !particle.meta) return false;
            switch ((particle.meta as any).version) {
                case Versions.v2:
                    let meta = particle.meta as MetaV2;
                    return meta.name && (typeof meta.name === "string") && typeof meta.of &&
                        (typeof meta.of === "string") && (meta.version === Versions.v2) && (typeof meta.createTime === "number");
                case Versions.v1:
                case "undefined":
                    return particle.meta.name ? true : false;
            }
        }
    }
}
export namespace interaction {
    export interface CanReceiveParticle {
        receive: (particle: AnyParticle, source: string, callback?: interaction.Callback) => void;
    }
    export interface Callback extends sys.type.Callback<AnyParticle> { }
    export class Impact extends ParticleV2<{ token: string, particle: AnyParticle }> {
        constructor(particle: AnyParticle, token: string, of: string) {
            super(new MetaV2("Impact", of), { particle, token });
        }
    }
    export namespace constants {
        export const ReceivedParticleReference = "ReceivedParticleReference";
    }
}
export namespace alive {
    import Classifiable = sys.type.Classifiable;
    export namespace dna {
        export interface Reaction {
            (particle: AnyParticle, sourceOrganelle: string, callback?: interaction.Callback): void;
        }
        export type AnyGene = GeneV1 | GeneV2;
        export class GeneV1 extends ParticleV1 {
            constructor(
                name: string,
                triggers: Object, // particle prop - value match
                reaction: Reaction,
                override?: string,
                expiretime?: sys.type.Time) {
                super({ expiretime, name: alive.constants.particles.Gene }, { name, triggers, reaction, override });
            }
        }
        export interface GeneDataV2 {
            name: string,
            triggers: ParticleV2<GeneDataV2>,
            reaction: Reaction,
            override?: string,
        }
        export class GeneV2 extends ParticleV2<GeneDataV2> {
            constructor(
                name: string,
                triggers: any,
                reaction: Reaction,
                of: string,
                override?: string,
                expireTime?: number) {
                super(new MetaV2(constants.particles.Gene, of, expireTime), { name, triggers, reaction, override });
            }
        }
        export class GarbageCollector {
            private timeout = 1000;
            private chromosome: AnyGene[] = [];
            private particles: AnyParticle[] = [];
            constructor(chromosome: AnyGene[], particles: AnyParticle[]) {
                this.chromosome = chromosome;
                this.particles = particles;
            }
            public start(): void {
                let chromosome = this.chromosome;
                let particles = this.particles;
                setInterval(() => {
                    //process genes
                    let now = sys.type.StaticTools.Time.now();
                    let nowDigit = new JavascriptDate().getTime();
                    let doesExpire = (ai: AnyParticle) =>
                        (!ai.meta.version || ai.meta.version === StaticTools.Particle.Versions.v1) ?
                            (ai.meta.expiretime && sys.type.StaticTools.Time.biggerThan(now, ai.meta.expiretime)) :
                            (ai.meta.version === StaticTools.Particle.Versions.v2 ?
                                (ai.meta.expireTime && ai.meta.expireTime <= nowDigit) : false);
                    let removedChromosome = sys.type.StaticTools.Array.removeAllMatched(
                        this.chromosome,
                        null,
                        doesExpire);
                    for (let gene of removedChromosome) {
                        console.log("Cytoplasm says : destroyed gene " + JSON.stringify(gene.meta) + " as a result of the time expiration.");
                    }
                    //process particles
                    let removedParticles = sys.type.StaticTools.Array.removeAllMatched(
                        this.particles,
                        null, doesExpire);
                    for (let gene of removedParticles) {
                        console.log("Cytoplasm says : destroyed particle " + JSON.stringify(gene.meta) + " as a result of the time expiration.");
                    }
                }, this.timeout)
            }
        }
    }
    export namespace particles {
        export interface SapContent {
            euglenaName: string
        }
    }
    export namespace constants {
        export const OutSide = "OutSide";
        export namespace particles {
            export const Gene = "Gene";
            export const Chromosome = "Chromosome";
        }
    }
    export abstract class Organelle<SapContent> implements Named {
        private actions: sys.type.Map<string, (particle: AnyParticle, callback?: interaction.Callback) => void>;
        public send: (particle: AnyParticle, callback?: interaction.Callback) => void;
        constructor(public name: string) {
            let this_ = this;
            this.actions = new sys.type.Map<string, (particle: AnyParticle, callback?: interaction.Callback) => void>();
            this.bindActions((particleName: string, action: (particle: AnyParticle, callback?: interaction.Callback) => void) => {
                this_.actions.add(particleName, action);
            });
        }
        protected abstract bindActions(addAction: (particleName: string, action: (particle: AnyParticle, callback?: interaction.Callback) => void) => void): void;
        public receive(particle: AnyParticle, callback?: interaction.Callback): void {
            let action = this.actions.get(particle.meta.name);
            if (action) {
                action(particle, callback);
            }
        }
    }
    export class Cytoplasm {
        private static _instance: Cytoplasm = null;
        private static _organelles: any = null;
        private static _particles: AnyParticle[];
        private static _garbageCollector: dna.GarbageCollector;
        private static get _chromosome(): dna.AnyGene[] {
            return Cytoplasm.getParticle({ meta: { name: alive.constants.particles.Chromosome } }).data;
        }
        public static get euglenaName() {
            /**
             * Beacuse of there can only one particle of EuglenaName in the current Cytoplasm,
             * We can fetch the EuglenaName by a code like below.
             */
            return this.getParticle({ meta: { name: "EuglenaName" } }).data;
        }
        private static set _euglenaName(value: string) {
            let particles;
            let old = this.getParticle({ meta: { name: "EuglenaName" } });
            if (old) {
                particles = Cytoplasm.getParticles({ meta: { of: old.data } });
            } else {
                /**
                 * If there is no EuglenaName exists, it has to be initial state of the euglena
                 * so we have to change all particle owners to the given EuglenaName
                 */
                particles = Cytoplasm.getParticles({});
            }
            if (particles) {
                for (let particle of particles) {
                    particle.meta.of = value;
                }
            }
            /**
             * insert the given EuglenaName,too
             */
            Cytoplasm.saveParticle(new ParticleV2(new MetaV2("EuglenaName", value), value));
        }
        constructor(particles: AnyParticle[], organelles: Organelle<any>[], chromosome: dna.AnyGene[], euglenaName?: string) {
            if (Cytoplasm._instance) {
                throw "There exists a cytoplasm instance already.";
            }
            Cytoplasm._particles = particles;
            if (euglenaName) {
                Cytoplasm._euglenaName = euglenaName;
            }
            Cytoplasm._particles.push(new ParticleV2(new MetaV2(alive.constants.particles.Chromosome, euglenaName), chromosome));
            Cytoplasm._organelles = {};
            for (let organelle of organelles) {
                organelle.send = (particle, callback) => {
                    Cytoplasm.receive(particle, organelle.name, callback);
                };
                Cytoplasm._organelles[organelle.name] = organelle;
            }
            Cytoplasm._instance = this;
            Cytoplasm._garbageCollector = new dna.GarbageCollector(chromosome, particles);
            Cytoplasm._garbageCollector.start();
        }
        public static receive(particle: AnyParticle, source: string, callback?: interaction.Callback) {
            console.log("Cytoplasm says : received " + JSON.stringify(particle.meta));
            //find which genes are matched with properties of the particle 
            let triggerableReactions = new Array<{ index: number, triggers: string[], reaction: dna.Reaction }>();
            for (var i = 0; i < Cytoplasm._chromosome.length; i++) {
                let triggers: any = Cytoplasm._chromosome[i].data.triggers;
                if (js.Class.doesMongoCover(particle, triggers)) {
                    var reaction = Cytoplasm._chromosome[i].data.reaction;
                    triggerableReactions.push({ index: i, triggers: Object.keys(triggers), reaction: reaction });
                }
            }
            //get rid of overrided reactions
            let reactions = Array<dna.Reaction>();
            let names = Array<string>();
            for (let tr of triggerableReactions) {
                let doTrigger = true;
                //Check if the tr is contained by others, if true
                for (let tr2 of triggerableReactions) {
                    //if it is the same object, do nothing 
                    if (tr.index === tr2.index) continue;
                    //then if triggers of tr2 does not contain triggers of tr, do nothing
                    if (!sys.type.StaticTools.Array.containsArray(tr2.triggers, tr.triggers)) continue;
                    //then check if tr2 overrides tr
                    doTrigger = !(Cytoplasm._chromosome[tr2.index].data.override === Cytoplasm._chromosome[tr.index].data.name);
                }
                if (doTrigger) {
                    reactions.push(tr.reaction);
                    names.push(Cytoplasm._chromosome[tr.index].data.name);
                }
            }
            //trigger collected reactions
            for (let i = 0; i < reactions.length; i++) {
                let reaction = reactions[i];
                //try {
                console.log(`Cytoplasm says : triggering gene "${names[i]}"`);
                reaction(particle, source, callback ? (particle: AnyParticle) => {
                    console.log("Cytoplasm says : transmitting " + JSON.stringify(particle.meta) + " to " + source);
                    callback(particle);
                } : callback);
                //} catch (e) {
                //  console.log(e);
                //response(new euglena_template.being.alive.particles.Exception(new euglena.sys.type.Exception(e.message), this.name));
                //}
            }
        }
        public static transmit(organelleName: string, particle: AnyParticle, callback?: interaction.Callback) {
            console.log("Cytoplasm says : transmitting " + JSON.stringify(particle.meta) + " to " + organelleName);
            let organelle: Organelle<any> = Cytoplasm._organelles[organelleName] as Organelle<any>;
            organelle.receive(particle, callback ? (particle: AnyParticle) => {
                console.log("Cytoplasm says : received " + JSON.stringify(particle.meta));
                callback(particle);
            } : callback);
        }
        public static saveParticle(particle: AnyParticle, query?: any) {
            if (query) {
                let index = Cytoplasm._getParticleIndex(query);
                if (index >= 0) {
                    Cytoplasm._particles[index] = particle;
                }
            }
            Cytoplasm._particles.push(particle);
        }
        public static removeParticles(query: any): AnyParticle[] {
            return sys.type.StaticTools.Array.removeAllMatched(Cytoplasm._particles, query, (ai, t) => js.Class.doesMongoCover(ai, query));
        }
        public static getParticle(query: any): AnyParticle {
            for (let p of Cytoplasm._particles) {
                if (js.Class.doesMongoCover(p, query)) {
                    return p;
                }
            }
            return null;
        }
        public static getParticles(query: any): AnyParticle[] {
            let returnList = Array<AnyParticle>();
            for (let p of Cytoplasm._particles) {
                if (js.Class.doesMongoCover(p, query)) {
                    returnList.push(p);
                }
            }
            return returnList;
        }
        private static _getParticleIndex(query: any) {
            for (let i = 0; i < Cytoplasm._particles.length; i++) {
                if (js.Class.doesMongoCover(Cytoplasm._particles[i], query)) {
                    return i;
                }
            }
            return -1;
        }
    }
}
