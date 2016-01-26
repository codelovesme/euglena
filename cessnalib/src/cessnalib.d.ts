export declare module cessnalib {
    namespace js {
        class Class {
            static extend(subInstance: any, parentInstance: any): void;
            static clone<T extends any>(obj: T, deep?: boolean): T;
            static merge(primaryInstance: any, secondaryInstance: any): any;
            static classify(emptyInstance: any, valueObj: any): any;
            static valuefy(instance: any): any;
            static isPrimaryType(obj: any): boolean;
            static instanceOf<T>(referenceObject: T, obj: any | T): obj is T;
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
                set(key: K, value: V): void;
                remove(key: K): void;
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
            namespace StaticTools {
                class Exception {
                    static isNotException<T>(t: T | Exception): t is T;
                }
                class UUID {
                    static generate(): string;
                }
                class Time {
                    static equals(time1: sys.type.Time, time2: sys.type.Time): boolean;
                    static now(): sys.type.Time;
                }
                class Date {
                    static equals(date1: sys.type.Date, date2: sys.type.Date): boolean;
                }
                class Clock {
                    static equals(clock1: sys.type.Clock, clock2: sys.type.Clock): boolean;
                }
                class Array {
                    static contains<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): boolean;
                    static indexOf<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): number;
                }
            }
        }
    }
    namespace being {
        import Named = cessnalib.sys.type.Named;
        class Particle {
            name: string;
            content: any;
            constructor(name: string, content: any);
        }
        namespace interaction {
            interface ReceiveParticle {
                (particle: Particle): void;
            }
            interface CanReceiveParticle {
                receiveParticle: ReceiveParticle;
            }
            interface Impact extends Named {
                name: string;
                sender: string;
                particle: Particle;
            }
            class ImpactGenerator {
                euglenaName: string;
                constructor(euglenaName: string);
                generateImpact(particle: Particle, destination: string): Impact;
            }
            class StaticTools {
                static generateImpact(sender: string, particle: Particle, destination: string): Impact;
            }
        }
        namespace alive {
            import Particle = cessnalib.being.Particle;
            namespace dna {
                import Time = cessnalib.sys.type.Time;
                import Classifiable = cessnalib.sys.type.Classifiable;
                import ParticleReference = cessnalib.being.alive.dna.condition.ParticleReference;
                class Gene implements Named {
                    name: string;
                    triggers: string[];
                    reaction: Reaction;
                    condition: dna.condition.LogicalPhrase | dna.condition.Comparison<any> | ParticleReference;
                    constructor(name: string, triggers: string[], reaction: Reaction, condition?: dna.condition.LogicalPhrase | dna.condition.Comparison<any> | ParticleReference);
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
                        const DateTemplateComparison: string;
                        const DateTemplate: string;
                        const ClockTemplateComparison: string;
                        const ClockTemplate: string;
                        const TimeTemplateComparison: string;
                        const TimeTemplate: string;
                    }
                    class ParticleReference extends Particle {
                        constructor(name: string);
                    }
                    class DateTemplate extends Date implements Classifiable {
                        className: string;
                        constructor(year: number, month: number, day: number);
                    }
                    class ClockTemplate extends Clock implements Classifiable {
                        className: string;
                        constructor(hour: number, minute: number, second: number);
                    }
                    class TimeTemplate extends Time implements Classifiable {
                        className: string;
                        constructor(date: Date, clock: Clock);
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
                        private executeCalculationPhrase(calculationPhrase);
                        private executeParticleReference(particle);
                    }
                    interface TwoParameterBracket<T> extends Classifiable {
                        operand1: T;
                        operator: string;
                        operand2: T;
                    }
                    abstract class Phrase<T> implements Classifiable {
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
                        constructor(operand1: ClockComparison | ParticleReference | Clock, operator: string, operand2: ClockComparison | ParticleReference | Clock);
                    }
                    class DateTemplateComparison extends Comparison<DateTemplate> {
                        constructor(operand1: DateTemplateComparison | ParticleReference | DateTemplate, operator: string, operand2: DateTemplateComparison | ParticleReference | DateTemplate);
                    }
                    class ClockTemplateComparison extends Comparison<ClockTemplate> {
                        constructor(operand1: ClockTemplateComparison | ParticleReference | ClockTemplate, operator: string, operand2: ClockTemplateComparison | ParticleReference | ClockTemplate);
                    }
                    class TimeTemplateComparison extends Comparison<TimeTemplate> {
                        constructor(operand1: TimeTemplateComparison | ParticleReference | TimeTemplate, operator: string, operand2: TimeTemplateComparison | ParticleReference | TimeTemplate);
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
                        namespace TemplateOperator {
                            const COVER: string;
                        }
                    }
                }
                interface Reaction {
                    (particle: Particle, particles: any, organelles: any, receiveParticle: interaction.ReceiveParticle, impactGenerator: interaction.ImpactGenerator): void;
                }
            }
            namespace constants {
                const OutSide: string;
                const EuglenaInfo: string;
                namespace particles {
                    const EuglenaName: string;
                }
            }
            abstract class Organelle<InitialProperties> implements Named, interaction.CanReceiveParticle {
                name: string;
                impactGenerator: interaction.ImpactGenerator;
                nucleus: interaction.CanReceiveParticle;
                initialProperties: InitialProperties;
                constructor(name: string, impactGenerator?: interaction.ImpactGenerator, nucleus?: interaction.CanReceiveParticle, initialProperties?: InitialProperties);
                abstract receiveParticle(particle: Particle): void;
            }
            class EuglenaInfo implements Named {
                name: string;
                url: string;
                port: string;
                constructor(name: string, url: string, port: string);
            }
            interface OrganelleInfo {
            }
            class Euglena implements interaction.CanReceiveParticle {
                private chromosome;
                private particles;
                private impactGenerator;
                private executor;
                private organelles;
                constructor(chromosome: dna.Gene[], particles: any, organelles: Organelle<any>[], impactGenerator: interaction.ImpactGenerator);
                receiveParticle(particle: Particle): void;
                private triggerGene(particle);
            }
        }
    }
    namespace reference {
        namespace sys {
            namespace type {
                const Exception: cessnalib.sys.type.Exception;
            }
        }
    }
}
