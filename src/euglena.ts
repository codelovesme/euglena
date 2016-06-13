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
export module euglena {
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
                public keyExists(key: K): boolean {
                    return this.indexOf(key) >= 0;
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
                public indexOf(key: K): number {
                    let index = -1;
                    if (this.condition) {
                        this.keys.forEach((k: K) => {
                            if (this.condition(k, key)) {
                                index = this.keys.indexOf(k);
                            }
                        });
                    } else {
                        index = this.keys.indexOf(key);
                    }
                    return index;
                }
                public get(key: K): V {
                    return this.values[this.indexOf(key)];
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
                className: string = "euglena.sys.type.Time";
                constructor(public date: Date, public clock: Clock) { }
            }
            export class Date implements Classifiable {
                className: string = "euglena.sys.type.Date";
                constructor(public year: number, public month: number, public day: number) { }
            }
            export class Clock implements Classifiable {
                className: string = "euglena.sys.type.Clock";
                constructor(public hour: number, public minute: number, public second: number) { }
            }
            export namespace StaticTools {
                export class Exception {
                    public static isNotException<T>(t: T | Exception): t is T {
                        return !euglena.js.Class.instanceOf(euglena.reference.sys.type.Exception, t);
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
                    public static biggerThan(time1: sys.type.Time, time2: sys.type.Time): boolean {
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
                    public static addMiliseconds(time: sys.type.Time, miliseconds: number): sys.type.Time {
                        return Time.fromJavascriptDate(new JavascriptDate(
                            Time.toJavascriptDate(time).getTime() + miliseconds));
                    }
                    public static DayToMiliseconds(minute: number): number {
                        return minute * 86400000;
                    }
                    public static HourToMiliseconds(minute: number): number {
                        return minute * 3600000;
                    }
                    public static MinuteToMiliseconds(minute: number): number {
                        return minute * 60000;
                    }
                    public static SecondToMiliseconds(minute: number): number {
                        return minute * 1000;
                    }
                    public static fromJavascriptDate(date: any): sys.type.Time {
                        return new sys.type.Time(new sys.type.Date(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()),
                            new sys.type.Clock(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
                    }
                    public static toJavascriptDate(time: sys.type.Time): any {
                        let date = new JavascriptDate();
                        date.setUTCFullYear(time.date.year);
                        date.setUTCMonth(time.date.month - 1);
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
                    public static biggerThan(date1: sys.type.Date, date2: sys.type.Date): boolean {
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
                    public static biggerThan(clock1: sys.type.Clock, clock2: sys.type.Clock): boolean {
                        return clock1.hour > clock2.hour ? true : clock1.hour < clock2.hour ? false :
                            clock1.minute > clock2.minute ? true : clock1.minute < clock2.minute ? false :
                                clock1.second > clock2.second;
                    }
                }
                export class Array {
                    public static combine<T>(array1:T[],array2:T[]):T[]{
                        let a = array1.concat(array2);
                        for(var i=0; i<a.length; ++i) {
                            for(var j=i+1; j<a.length; ++j) {
                                if(a[i] === a[j])
                                    a.splice(j--, 1);
                            }
                        }
                        return a;
                    }
                    public static equals<T>(array1: T[], array2: T[], compare?: (t1: T, t2: T) => boolean): boolean {
                        if(!array1 && !array2) return true;
                        if(!array1 || !array2) return false;
                        if (array1.length !== array2.length) return false;
                        for (let i = 0; i < array1.length; i++) {
                            if (array1[i] !== array2[i]) return false;
                        }
                        return true;
                    }
                    public static contains<T>(array: T[], t: T, compare?: (arrayItem: T, t: T) => boolean): boolean {
                        return Array.indexOf(array, t, compare) >= 0;
                    }
                    public static containsArray<T>(master: T[], slave: T[], compare?: (t1: T, t2: T) => boolean): boolean { 
                        for (let s of slave) {
                            if (!Array.contains(master, s, compare)) return false;
                        }
                        return true;
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
        import Classifiable = euglena.sys.type.Classifiable;
        import Named = euglena.sys.type.Named;
        export class Particle {
            constructor(
                public name: string,
                public content: any,
                public of: string,
                public primaryKeys?: Array<string>) { }
        }
        export namespace interaction {
            export interface CanReceiveParticle {
                receive: Receive;
            }
            export interface Receive {
                (particle: Particle, response: interaction.Response): void;
            }
            export class Impact {
                constructor(public particle: Particle, public token: string) { }
            }
            export namespace constants {
                export const ReceivedParticleReference = "ReceivedParticleReference";
            }
            export interface Response {
                (particle: Particle): void;
            }
        }
        export namespace alive {
            import Classifiable = euglena.sys.type.Classifiable;
            import Particle = euglena.being.Particle;
            import Impact = euglena.being.interaction.Impact;
            export namespace dna {
                export class ParticleReference extends Particle {
                    constructor(name: string, of: string,primaryKeys?:string[],content?:any) {
                        super(name, content, of,primaryKeys);
                    }
                }
                export class StaticTools {
                    public static ParticleReference = {
                        equals: (ref1: ParticleReference, ref2: ParticleReference) => {
                            return ref1.name === ref2.name &&
                                ref1.of === ref2.of &&
                                euglena.sys.type.StaticTools.Array.equals(ref1.primaryKeys, ref2.primaryKeys);
                        }
                    }
                }
            }
            export namespace constants {
                export const OutSide = "OutSide";
            }
            export abstract class Organelle<InitialProperties> implements Named, Classifiable, interaction.CanReceiveParticle {
                constructor(
                    public name: string,
                    public className: string,
                    public send?: interaction.Receive,
                    public initialProperties?: InitialProperties) { }
                public abstract receive(particle: Particle, response: interaction.Response): void;
            }

            export class Body {
                public static instance: Body = null;
                private organelles: any;
                constructor(private particles: Particle[]) {
                    this.organelles = {};
                }
                public static generateInstance(particles: any) {
                    if (!Body.instance) {
                        Body.instance = new Body(particles);
                    }
                    return Body.instance;
                }
                public transmit(organelleName: string, particle: Particle, response?: interaction.Response) {
                    console.log("received Particle: " + particle.name + " sent to: " + organelleName);
                    let organelle: Organelle<any> = Body.instance.organelles[organelleName] as Organelle<any>;
                    organelle.receive(particle, (resp: Particle) => {
                        console.log("Response :" + resp.name + " from: " + organelleName + " for: " + particle.name);
                        response ? response(resp) : false;
                    });
                }
                public getParticle(particleReference: dna.ParticleReference): being.Particle {
                    let index = Body.instance.indexOfParticle(particleReference);
                    return index >= 0 ? Body.instance.particles[index] : null;
                }
                private indexOfParticle(particleReference: dna.ParticleReference): number {
                    for (let i = 0; i < Body.instance.particles.length; i++) {
                        if (dna.StaticTools.ParticleReference.equals(Body.instance.particles[i],particleReference)) {
                            return i;
                        }
                    }
                    return -1;
                }
                public saveParticle(particle: being.Particle) {
                    let index = Body.instance.indexOfParticle(particle);
                    if (index >= 0) {
                        Body.instance.particles[index] = particle;
                    } else {
                        Body.instance.particles.push(particle);
                    }
                }
                public getOrganelle(organelleName: string): being.alive.Organelle<any> {
                    return Body.instance.organelles[organelleName];
                }
                public setOrganelle(organelle: euglena.being.alive.Organelle<{}>): void {
                    Body.instance.organelles[organelle.name] = organelle;
                }
            }
        }
    }
    export namespace reference {
        export namespace sys {
            export namespace type {
                export const Exception = new euglena.sys.type.Exception("Exception", null);
            }
        }
    }
}
