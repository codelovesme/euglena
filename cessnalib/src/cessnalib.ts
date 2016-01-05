/**
 * Created by codelovesme on 6/19/2015.
 */
export module cessnalib {
    export namespace js {
        export class Class {
            public static extend(subInstance:any, parentInstance:any): void {
                for (let prop in parentInstance) {
                    if (!subInstance[prop]) subInstance[prop] = parentInstance[prop];
                }
                return subInstance;
            }
            public static clone<T extends any>(obj: T, deep: boolean = false): T {
                var sub:any = {};
                for (var prop in obj) {
                    sub[prop] = (deep && ('object' == typeof obj[prop])) ? Class.clone(obj[prop], true) : obj[prop];
                }
                return <T>sub;
            }
            public static merge(primaryInstance:any, secondaryInstance:any) {
                for (var prop in secondaryInstance) {
                    if (!primaryInstance[prop]) primaryInstance[prop] = secondaryInstance[prop];
                }
                return primaryInstance;
            }
            public static classify(emptyInstance:any, valueObj:any) {
                for (var prop in emptyInstance) {
                    if (("function" != typeof emptyInstance[prop]) && !emptyInstance[prop]) emptyInstance[prop] = valueObj[prop];
                }
                return emptyInstance;
            }
            public static valuefy(instance:any) {
                var valueObj:any = {};
                var propToValuefy:any = null;
                for (var prop in instance) {
                    if ("function" != typeof instance[prop]) {
                        valueObj[prop] = instance[prop];
                    } else if (typeof prop == "object") {
                        valueObj[prop] = Class.valuefy(instance[prop]);
                    } else if ((prop.substring(0, 3) == "get") && (propToValuefy = prop.substring(3, prop.length))) {
                        valueObj[propToValuefy[0].toLowerCase() + propToValuefy.substring(1, propToValuefy.length)] = instance[prop]();
                    }
                }
                return valueObj;
            }
            public static isPrimaryType(obj:any): boolean {
                return typeof obj == "string" ||
                    typeof obj == "number" ||
                    typeof obj == "boolean";
            }
            public static instanceOf<T>(referenceObject:any,obj:any): obj is T {
                if (Class.isPrimaryType(referenceObject)) return typeof referenceObject == typeof obj;
                for (var prop in referenceObject) {
                    if (obj[prop] == undefined)
                        return false;
                }
                return true;
            }
        }
    }
    export namespace injection {
        export class StaticTools {
            public static valueOfValueChooser(valueChooser:ValueChooser):string {
                return valueChooser.values[valueChooser.index];
            }
        }
        export class Configuration {
            public values: ValueChooser[];
            public objects: ObjectChooser[];
        }
        export class ValueChooser implements sys.type.Identifiable {
            public className: string;
            public values: string[];
            public index: number = 0;
        }
        export class ObjectChooser {
            public class: ValueChooser;
            public initialProperties: Object;
        }
    }
    export namespace sys {
        export namespace type {
            export class Exception {
                constructor(public message: string, public innerException?: Exception) { }
            }
            export class Map<K, V> {
                private keys = new Array<K>();
                private values = new Array<V>();
                constructor(private condition?: (key1: K, key2: K) => boolean) { }
                public add(key: K, value: V): void {
                    if (!this.get(key)) {
                        this.keys.push(key);
                        this.values.push(value);
                    } else {
                        throw "KeyAlreadyExistException";
                    }
                }
                public set(key: K, value: V): void {
                    var index = this.keys.indexOf(key);
                    if (index >= 0) {
                        this.values[index] = value;
                    } else {
                        this.keys.push(key);
                        this.values.push(value);
                    }
                }
                public remove(key: K): void {
                    var index = this.keys.indexOf(key);
                    this.keys.slice(index, 1);
                    this.values.slice(index, 1);
                }
                public get(key: K): V {
                    var returnValue:V = null;
                    if (this.condition) {
                        this.keys.forEach((k: K) => {
                            if (this.condition(k, key)) {
                                returnValue = this.values[this.keys.indexOf(k)];
                            }
                        });
                    } else {
                        returnValue = this.values[this.keys.indexOf(key)];
                    }
                    return returnValue;
                }
                public getKeys(): K[] {
                    return this.keys;
                }
                public getValues(): V[] {
                    return this.values;
                }
            }
            export namespace StaticTools {
                export class Array {
                    public static contains<T>(array:T[],t:T,compare?:(arrayItem:T,t:T)=>boolean): boolean {
                        return Array.indexOf(array,t,compare)>=0;
                    }
                    public static indexOf<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): number {
                        for (var i = 0; i<array.length;i++) {
                            if (compare(array[i], t)) {
                                return i;
                            }
                        }
                        return -1;
                    }
                }
            }
            export interface Identifiable {
                className: string;
            }
            export class Time implements Identifiable {
                className: string = "cessnalib.sys.type.Time";
                constructor(public date: Date, public clock: Clock) { }
            }
            export class Date implements Identifiable {
                className: string = "cessnalib.sys.type.Date";
                constructor(public year: number, public month: number, public day: number) { }
            }
            export class Clock implements Identifiable {
                className: string = "cessnalib.sys.type.Clock";
                constructor(public hour: number, public minute: number, public second: number) { } 
            }
        }
    }
    export namespace being {
        import Identifiable = cessnalib.sys.type.Identifiable;
        export class Particle implements Identifiable {
            constructor(public className: string, public content: any) { }
        }
        export namespace interaction {
            export interface CanReceiveParticle {
                receiveParticle (particle: Particle): void;
            }
            export interface CanThrowParticle {
                throwParticle (particle: Particle): void;
            }
        }
        export namespace alive {
            import Serializable = cessnalib.sys.type.Identifiable;
            import Particle = cessnalib.being.Particle;
            export abstract class Organelle<InitialProperties> implements Identifiable {
                constructor(
                    public className: string,
                    public seed?: interaction.CanReceiveParticle,
                    public initialProperties?: InitialProperties) { } 
                /* 
                * TODO 
                * initialProperties must be type save 
                * may be like Map<string,string>
                */
            }
            export abstract class Limb<InitialProperties> extends Organelle<InitialProperties> implements interaction.CanThrowParticle {
                constructor(
                    className: string,
                    seed?: interaction.CanReceiveParticle,
                    initialProperties?: InitialProperties) {
                    super(className,seed,initialProperties);
                }
                public abstract throwParticle(particle: Particle): void;
            }
            export class EuglenaInfo implements sys.type.Identifiable {
                public className: string = "cessnalib.being.alive.EuglenaInfo";
                constructor(public euglenaId: string, public url: string, public port: string) { }
            }
            export class Euglena implements interaction.CanReceiveParticle {
                private organelles: any = {};
                private particles: any = {};
                private chromosome: dna.Gene[] = [];
                constructor(chromosome?:dna.Gene[]) {
                    this.chromosome = chromosome ? chromosome : [];
                }
                public addOrganelle(organelle:Organelle<Object>) {
                    this.organelles[organelle.className] = organelle;
                }
                public receiveParticle( impact: Particle ) {
                    this.triggerGene(impact);
                }
                public saveParticle(particle: Particle) {
                    this.particles[particle.className] = particle.content;
                    this.triggerGene(particle);
                }
                public deleteParticle(className:string) {
                    delete this.particles[className];
                }
                public getParticle(className: string):any {
                    return this.particles[className];
                }
                private triggerGene(particle: Particle) {
                    for (var i = 0; i<this.chromosome.length;i++) {
                        if (sys.type.StaticTools.Array.contains(this.chromosome[i].triggers, particle.className)) {
                            var reaction = this.chromosome[i].reaction;
                            var particles = this.particles;
                            var organelles = this.organelles;
                            reaction(particle,particles,organelles);
                        }
                    }
                }
            }
            export namespace dna {
                import Serializable = cessnalib.sys.type.Identifiable;
                export class Gene implements Serializable {
                    constructor(public className: string, public triggers: string[], public reaction: Reaction) { }
                }
                export interface Reaction {
                    (triggerParticle:Particle,particles:any,organelles:any): void;
                }
            }
        }
    }
}

