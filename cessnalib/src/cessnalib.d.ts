/**
 * Created by codelovesme on 6/19/2015.
 */
export declare module cessnalib {
    namespace reference {
        namespace being {
            const Particle: cessnalib.being.Particle;
        }
    }
    namespace js {
        class Class {
            static extend(subInstance: any, parentInstance: any): void;
            static clone<T extends any>(obj: T, deep?: boolean): T;
            static merge(primaryInstance: any, secondaryInstance: any): any;
            static classify(emptyInstance: any, valueObj: any): any;
            static valuefy(instance: any): any;
            static isPrimaryType(obj: any): boolean;
            static instanceOf<T>(referenceObject: any, obj: any): obj is T;
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
        class ValueChooser implements sys.type.Identifiable {
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
                set(key: K, value: V): void;
                remove(key: K): void;
                get(key: K): V;
                getKeys(): K[];
                getValues(): V[];
            }
            namespace StaticTools {
                class Array {
                    static contains<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): boolean;
                    static indexOf<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): number;
                }
            }
            interface Identifiable {
                className: string;
            }
            class Time implements Identifiable {
                date: Date;
                clock: Clock;
                className: string;
                constructor(date: Date, clock: Clock);
            }
            class Date implements Identifiable {
                year: number;
                month: number;
                day: number;
                className: string;
                constructor(year: number, month: number, day: number);
            }
            class Clock implements Identifiable {
                hour: number;
                minute: number;
                second: number;
                className: string;
                constructor(hour: number, minute: number, second: number);
            }
        }
    }
    namespace being {
        import Identifiable = cessnalib.sys.type.Identifiable;
        class Particle implements Identifiable {
            className: string;
            content: any;
            constructor(className: string, content: any);
        }
        namespace interaction {
            interface CanReceiveParticle {
                receiveParticle(particle: Particle): void;
            }
            interface CanThrowParticle {
                throwParticle(particle: Particle): void;
            }
        }
        namespace alive {
            import Particle = cessnalib.being.Particle;
            abstract class Organelle<InitialProperties> implements Identifiable {
                className: string;
                seed: interaction.CanReceiveParticle;
                initialProperties: InitialProperties;
                constructor(className: string, seed?: interaction.CanReceiveParticle, initialProperties?: InitialProperties);
            }
            abstract class Limb<InitialProperties> extends Organelle<InitialProperties> implements interaction.CanThrowParticle {
                constructor(className: string, seed?: interaction.CanReceiveParticle, initialProperties?: InitialProperties);
                abstract throwParticle(particle: Particle): void;
            }
            class EuglenaInfo implements sys.type.Identifiable {
                euglenaId: string;
                url: string;
                port: string;
                className: string;
                constructor(euglenaId: string, url: string, port: string);
            }
            class Euglena implements interaction.CanReceiveParticle {
                private organelles;
                private particles;
                private chromosome;
                constructor(chromosome?: dna.Gene[]);
                addOrganelle(organelle: Organelle<Object>): void;
                receiveParticle(impact: Particle): void;
                saveParticle(particle: Particle): void;
                deleteParticle(className: string): void;
                getParticle(className: string): any;
                private triggerGene(particle);
            }
            namespace dna {
                import Serializable = cessnalib.sys.type.Identifiable;
                class Gene implements Serializable {
                    className: string;
                    triggers: string[];
                    reaction: Reaction;
                    constructor(className: string, triggers: string[], reaction: Reaction);
                }
                interface Reaction {
                    (triggerParticle: Particle, particles: any, organelles: any): void;
                }
            }
        }
    }
}
