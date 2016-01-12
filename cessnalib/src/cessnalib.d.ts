/**
 * Created by codelovesme on 6/19/2015.
 */
export declare module cessnalib {
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
            interface Callback<T> {
                (t: T): void;
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
            namespace StaticTools {
                class Array {
                    static contains<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): boolean;
                    static indexOf<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): number;
                }
            }
        }
    }
    namespace being {
        import Identifiable = cessnalib.sys.type.Identifiable;
        namespace constants {
            const Particle: string;
        }
        class Particle {
            name: string;
            content: any;
            className: string;
            constructor(name: string, content: any);
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
            import Gene = cessnalib.being.alive.dna.Gene;
            namespace constants {
                const EuglenaInfo: string;
            }
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
                addGene(gene: Gene): void;
                addOrganelle(organelle: Organelle<Object>): void;
                receiveParticle(impact: Particle): void;
                saveParticle(particle: Particle): void;
                deleteParticle(className: string): void;
                getParticle(className: string): any;
                private triggerGene(particle);
            }
            namespace dna {
                import Time = cessnalib.sys.type.Time;
                import Identifiable = cessnalib.sys.type.Identifiable;
                import ParticleReference = cessnalib.being.alive.dna.condition.ParticleReference;
                class Gene implements Identifiable {
                    className: string;
                    triggers: string[];
                    reaction: Reaction;
                    constructor(className: string, triggers: string[], reaction: Reaction, condition?: dna.condition.LogicalPhrase | dna.condition.Comparison<any> | ParticleReference);
                }
                namespace condition {
                    import Date = cessnalib.sys.type.Date;
                    import Clock = cessnalib.sys.type.Clock;
                    namespace constants {
                        const TimeComparison: string;
                        const NumberComparison: string;
                        const LogicalPhrase: string;
                        const CalculationPhrase: string;
                        const ClockComparison: string;
                        const DateComparison: string;
                    }
                    class ParticleReference extends Particle {
                        constructor(name: string);
                    }
                    class StaticTools {
                        addOperandAndParameter<T, S>(phrase: Phrase<T>, operand: string, parameter: T): void;
                    }
                    class Executor {
                        private particles;
                        constructor(particles: any);
                        executeLogicalPhrase(logicalPhrase: LogicalPhrase): boolean;
                        execute(condition: any): any;
                        private executeComparison<T>(comparison);
                        executeCalculationPhrase(calculationPhrase: CalculationPhrase): number;
                        executeParticleReference(particle: ParticleReference): any;
                    }
                    interface TwoParameterBracket<T> extends Identifiable {
                        operand1: T;
                        operator: string;
                        operand2: T;
                    }
                    abstract class Phrase<T> implements Identifiable {
                        className: string;
                        operand1: Phrase<T> | T | ParticleReference;
                        operator: string;
                        operand2: Phrase<T> | T | ParticleReference;
                        stack: Array<any>;
                        constructor(className: string, operand1: Phrase<T> | T | ParticleReference, operator: string, operand2: Phrase<T> | T | ParticleReference);
                    }
                    class LogicalPhrase extends Phrase<Comparison<any>> {
                        constructor(operand1: Phrase<Comparison<any>> | Comparison<any> | ParticleReference, operator: string, operand2: Phrase<Comparison<any>> | Comparison<any> | ParticleReference);
                    }
                    abstract class Comparison<T> implements TwoParameterBracket<Comparison<T> | Particle | T> {
                        className: string;
                        operand1: Comparison<T> | ParticleReference | T;
                        operator: string;
                        operand2: Comparison<T> | ParticleReference | T;
                        constructor(className: string, operand1: Comparison<T> | ParticleReference | T, operator: string, operand2: Comparison<T> | ParticleReference | T);
                    }
                    class NumberComparison extends Comparison<number> {
                        constructor(operand1: NumberComparison | ParticleReference | number, operator: string, operand2: NumberComparison | ParticleReference | number);
                    }
                    class TimeComparison extends Comparison<Time> {
                        constructor(operand1: TimeComparison | ParticleReference | Time, operator: string, operand2: TimeComparison | ParticleReference | Time);
                    }
                    class DateComparison extends Comparison<Date> {
                        constructor(operand1: DateComparison | ParticleReference | Date, operator: string, operand2: DateComparison | ParticleReference | Date);
                    }
                    class ClockComparison extends Comparison<Clock> {
                        constructor(operand1: ClockComparison | Particle | Clock, operator: string, operand2: ClockComparison | Particle | Clock);
                    }
                    class CalculationPhrase extends Phrase<number> {
                        constructor(operand1: Phrase<number> | ParticleReference | number, operator: string, operand2: Phrase<number> | ParticleReference | number);
                    }
                    namespace operator {
                        namespace LogicalOperator {
                            const AND: string;
                            const OR: string;
                        }
                        namespace CalculationOperator {
                            const SUM: string;
                            const SUB: string;
                            const MUL: string;
                            const DIV: string;
                        }
                        namespace ComparisonOperator {
                            const EQUAL: string;
                            const NOTEQUAL: string;
                            const BIGGERTHAN: string;
                            const SMALLERTHAN: string;
                            const BIGEQUAL: string;
                            const SMALLEQUAL: string;
                        }
                    }
                }
                interface Reaction {
                    (triggerParticle: Particle, particles: any, organelles: any): void;
                }
            }
        }
    }
}
