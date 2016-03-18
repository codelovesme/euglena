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
export module cessnalib {
    export const JavascriptDate = Date;
    export namespace js {
        export class Class {
            public static extend(subInstance: any, parentInstance: any): void {
                for (let prop in parentInstance) {
                    if (!subInstance[prop]) subInstance[prop] = parentInstance[prop];
                }
                return subInstance;
            }
            public static clone<T extends any>(obj: T, deep: boolean): T {
                var sub: any = {};
                for (var prop in obj) {
                    sub[prop] = (deep && ('object' === typeof obj[prop])) ? Class.clone(obj[prop], true) : obj[prop];
                }
                return <T>sub;
            }
            public static merge(primaryInstance: any, secondaryInstance: any) {
                for (var prop in secondaryInstance) {
                    if (!primaryInstance[prop]) primaryInstance[prop] = secondaryInstance[prop];
                }
                return primaryInstance;
            }
            public static classify(emptyInstance: any, valueObj: any) {
                for (var prop in emptyInstance) {
                    if (("function" !== typeof emptyInstance[prop]) && !emptyInstance[prop]) emptyInstance[prop] = valueObj[prop];
                }
                return emptyInstance;
            }
            public static valuefy(instance: any) {
                var valueObj: any = {};
                var propToValuefy: any = null;
                for (var prop in instance) {
                    if ("function" !== typeof instance[prop]) {
                        valueObj[prop] = instance[prop];
                    } else if (typeof prop === "object") {
                        valueObj[prop] = Class.valuefy(instance[prop]);
                    } else if ((prop.substring(0, 3) === "get") && (propToValuefy = prop.substring(3, prop.length))) {
                        valueObj[propToValuefy[0].toLowerCase() + propToValuefy.substring(1, propToValuefy.length)] = instance[prop]();
                    }
                }
                return valueObj;
            }
            public static isPrimaryType(obj: any): boolean {
                return typeof obj === "string" ||
                    typeof obj === "number" ||
                    typeof obj === "boolean";
            }
            public static instanceOf<T>(referenceObject: T, obj: any | T): obj is T {
                if (Class.isPrimaryType(referenceObject)) return typeof referenceObject === typeof obj;
                for (var prop in referenceObject) {
                    if (obj[prop] === undefined)
                        return false;
                }
                return true;
            }
        }
    }
    export namespace injection {
        export class StaticTools {
            public static valueOfValueChooser(valueChooser: ValueChooser): string {
                return valueChooser.values[valueChooser.index];
            }
        }
        export class Configuration {
            public values: ValueChooser[];
            public objects: ObjectChooser[];
        }
        export class ValueChooser {
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
                    var returnValue: V = null;
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
            export interface Callback<T> {
                (t: T | Exception): void
            }
            export interface Classifiable {
                className: string;
            }
            export interface Identifiable {
                id: string;
            }
            export interface Named {
                name: string;
            }
            export class Time implements Classifiable {
                className: string = "cessnalib.sys.type.Time";
                constructor(public date: Date, public clock: Clock) { }
            }
            export class Date implements Classifiable {
                className: string = "cessnalib.sys.type.Date";
                constructor(public year: number, public month: number, public day: number) { }
            }
            export class Clock implements Classifiable {
                className: string = "cessnalib.sys.type.Clock";
                constructor(public hour: number, public minute: number, public second: number) { }
            }
            export namespace StaticTools {
                export class Exception {
                    public static isNotException<T>(t: T | Exception): t is T {
                        return cessnalib.js.Class.instanceOf(cessnalib.reference.sys.type.Exception, t);
                    }
                }
                export class UUID {
                    public static generate(): string {
                        function word() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        return word() + word() + '-' + word() + '-' + word() + '-' +
                            word() + '-' + word() + word() + word();
                    }
                }
                export class Time {
                    public static biggerThan(time1:sys.type.Time, time2:sys.type.Time):boolean {
                        return Date.biggerThan(time1.date, time2.date) ? true :
                            Date.biggerThan(time1.date, time2.date) ? false :
                                Clock.biggerThan(time1.clock, time2.clock);
                    }
                    public static equals(time1: sys.type.Time, time2: sys.type.Time): boolean {
                        return Date.equals(time1.date, time2.date) && Clock.equals(time1.clock, time2.clock);
                    }
                    public static now(): sys.type.Time {
                        let newDate = new JavascriptDate();
                        return new sys.type.Time(new sys.type.Date(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, newDate.getUTCDate()),
                            new sys.type.Clock(newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds()));
                    }
                    public static addMiliseconds(time:sys.type.Time,miliseconds:number):sys.type.Time {
                        return Time.fromJavascriptDate(new JavascriptDate(
                            Time.toJavascriptDate(time).getTime()+miliseconds));
                    }
                    public static DayToMiliseconds(minute:number): number {
                        return minute * 86400000;
                    }
                    public static HourToMiliseconds(minute:number): number {
                        return minute * 3600000;
                    }
                    public static MinuteToMiliseconds(minute:number): number {
                        return minute * 60000;
                    }
                    public static SecondToMiliseconds(minute:number): number {
                        return minute * 1000;
                    }
                    public static fromJavascriptDate(date:any):sys.type.Time{
                        return new sys.type.Time(new sys.type.Date(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()),
                            new sys.type.Clock(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
                    }
                    public static toJavascriptDate(time:sys.type.Time): any{
                        let date = new JavascriptDate();
                        date.setUTCFullYear(time.date.year);
                        date.setUTCMonth(time.date.month-1);
                        date.setUTCDate(time.date.day);
                        date.setUTCHours(time.clock.hour);
                        date.setUTCMinutes(time.clock.minute);
                        date.setUTCSeconds(time.clock.second);
                        return date;
                    }
                }
                export class Date {
                    public static equals(date1: sys.type.Date, date2: sys.type.Date): boolean {
                        return date1.year == date2.year &&
                            date1.month == date2.month &&
                            date1.day == date2.day;
                    }
                    public static biggerThan(date1:sys.type.Date,date2:sys.type.Date):boolean { 
                        return date1.year > date2.year ? true : date1.year < date2.year ? false :
                            date1.month > date2.month ? true : date1.month < date2.month ? false :
                                date1.day > date2.day;
                    }
                }
                export class Clock {
                    public static equals(clock1: sys.type.Clock, clock2: sys.type.Clock): boolean {
                        return clock1.hour == clock2.hour &&
                            clock1.minute == clock2.minute &&
                            clock1.second == clock2.second;
                    }
                    public static biggerThan(clock1:sys.type.Clock,clock2:sys.type.Clock):boolean{
                        return clock1.hour > clock2.hour ? true : clock1.hour < clock2.hour ? false :
                            clock1.minute > clock2.minute ? true : clock1.minute < clock2.minute ? false :
                                clock1.second > clock2.second;
                    }
                }
                export class Array {
                    public static contains<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): boolean {
                        return Array.indexOf(array, t, compare) >= 0;
                    }
                    public static indexOf<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): number {
                        if (compare) {
                            for (var i = 0; i < array.length; i++) {
                                if (compare(array[i], t)) {
                                    return i;
                                }
                            }
                        } else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === t) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                }
            }
        }
    }
    export namespace being {
        import Classifiable = cessnalib.sys.type.Classifiable;
        import Named = cessnalib.sys.type.Named;
        export class Particle {
            constructor(public name: string, public content: any,public of:string) { }
        }
        export namespace interaction {
            import EuglenaInfo = cessnalib.being.alive.EuglenaInfo;
            export interface ReceiveParticle {
                (particle: Particle): void;
            }
            export interface CanReceiveParticle {
                receiveParticle: ReceiveParticle;
            }
            export interface Impact {
                particle: Particle;
                token:string;
            }
            export namespace constants{
                export const ReceivedParticleReference = "ReceivedParticleReference";
            }
            export class ImpactGenerator {
                constructor(public euglenaName: string) { }
                public generateImpact(particle: Particle): Impact {
                    return StaticTools.generateImpact(this.euglenaName, particle);
                }
            }
            export class StaticTools {
                public static generateImpact(from: string, particle: Particle): Impact {
                    return {
                        "particle": particle,
                        "token":"" 
                        //TODO fix 
                    };
                }
            }
        }
        export namespace alive {
            import Classifiable = cessnalib.sys.type.Classifiable;
            import Particle = cessnalib.being.Particle;
            import Gene = cessnalib.being.alive.dna.Gene;
            import Impact = cessnalib.being.interaction.Impact;
            export namespace dna {
                import Time = cessnalib.sys.type.Time;
                import Classifiable = cessnalib.sys.type.Classifiable;
                import ParticleReference = cessnalib.being.alive.dna.condition.ParticleReference;
                import CanReceiveParticle = cessnalib.being.interaction.CanReceiveParticle;
                import DoesParticalExist = cessnalib.being.alive.dna.condition.DoesParticalExist;
                export class Gene implements Named {
                    constructor(
                        public name: string,
                        public triggers: string[],
                        public reaction: Reaction,
                        public condition?: dna.condition.LogicalPhrase | dna.condition.Comparison<any> | ParticleReference | DoesParticalExist,
                        public parameters?:Object,
                        public expiretime?:Time) { }
                }
                export namespace condition {
                    import Date = cessnalib.sys.type.Date;
                    import Clock = cessnalib.sys.type.Clock;
                    export namespace constants {
                        export const DoesParticalExist = "cessnalib.being.alive.dna.condition.DoesParticalExist";
                        export const TimeComparison = "cessnalib.being.alive.dna.condition.TimeComparison";
                        export const NumberComparison = "cessnalib.being.alive.dna.condition.NumberComparison";
                        export const StringComparison = "cessnalib.being.alive.dna.condition.StringComparison";
                        export const LogicalPhrase = "cessnalib.being.alive.dna.condition.ConditionPhrase";
                        export const CalculationPhrase = "cessnalib.being.alive.dna.condition.CalculationPhrase";
                        export const ClockComparison = "cessnalib.being.alive.dna.condition.ClockComparison";
                        export const DateComparison = "cessnalib.being.alive.dna.condition.DateComparison";
                        export const DateTemplateComparison = "cessnalib.being.alive.dna.condition.DateTemplateComparison";
                        export const DateTemplate = "cessnalib.being.alive.dna.condition.DateTemplate";
                        export const ClockTemplateComparison = "cessnalib.being.alive.dna.condition.ClockTemplateComparison";
                        export const ClockTemplate = "cessnalib.being.alive.dna.condition.ClockTemplate";
                        export const TimeTemplateComparison = "cessnalib.being.alive.dna.condition.TimeTemplateComparison";
                        export const TimeTemplate = "cessnalib.being.alive.dna.condition.TimeTemplate";
                        export const DetailedParticleReference = "cessnalib.being.alive.dna.condition.DetailedParticleReference";
                    }
                    export class DoesParticalExist implements Classifiable {
                        public className = constants.DoesParticalExist;
                        constructor(public particleReference:ParticleReference){  }
                    }
                    export class ParticleReference extends Particle {
                        constructor(name: string) {
                            super(name, null,null);
                        }
                    }
                    export class DetailedParticleReference {
                        public className = constants.DetailedParticleReference;
                        constructor(public particleReference:ParticleReference, public query:string){ }
                    }
                    export class ReceivedParticleReference extends Particle {
                        constructor() {
                            super(being.interaction.constants.ReceivedParticleReference, null,null);
                        }
                    }
                    export class DateTemplate extends Date implements Classifiable {
                        public className = constants.DateTemplate;
                        constructor(year: number, month: number, day: number) {
                            super(year, month, day);
                        }
                    }
                    export class ClockTemplate extends Clock implements Classifiable {
                        public className = constants.ClockTemplate;
                        constructor(hour: number, minute: number, second: number) {
                            super(hour, minute, second);
                        }
                    }
                    export class TimeTemplate implements Classifiable {
                        public className = constants.TimeTemplate;
                        constructor(public dateTemplate: DateTemplate, public clockTemplate: ClockTemplate) { }
                    }
                    export class StaticTools {
                        public addOperandAndParameter<T, S>(phrase: Phrase<T>, operand: string, parameter: T): void {
                            phrase.stack.push(operand, parameter);
                        }
                    }
                    export class Executor {
                        constructor(private particles: any) { }
                        public executeLogicalPhrase(logicalPhrase: LogicalPhrase,receivedParticle:Particle): boolean {
                            var stack = logicalPhrase.stack;
                            var result: boolean = this.execute(stack.shift(),receivedParticle);
                            var operator: string = stack.shift();
                            do {
                                let operand2: boolean = this.execute(stack.shift(),receivedParticle);
                                switch (operator) {
                                    case condition.operator.LogicalOperator.AND:
                                        result = result && operand2;
                                        break;
                                    case condition.operator.LogicalOperator.OR:
                                        result = result || operand2;
                                        break;
                                }
                            } while (operator = stack.shift());
                            return result;
                        }
                        public execute(condition: any,receivedParticle:Particle): any {
                            let result: any = condition;
                            if (typeof condition === "string" || typeof condition === "number") {
                                result = condition;
                            }
                            if (cessnalib.js.Class.instanceOf(new Particle("Reference", true,"mine"), condition)) {
                                result = condition.name === interaction.constants.ReceivedParticleReference ? receivedParticle.content : this.executeParticleReference(condition);
                            } else {
                                switch (condition.className) {
                                    case constants.DoesParticalExist:
                                        result = this.particles[(condition as DoesParticalExist).particleReference.name] ? true : false;
                                        break;
                                    case constants.DetailedParticleReference:
                                        result = this.executeDetailedParticle(condition,receivedParticle);
                                        break;
                                    case constants.LogicalPhrase:
                                        result = this.executeLogicalPhrase(condition,receivedParticle);
                                        break;
                                    case constants.CalculationPhrase:
                                        result = this.executeCalculationPhrase(condition,receivedParticle);
                                        break;
                                    case constants.TimeComparison:
                                    case constants.TimeTemplateComparison:
                                    case constants.DateComparison:
                                    case constants.DateTemplateComparison:
                                    case constants.ClockComparison:
                                    case constants.ClockTemplateComparison:
                                    case constants.NumberComparison:
                                    case constants.StringComparison:
                                    case constants.DateTemplateComparison:
                                        result = this.executeComparison(condition,receivedParticle);
                                        break;
                                }
                            }
                            return result;
                        }
                        private executeComparison<T>(comparison: Comparison<T>,receivedParticle:Particle): boolean {
                            let result: boolean = false;
                            let operand1 = this.execute(comparison.operand1,receivedParticle);
                            let operator = comparison.operator;
                            let operand2 = this.execute(comparison.operand2,receivedParticle);
                            switch (comparison.className) {
                                case constants.NumberComparison:
                                    let number1: number = Number(operand1);
                                    let number2: number = Number(operand2);
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = number1 > number2;
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = number1 === number2;
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = number1 !== number2;
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = number1 < number2;
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = number1 >= number2;
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = number1 <= number2;
                                            break;
                                    }
                                    break;
                                case constants.StringComparison:
                                    let string1: string = String(operand1);
                                    let string2: string = String(operand2);
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = string1 === string2;
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = string1 !== string2;
                                            break;
                                    }
                                    break;
                                case constants.TimeComparison:
                                    let time1: Time = operand1;
                                    let time2: Time = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.BIGGERTHAN, time2.date),receivedParticle) ? true :
                                                this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.SMALLERTHAN, time2.date),receivedParticle) ? false :
                                                    this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.BIGGERTHAN, time2.clock),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.EQUAL, time2.date),receivedParticle) &&
                                                this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.EQUAL, time2.clock),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.SMALLERTHAN, time2.date),receivedParticle) ? true :
                                                this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.BIGGERTHAN, time2.date),receivedParticle) ? false :
                                                    this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.SMALLERTHAN, time2.clock),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.BIGGERTHAN, time2),receivedParticle) ||
                                                this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.SMALLERTHAN, time2),receivedParticle) ||
                                                this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2),receivedParticle);
                                            break;
                                    }
                                    break;
                                case constants.DateComparison:
                                    let date1: cessnalib.sys.type.Date = operand1;
                                    let date2: cessnalib.sys.type.Date = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = date1.year > date2.year ? true : date1.year < date2.year ? false :
                                                date1.month > date2.month ? true : date1.month < date2.month ? false :
                                                    date1.day > date2.day;
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = date1.year === date2.year &&
                                                date1.month === date2.month &&
                                                date1.day === date2.day;
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !(date1.year === date2.year &&
                                                date1.month === date2.month &&
                                                date1.day === date2.day);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = date1.year < date2.year ? true : date1.year > date2.year ? false :
                                                date1.month < date2.month ? true : date1.month > date2.month ? false :
                                                    date1.day < date2.day;
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.BIGGERTHAN, date2),receivedParticle) ||
                                                this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.EQUAL, date2),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.SMALLERTHAN, date2),receivedParticle) ||
                                                this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.EQUAL, date2),receivedParticle);
                                            break;
                                    }
                                    break;
                                case constants.ClockComparison:
                                    let clock1: cessnalib.sys.type.Clock = operand1;
                                    let clock2: cessnalib.sys.type.Clock = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = clock1.hour > clock2.hour ? true : clock1.hour < clock2.hour ? false :
                                                clock1.minute > clock2.minute ? true : clock1.minute < clock2.minute ? false :
                                                    clock1.second > clock2.second;
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = clock1.hour === clock2.hour &&
                                                clock1.minute === clock2.minute &&
                                                clock1.second === clock2.second;
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !(clock1.hour === clock2.hour &&
                                                clock1.minute === clock2.minute &&
                                                clock1.second === clock2.second);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = clock1.hour < clock2.hour ? true : clock1.hour > clock2.hour ? false :
                                                clock1.minute < clock2.minute ? true : clock1.minute > clock2.minute ? false :
                                                    clock1.second < clock2.second;
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.BIGGERTHAN, clock2),receivedParticle) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2),receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.SMALLERTHAN, clock2),receivedParticle) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2),receivedParticle);
                                            break;
                                    }
                                    break;
                                case constants.DateTemplateComparison:
                                    let dateTemplate: DateTemplate = null;
                                    let date: Date = null;
                                    if (operand1.className === constants.DateTemplate) {
                                        dateTemplate = operand1;
                                        date = operand2;
                                    } else {
                                        date = operand1;
                                        dateTemplate = operand2;
                                    }
                                    switch (comparison.operator) {
                                        case condition.operator.TemplateOperator.COVER:
                                            result = dateTemplate.year ? dateTemplate.year === date.year : true;
                                            result = result && (dateTemplate.month ? dateTemplate.month === date.month : true);
                                            result = result && (dateTemplate.day ? dateTemplate.day === date.day : true);
                                            break;
                                    }
                                    break;
                                case constants.ClockTemplateComparison:
                                    let clockTemplate: ClockTemplate = null;
                                    let clock: Clock = null;
                                    if (operand1.className === constants.ClockTemplate) {
                                        clockTemplate = operand1;
                                        clock = operand2;
                                    } else {
                                        clock = operand1;
                                        clockTemplate = operand2;
                                    }
                                    switch (comparison.operator) {
                                        case condition.operator.TemplateOperator.COVER:
                                            result = clockTemplate.hour ? clockTemplate.hour === clock.hour : true;
                                            result = result && (clockTemplate.minute ? clockTemplate.minute === clock.minute : true);
                                            result = result && (clockTemplate.second ? clockTemplate.second === clock.second : true);
                                            break;
                                    }
                                    break;
                                case constants.TimeTemplateComparison:
                                    let timeTemplate: TimeTemplate = null;
                                    let time: Time = null;
                                    if (operand1.className === constants.TimeTemplate) {
                                        timeTemplate = operand1;
                                        time = operand2;
                                    } else {
                                        time = operand1;
                                        timeTemplate = operand2;
                                    }
                                    switch (comparison.operator) {
                                        case condition.operator.TemplateOperator.COVER:
                                            result = timeTemplate.dateTemplate ? this.execute(new DateTemplateComparison(timeTemplate.dateTemplate, condition.operator.TemplateOperator.COVER, time.date),receivedParticle) : true;
                                            result = result && (timeTemplate.clockTemplate ? this.execute(new ClockTemplateComparison(timeTemplate.clockTemplate, condition.operator.TemplateOperator.COVER, time.clock),receivedParticle) : true);
                                            break;
                                    }
                                    break;
                            }
                            return result;
                        }
                        private executeCalculationPhrase(calculationPhrase: CalculationPhrase,receivedParticle:Particle): number {
                            var stack = calculationPhrase.stack;
                            //get multiplication and division manipulations first
                            //for(let item of calculationPhrase.stack){

                            //}
                            var result: number = this.execute(stack.shift(),receivedParticle);
                            var operator: string = stack.shift();
                            do {
                                let operand2 = this.execute(stack.shift(),receivedParticle);
                                switch (operator) {
                                    case condition.operator.CalculationOperator.SUM:
                                        result += operand2;
                                        break;
                                    case condition.operator.CalculationOperator.SUB:
                                        result -= operand2;
                                        break;
                                    case condition.operator.CalculationOperator.MUL:
                                        result *= operand2;
                                        break;
                                    case condition.operator.CalculationOperator.DIV:
                                        result /= operand2;
                                        break;
                                }
                            } while (operator = stack.shift());
                            return result;
                        }
                        private executeParticleReference(particle: ParticleReference): any {
                            return this.particles[particle.name].content;
                        }
                        private executeDetailedParticle( detailedParticleReference: DetailedParticleReference, receivedParticle:Particle){
                            let details = detailedParticleReference.query.split(".");
                            let obj:any = null;
                            if(detailedParticleReference.particleReference.name === interaction.constants.ReceivedParticleReference){
                                obj = receivedParticle;
                                details.shift(); //remove this
                                for(let prop of details){
                                    obj = obj[prop];
                                }
                            }else{
                                obj = this.executeParticleReference(detailedParticleReference.particleReference);
                            }
                            return obj;
                        }
                    }
                    export interface TwoParameterBracket<T> extends Classifiable {
                        operand1: T;
                        operator: string;
                        operand2: T;
                    }
                    export abstract class Phrase<T> implements Classifiable {
                        public stack: Array<any>;
                        constructor(
                            public className: string,
                            public operand1: Phrase<T> | T | ParticleReference,
                            public operator: string,
                            public operand2: Phrase<T> | T | ParticleReference
                        ) {
                            this.stack.push(operand1, operator, operand2);
                        }
                    }
                    export class LogicalPhrase extends Phrase<Comparison<any>>{
                        constructor(
                            operand1: Phrase<Comparison<any>> | Comparison<any> | ParticleReference,
                            operator: string,
                            operand2: Phrase<Comparison<any>> | Comparison<any> | ParticleReference
                        ) {
                            super(constants.LogicalPhrase, operand1, operator, operand2);
                        }
                    }
                    export abstract class Comparison<T> implements TwoParameterBracket<Comparison<T> | ParticleReference | DetailedParticleReference | T>{
                        constructor(
                            public className: string,
                            public operand1: Comparison<T> | ParticleReference | DetailedParticleReference | T,
                            public operator: string,
                            public operand2: Comparison<T> | ParticleReference | DetailedParticleReference | T
                        ) { }
                    }
                    export class NumberComparison extends Comparison<number>{
                        constructor(
                            operand1: NumberComparison | ParticleReference | number,
                            operator: string,
                            operand2: NumberComparison | ParticleReference | number
                        ) {
                            super(constants.NumberComparison, operand1, operator, operand2);
                        }
                    }
                    export class StringComparison extends Comparison<string>{
                        constructor(
                            operand1: StringComparison | DetailedParticleReference | ParticleReference | string,
                            operator: string,
                            operand2: StringComparison | DetailedParticleReference | ParticleReference | string
                        ) {
                            super(constants.StringComparison, operand1, operator, operand2);
                        }
                    }
                    export class TimeComparison extends Comparison<Time> {
                        constructor(
                            operand1: TimeComparison | ParticleReference | Time,
                            operator: string,
                            operand2: TimeComparison | ParticleReference | Time
                        ) {
                            super(constants.TimeComparison, operand1, operator, operand2);
                        }
                    }
                    export class DateComparison extends Comparison<Date> {
                        constructor(
                            operand1: DateComparison | ParticleReference | Date,
                            operator: string,
                            operand2: DateComparison | ParticleReference | Date
                        ) {
                            super(constants.DateComparison, operand1, operator, operand2);
                        }
                    }
                    export class ClockComparison extends Comparison<Clock> {
                        constructor(
                            operand1: ClockComparison | ParticleReference | Clock,
                            operator: string,
                            operand2: ClockComparison | ParticleReference | Clock
                        ) {
                            super(constants.ClockComparison, operand1, operator, operand2);
                        }
                    }
                    export class TimeTemplateComparison extends Comparison<TimeTemplate> {
                        constructor(
                            operand1: TimeTemplateComparison | ParticleReference | TimeTemplate,
                            operator: string,
                            operand2: TimeTemplateComparison | ParticleReference | TimeTemplate
                        ) {
                            super(constants.TimeTemplateComparison, operand1, operator, operand2);
                        }
                    }
                    export class DateTemplateComparison extends Comparison<DateTemplate> {
                        constructor(
                            operand1: DateTemplateComparison | ParticleReference | DateTemplate,
                            operator: string,
                            operand2: DateTemplateComparison | ParticleReference | DateTemplate
                        ) {
                            super(constants.DateTemplateComparison, operand1, operator, operand2);
                        }
                    }
                    export class ClockTemplateComparison extends Comparison<ClockTemplate> {
                        constructor(
                            operand1: ClockTemplateComparison | ParticleReference | ClockTemplate,
                            operator: string,
                            operand2: ClockTemplateComparison | ParticleReference | ClockTemplate
                        ) {
                            super(constants.ClockTemplateComparison, operand1, operator, operand2);
                        }
                    }
                    export class CalculationPhrase extends Phrase<number>{
                        constructor(
                            operand1: Phrase<number> | ParticleReference | number,
                            operator: string,
                            operand2: Phrase<number> | ParticleReference | number
                        ) {
                            super(constants.CalculationPhrase, operand1, operator, operand2);
                        }
                    }
                    export namespace operator {
                        export namespace LogicalOperator {
                            export const AND = "AND";
                            export const OR = "OR";
                        }
                        export namespace CalculationOperator {
                            export const SUM = "AND";
                            export const SUB = "OR";
                            export const MUL = "MUL";
                            export const DIV = "DIV";
                        }
                        export namespace ComparisonOperator {
                            export const EQUAL = "EQUAL";
                            export const NOTEQUAL = "NOTEQUAL";
                            export const BIGGERTHAN = "BIGGERTHAN";
                            export const SMALLERTHAN = "SMALLERTHAN";
                            export const BIGEQUAL = "BIGEQUAL";
                            export const SMALLEQUAL = "SMALLEQUAL";
                        }
                        export namespace TemplateOperator {
                            export const COVER = "COVER";
                        }
                    }
                }
                export interface Reaction {
                    (particle: Particle, euglena: Euglena,parameters?:Object): void;
                }
            }
            export namespace constants {
                export const OutSide = "OutSide";
                export const EuglenaInfo = "cessnalib.being.alive.EuglenaInfo";
                export namespace particles {
                    export const EuglenaName = "EuglenaName";
                }
            }
            export abstract class Organelle<InitialProperties> implements Named, interaction.CanReceiveParticle {
                constructor(
                    public name: string,
                    public impactGenerator?: interaction.ImpactGenerator,
                    public nucleus?: interaction.CanReceiveParticle,
                    public saveParticle?:(particle:Particle)=>void,
                    public initialProperties?: InitialProperties) { }
                public abstract receiveParticle(particle: Particle): void;
            }
            export class EuglenaInfo implements Named {
                constructor(public name: string, public url: string, public port: string) { }
            }
            export class GarbageCollector {
                //private timeout = 3600000;
                private timeout = 1000;
                private chromosome:Gene[] = [];
                constructor(chromosome:Gene[]){
                    this.chromosome = chromosome;
                }
                public start():void{
                    let chromosome = this.chromosome;
                    setInterval(()=>{
                        let toBeRemoved:string[] = [];  
                        for(let a of chromosome){
                            if(a.expiretime && cessnalib.sys.type.StaticTools.Time.biggerThan(
                                cessnalib.sys.type.StaticTools.Time.now(),
                                a.expiretime
                            )){
                                toBeRemoved.push(a.name);
                            }
                        }
                        for(let b of toBeRemoved){
                            for (var index = 0; index < chromosome.length; index++) {
                                var element = chromosome[index];
                                if(element.name === b){
                                    chromosome.splice(index,1);
                                    break;
                                }
                            }
                        }
                    },this.timeout)
                }
            }
            export class Euglena implements interaction.CanReceiveParticle {
                public static instance: Euglena = null;
                private garbageCollector:GarbageCollector = null;
                private executor: cessnalib.being.alive.dna.condition.Executor = null;
                constructor(public chromosome: dna.Gene[], private particles: any, private organelles: any, private impactGenerator: interaction.ImpactGenerator) {
                    this.executor = new cessnalib.being.alive.dna.condition.Executor(this.particles);
                    this.garbageCollector = new GarbageCollector(this.chromosome);
                    for (let organelleName in organelles) {
                        this.organelles[organelleName].nucleus = this;
                        this.organelles[organelleName].saveParticle = this.saveParticle;
                    }
                    this.garbageCollector.start();
                }
                public static generateInstance(chromosome: dna.Gene[], particles: any, organelles: Organelle<any>[], impactGenerator: interaction.ImpactGenerator) {
                    if (!Euglena.instance) {
                        Euglena.instance = new Euglena(chromosome, particles, organelles, impactGenerator);
                    }
                    return Euglena.instance;
                }
                public addGene(gene:Gene):void{
                    this.chromosome.push(gene);
                }
                public receiveParticle(particle: Particle) {
                    console.log("received Particle: " + particle.name);
                    for (var i = 0; i < Euglena.instance.chromosome.length; i++) {
                        if (sys.type.StaticTools.Array.contains(Euglena.instance.chromosome[i].triggers, particle.name) &&
                            (Euglena.instance.chromosome[i].condition ? Euglena.instance.executor.execute(Euglena.instance.chromosome[i].condition,particle) : true)) {
                            var reaction = Euglena.instance.chromosome[i].reaction;
                            var parameters = Euglena.instance.chromosome[i].parameters;
                            var particles = Euglena.instance.particles;
                            var organelles = Euglena.instance.organelles;
                            var receiveParticle = Euglena.instance.receiveParticle;
                            console.log("triggering gene " + Euglena.instance.chromosome[i].name);
                            reaction(particle, Euglena.instance,parameters);
                        }
                    }
                }
                public getParticle(particleName: string): being.Particle {
                    return Euglena.instance.particles[particleName];
                }
                public saveParticle(particle: being.Particle) {
                    Euglena.instance.particles[particle.name] = particle;
                    Euglena.instance.receiveParticle(particle);
                }
                public getOrganelle(organelleName: string): being.alive.Organelle<any> {
                    return Euglena.instance.organelles[organelleName];
                }
            }
        }
    }
    export namespace reference {
        export namespace sys {
            export namespace type {
                export const Exception = new cessnalib.sys.type.Exception("Exception", null);
            }
        }
    }
}

