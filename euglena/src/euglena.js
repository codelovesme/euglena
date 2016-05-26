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
var euglena;
(function (euglena) {
    euglena.JavascriptDate = Date;
    var js;
    (function (js) {
        class Class {
            static extend(subInstance, parentInstance) {
                for (let prop in parentInstance) {
                    if (!subInstance[prop])
                        subInstance[prop] = parentInstance[prop];
                }
                return subInstance;
            }
            static clone(obj, deep) {
                var sub = {};
                for (var prop in obj) {
                    sub[prop] = (deep && ('object' === typeof obj[prop])) ? Class.clone(obj[prop], true) : obj[prop];
                }
                return sub;
            }
            static merge(primaryInstance, secondaryInstance) {
                for (var prop in secondaryInstance) {
                    if (!primaryInstance[prop])
                        primaryInstance[prop] = secondaryInstance[prop];
                }
                return primaryInstance;
            }
            static classify(emptyInstance, valueObj) {
                for (var prop in emptyInstance) {
                    if (("function" !== typeof emptyInstance[prop]) && !emptyInstance[prop])
                        emptyInstance[prop] = valueObj[prop];
                }
                return emptyInstance;
            }
            static valuefy(instance) {
                var valueObj = {};
                var propToValuefy = null;
                for (var prop in instance) {
                    if ("function" !== typeof instance[prop]) {
                        valueObj[prop] = instance[prop];
                    }
                    else if (typeof prop === "object") {
                        valueObj[prop] = Class.valuefy(instance[prop]);
                    }
                    else if ((prop.substring(0, 3) === "get") && (propToValuefy = prop.substring(3, prop.length))) {
                        valueObj[propToValuefy[0].toLowerCase() + propToValuefy.substring(1, propToValuefy.length)] = instance[prop]();
                    }
                }
                return valueObj;
            }
            static isPrimaryType(obj) {
                return typeof obj === "string" ||
                    typeof obj === "number" ||
                    typeof obj === "boolean";
            }
            static instanceOf(referenceObject, obj) {
                if (Class.isPrimaryType(referenceObject))
                    return typeof referenceObject === typeof obj;
                for (var prop in referenceObject) {
                    if (obj[prop] === undefined)
                        return false;
                }
                return true;
            }
        }
        js.Class = Class;
    })(js = euglena.js || (euglena.js = {}));
    var injection;
    (function (injection) {
        class StaticTools {
            static valueOfValueChooser(valueChooser) {
                return valueChooser.values[valueChooser.index];
            }
        }
        injection.StaticTools = StaticTools;
        class Configuration {
        }
        injection.Configuration = Configuration;
        class ValueChooser {
            constructor() {
                this.index = 0;
            }
        }
        injection.ValueChooser = ValueChooser;
        class ObjectChooser {
        }
        injection.ObjectChooser = ObjectChooser;
    })(injection = euglena.injection || (euglena.injection = {}));
    var sys;
    (function (sys) {
        var type;
        (function (type) {
            class Exception {
                constructor(message, innerException) {
                    this.message = message;
                    this.innerException = innerException;
                }
            }
            type.Exception = Exception;
            class Map {
                constructor(condition) {
                    this.condition = condition;
                    this.keys = new Array();
                    this.values = new Array();
                }
                add(key, value) {
                    if (!this.get(key)) {
                        this.keys.push(key);
                        this.values.push(value);
                    }
                    else {
                        throw "KeyAlreadyExistException";
                    }
                }
                keyExists(key) {
                    return this.indexOf(key) >= 0;
                }
                set(key, value) {
                    var index = this.keys.indexOf(key);
                    if (index >= 0) {
                        this.values[index] = value;
                    }
                    else {
                        this.keys.push(key);
                        this.values.push(value);
                    }
                }
                remove(key) {
                    var index = this.keys.indexOf(key);
                    this.keys.slice(index, 1);
                    this.values.slice(index, 1);
                }
                indexOf(key) {
                    let index = -1;
                    if (this.condition) {
                        this.keys.forEach((k) => {
                            if (this.condition(k, key)) {
                                index = this.keys.indexOf(k);
                            }
                        });
                    }
                    else {
                        index = this.keys.indexOf(key);
                    }
                    return index;
                }
                get(key) {
                    return this.values[this.indexOf(key)];
                }
                getKeys() {
                    return this.keys;
                }
                getValues() {
                    return this.values;
                }
            }
            type.Map = Map;
            class Time {
                constructor(date, clock) {
                    this.date = date;
                    this.clock = clock;
                    this.className = "euglena.sys.type.Time";
                }
            }
            type.Time = Time;
            class Date {
                constructor(year, month, day) {
                    this.year = year;
                    this.month = month;
                    this.day = day;
                    this.className = "euglena.sys.type.Date";
                }
            }
            type.Date = Date;
            class Clock {
                constructor(hour, minute, second) {
                    this.hour = hour;
                    this.minute = minute;
                    this.second = second;
                    this.className = "euglena.sys.type.Clock";
                }
            }
            type.Clock = Clock;
            var StaticTools;
            (function (StaticTools) {
                class Exception {
                    static isNotException(t) {
                        return !euglena.js.Class.instanceOf(euglena.reference.sys.type.Exception, t);
                    }
                }
                StaticTools.Exception = Exception;
                class UUID {
                    static generate() {
                        function word() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        return word() + word() + '-' + word() + '-' + word() + '-' +
                            word() + '-' + word() + word() + word();
                    }
                }
                StaticTools.UUID = UUID;
                class Time {
                    static biggerThan(time1, time2) {
                        return Date.biggerThan(time1.date, time2.date) ? true :
                            Date.biggerThan(time1.date, time2.date) ? false :
                                Clock.biggerThan(time1.clock, time2.clock);
                    }
                    static equals(time1, time2) {
                        return Date.equals(time1.date, time2.date) && Clock.equals(time1.clock, time2.clock);
                    }
                    static now() {
                        let newDate = new euglena.JavascriptDate();
                        return new sys.type.Time(new sys.type.Date(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, newDate.getUTCDate()), new sys.type.Clock(newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds()));
                    }
                    static addMiliseconds(time, miliseconds) {
                        return Time.fromJavascriptDate(new euglena.JavascriptDate(Time.toJavascriptDate(time).getTime() + miliseconds));
                    }
                    static DayToMiliseconds(minute) {
                        return minute * 86400000;
                    }
                    static HourToMiliseconds(minute) {
                        return minute * 3600000;
                    }
                    static MinuteToMiliseconds(minute) {
                        return minute * 60000;
                    }
                    static SecondToMiliseconds(minute) {
                        return minute * 1000;
                    }
                    static fromJavascriptDate(date) {
                        return new sys.type.Time(new sys.type.Date(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()), new sys.type.Clock(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
                    }
                    static toJavascriptDate(time) {
                        let date = new euglena.JavascriptDate();
                        date.setUTCFullYear(time.date.year);
                        date.setUTCMonth(time.date.month - 1);
                        date.setUTCDate(time.date.day);
                        date.setUTCHours(time.clock.hour);
                        date.setUTCMinutes(time.clock.minute);
                        date.setUTCSeconds(time.clock.second);
                        return date;
                    }
                }
                StaticTools.Time = Time;
                class Date {
                    static equals(date1, date2) {
                        return date1.year == date2.year &&
                            date1.month == date2.month &&
                            date1.day == date2.day;
                    }
                    static biggerThan(date1, date2) {
                        return date1.year > date2.year ? true : date1.year < date2.year ? false :
                            date1.month > date2.month ? true : date1.month < date2.month ? false :
                                date1.day > date2.day;
                    }
                }
                StaticTools.Date = Date;
                class Clock {
                    static equals(clock1, clock2) {
                        return clock1.hour == clock2.hour &&
                            clock1.minute == clock2.minute &&
                            clock1.second == clock2.second;
                    }
                    static biggerThan(clock1, clock2) {
                        return clock1.hour > clock2.hour ? true : clock1.hour < clock2.hour ? false :
                            clock1.minute > clock2.minute ? true : clock1.minute < clock2.minute ? false :
                                clock1.second > clock2.second;
                    }
                }
                StaticTools.Clock = Clock;
                class Array {
                    static contains(array, t, compare) {
                        return Array.indexOf(array, t, compare) >= 0;
                    }
                    static indexOf(array, t, compare) {
                        if (compare) {
                            for (var i = 0; i < array.length; i++) {
                                if (compare(array[i], t)) {
                                    return i;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === t) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                }
                StaticTools.Array = Array;
            })(StaticTools = type.StaticTools || (type.StaticTools = {}));
        })(type = sys.type || (sys.type = {}));
    })(sys = euglena.sys || (euglena.sys = {}));
    var being;
    (function (being) {
        class Particle {
            constructor(name, content, of) {
                this.name = name;
                this.content = content;
                this.of = of;
            }
        }
        being.Particle = Particle;
        var interaction;
        (function (interaction) {
            class Impact {
                constructor(particle, token) {
                    this.particle = particle;
                    this.token = token;
                }
            }
            interaction.Impact = Impact;
            var constants;
            (function (constants) {
                constants.ReceivedParticleReference = "ReceivedParticleReference";
            })(constants = interaction.constants || (interaction.constants = {}));
        })(interaction = being.interaction || (being.interaction = {}));
        var alive;
        (function (alive) {
            var Particle = euglena.being.Particle;
            var dna;
            (function (dna) {
                class Gene {
                    constructor(name, triggers, reaction, expiretime) {
                        this.name = name;
                        this.triggers = triggers;
                        this.reaction = reaction;
                        this.expiretime = expiretime;
                    }
                }
                dna.Gene = Gene;
                class ParticleReference extends Particle {
                    constructor(name, of) {
                        super(name, null, of);
                    }
                }
                dna.ParticleReference = ParticleReference;
            })(dna = alive.dna || (alive.dna = {}));
            var constants;
            (function (constants) {
                constants.OutSide = "OutSide";
                constants.EuglenaInfo = "EuglenaInfo";
                var particles;
                (function (particles) {
                    particles.EuglenaName = "EuglenaName";
                })(particles = constants.particles || (constants.particles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            class Organelle {
                constructor(name, className, send, initialProperties) {
                    this.name = name;
                    this.className = className;
                    this.send = send;
                    this.initialProperties = initialProperties;
                }
            }
            alive.Organelle = Organelle;
            class EuglenaInfo {
                constructor(name, url, port) {
                    this.name = name;
                    this.url = url;
                    this.port = port;
                }
            }
            alive.EuglenaInfo = EuglenaInfo;
            class GarbageCollector {
                constructor(chromosome) {
                    //private timeout = 3600000;
                    this.timeout = 1000;
                    this.chromosome = [];
                    this.chromosome = chromosome;
                }
                start() {
                    let chromosome = this.chromosome;
                    setInterval(() => {
                        let toBeRemoved = [];
                        for (let a of chromosome) {
                            if (a.expiretime && euglena.sys.type.StaticTools.Time.biggerThan(euglena.sys.type.StaticTools.Time.now(), a.expiretime)) {
                                toBeRemoved.push(a.name);
                            }
                        }
                        for (let b of toBeRemoved) {
                            for (var index = 0; index < chromosome.length; index++) {
                                var element = chromosome[index];
                                if (element.name === b) {
                                    chromosome.splice(index, 1);
                                    break;
                                }
                            }
                        }
                    }, this.timeout);
                }
            }
            alive.GarbageCollector = GarbageCollector;
            class Body {
                constructor(particles, receive) {
                    this.particles = particles;
                    this.receive = receive;
                    this.garbageCollector = null;
                    this.organelles = {};
                }
                static generateInstance(particles, receive) {
                    if (!Body.instance) {
                        Body.instance = new Body(particles, receive);
                    }
                    return Body.instance;
                }
                transmit(organelleName, particle, response) {
                    console.log("received Particle: " + particle.name + " sent to: " + organelleName);
                    let organelle = Body.instance.organelles[organelleName];
                    organelle.receive(particle, (resp) => {
                        console.log("Response :" + resp.name + " from: " + organelleName + " for: " + particle.name);
                        response ? response(resp) : false;
                    });
                }
                getParticle(particleReference) {
                    let index = Body.instance.indexOfParticle(particleReference);
                    return index >= 0 ? Body.instance.particles[index] : null;
                }
                indexOfParticle(particleReference) {
                    for (let i = 0; i < Body.instance.particles.length; i++) {
                        if (Body.instance.particles[i].name === particleReference.name && Body.instance.particles[i].of === particleReference.of) {
                            return i;
                        }
                    }
                    return -1;
                }
                saveParticle(particle) {
                    let index = Body.instance.indexOfParticle(particle);
                    if (index >= 0) {
                        Body.instance.particles[index] = particle;
                    }
                    else {
                        Body.instance.particles.push(particle);
                    }
                }
                getOrganelle(organelleName) {
                    return Body.instance.organelles[organelleName];
                }
                setOrganelle(organelle) {
                    organelle.send = this.receive;
                    Body.instance.organelles[organelle.name] = organelle;
                }
            }
            Body.instance = null;
            alive.Body = Body;
        })(alive = being.alive || (being.alive = {}));
    })(being = euglena.being || (euglena.being = {}));
    var reference;
    (function (reference) {
        var sys;
        (function (sys) {
            var type;
            (function (type) {
                type.Exception = new euglena.sys.type.Exception("Exception", null);
            })(type = sys.type || (sys.type = {}));
        })(sys = reference.sys || (reference.sys = {}));
    })(reference = euglena.reference || (euglena.reference = {}));
})(euglena = exports.euglena || (exports.euglena = {}));
//# sourceMappingURL=euglena.js.map