/**
 * Created by codelovesme on 6/19/2015.
 */
export declare const JavascriptDate: DateConstructor;
export declare const JavascriptObject: ObjectConstructor;
export declare module euglena {
    namespace js {
        class Class {
            static clean(obj: Object): void;
            static extend(subInstance: any, parentInstance: any): void;
            static clone<T extends any>(obj: T, deep: boolean): T;
            static merge(primaryInstance: any, secondaryInstance: any): any;
            static classify(emptyInstance: any, valueObj: any): any;
            static valuefy(instance: any): any;
            static isPrimaryType(obj: any): boolean;
            static instanceOf<T>(referenceObject: T, obj: any | T): obj is T;
            static doesCover(obj1: any, obj2: any): boolean;
        }
    }
    namespace injection {
        class StaticTools {
            static valueOfValueChooser(valueChooser: ValueChooser): string;
        }
        class Configuration {
            values: ValueChooser[];
            objects: ObjectChooser[];
        }
        class ValueChooser {
            className: string;
            values: string[];
            index: number;
        }
        class ObjectChooser {
            class: ValueChooser;
            initialProperties: Object;
        }
    }
    namespace sys {
        namespace type {
            class Exception {
                message: string;
                innerException: Exception;
                constructor(message: string, innerException?: Exception);
            }
            class Map<K, V> {
                private condition;
                private keys;
                private values;
                constructor(condition?: (key1: K, key2: K) => boolean);
                add(key: K, value: V): void;
                keyExists(key: K): boolean;
                set(key: K, value: V): void;
                remove(key: K): void;
                indexOf(key: K): number;
                get(key: K): V;
                getKeys(): K[];
                getValues(): V[];
            }
            interface Callback<T> {
                (t: T | Exception): void;
            }
            interface Classifiable {
                className: string;
            }
            interface Identifiable {
                id: string;
            }
            interface Named {
                name: string;
            }
            class Time implements Classifiable {
                date: Date;
                clock: Clock;
                className: string;
                constructor(date: Date, clock: Clock);
            }
            class Date implements Classifiable {
                year: number;
                month: number;
                day: number;
                className: string;
                constructor(year: number, month: number, day: number);
            }
            class Clock implements Classifiable {
                hour: number;
                minute: number;
                second: number;
                className: string;
                constructor(hour: number, minute: number, second: number);
            }
            namespace reference {
                const Exception: Exception;
            }
            namespace StaticTools {
                class Object {
                    static equals(obj1: any, obj2: any, deep?: boolean): boolean;
                }
                class Exception {
                    static isNotException<T>(t: T | Exception): t is T;
                }
                class UUID {
                    static generate(): string;
                }
                class Time {
                    static biggerThan(time1: sys.type.Time, time2: sys.type.Time): boolean;
                    static equals(time1: sys.type.Time, time2: sys.type.Time): boolean;
                    static now(): sys.type.Time;
                    static addMiliseconds(time: sys.type.Time, miliseconds: number): sys.type.Time;
                    static DayToMiliseconds(minute: number): number;
                    static HourToMiliseconds(minute: number): number;
                    static MinuteToMiliseconds(minute: number): number;
                    static SecondToMiliseconds(minute: number): number;
                    static fromJavascriptDate(date: any): sys.type.Time;
                    static toJavascriptDate(time: sys.type.Time): any;
                }
                class Date {
                    static equals(date1: sys.type.Date, date2: sys.type.Date): boolean;
                    static biggerThan(date1: sys.type.Date, date2: sys.type.Date): boolean;
                }
                class Clock {
                    static equals(clock1: sys.type.Clock, clock2: sys.type.Clock): boolean;
                    static biggerThan(clock1: sys.type.Clock, clock2: sys.type.Clock): boolean;
                }
                class Array {
                    static combine<T>(array1: T[], array2: T[]): T[];
                    static equals<T>(array1: T[], array2: T[], compare?: (t1: T, t2: T) => boolean): boolean;
                    static contains<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): boolean;
                    static containsArray<T>(master: T[], slave: T[], compare?: (t1: T, t2: T) => boolean): boolean;
                    static indexOf<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): number;
                    static removeAt<T>(array: T[], index: number): T;
                    static remove<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): T;
                    static removeAllMatched<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): T[];
                }
            }
        }
    }
    namespace being {
        import Named = euglena.sys.type.Named;
        class Particle {
            meta: any;
            data: any;
            constructor(meta: any, data: any);
        }
        namespace interaction {
            interface CanReceiveParticle {
                receive: Receive;
            }
            interface Receive {
                (particle: Particle, source: string): void;
            }
            class Impact {
                particle: Particle;
                token: string;
                constructor(particle: Particle, token: string);
            }
            namespace constants {
                const ReceivedParticleReference: string;
            }
        }
        namespace alive {
            import Classifiable = euglena.sys.type.Classifiable;
            import Particle = euglena.being.Particle;
            namespace dna {
                class ParticleReference extends Particle {
                    constructor(meta: any);
                }
                class StaticTools {
                    static ParticleReference: {
                        equals: (ref1: ParticleReference, ref2: ParticleReference) => boolean;
                    };
                }
                interface Reaction {
                    (particle: Particle, sourceOrganelle: string): void;
                }
                class Gene implements euglena.sys.type.Named {
                    name: string;
                    triggers: Object;
                    reaction: Reaction;
                    override: string;
                    expiretime: euglena.sys.type.Time;
                    constructor(name: string, triggers: Object, reaction: Reaction, override?: string, expiretime?: euglena.sys.type.Time);
                }
                class GarbageCollector {
                    private chromosome;
                    private particles;
                    private timeout;
                    constructor(chromosome?: Gene[], particles?: Particle[]);
                    start(): void;
                }
            }
            namespace particles {
                interface SapContent {
                    euglenaName: string;
                }
            }
            namespace constants {
                const OutSide: string;
            }
            abstract class Organelle<SapContent> implements Named, Classifiable, interaction.CanReceiveParticle {
                name: string;
                className: string;
                send: interaction.Receive;
                private actions;
                constructor(name: string, className: string, send?: interaction.Receive);
                protected abstract bindActions(addAction: (particleName: string, action: (particle: Particle) => void) => void): void;
                receive(particle: Particle): void;
            }
            class Cytoplasm {
                static instance: Cytoplasm;
                private static organelles;
                static particles: Particle[];
                static chromosome: dna.Gene[];
                constructor(particles: Particle[], organelles: Organelle<any>[], chromosome: dna.Gene[]);
                static receive(particle: Particle, source: string): void;
                static transmit(organelleName: string, particle: Particle): void;
                static saveParticle(particle: being.Particle): void;
                static getParticle(particleReference: dna.ParticleReference): being.Particle;
                static getMatchedParticle(particleReference: dna.ParticleReference): being.Particle;
                private static indexOfParticle(particleReference);
            }
        }
    }
}
