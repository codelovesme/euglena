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
            static doesCover(obj1, obj2) {
                for (let key in obj2) {
                    if (obj1[key] === undefined)
                        return false;
                    if (Class.isPrimaryType(obj2[key])) {
                        if (obj1[key] !== obj2[key])
                            return false;
                    }
                    else {
                        if (!Class.doesCover(obj1[key], obj2[key]))
                            return false;
                    }
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
            var reference;
            (function (reference) {
                reference.Exception = new euglena.sys.type.Exception("Exception", null);
            })(reference = type.reference || (type.reference = {}));
            var StaticTools;
            (function (StaticTools) {
                class Exception {
                    static isNotException(t) {
                        return !euglena.js.Class.instanceOf(reference.Exception, t);
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
                    static combine(array1, array2) {
                        let a = array1.concat(array2);
                        for (var i = 0; i < a.length; ++i) {
                            for (var j = i + 1; j < a.length; ++j) {
                                if (a[i] === a[j])
                                    a.splice(j--, 1);
                            }
                        }
                        return a;
                    }
                    static equals(array1, array2, compare) {
                        if (!array1 && !array2)
                            return true;
                        if (!array1 || !array2)
                            return false;
                        if (array1.length !== array2.length)
                            return false;
                        for (let i = 0; i < array1.length; i++) {
                            if (array1[i] !== array2[i])
                                return false;
                        }
                        return true;
                    }
                    static contains(array, t, compare) {
                        return Array.indexOf(array, t, compare) >= 0;
                    }
                    static containsArray(master, slave, compare) {
                        for (let s of slave) {
                            if (!Array.contains(master, s, compare))
                                return false;
                        }
                        return true;
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
            constructor(name, content, of, primaryKeys) {
                this.name = name;
                this.content = content;
                this.of = of;
                this.primaryKeys = primaryKeys;
            }
        }
        being.Particle = Particle;
        class StaticTools {
        }
        StaticTools.Particle = {
            covers: (p1, p2) => {
            }
        };
        being.StaticTools = StaticTools;
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
                class ParticleReference extends Particle {
                    constructor(name, of, primaryKeys, content) {
                        super(name, content, of, primaryKeys);
                    }
                }
                dna.ParticleReference = ParticleReference;
                class StaticTools {
                }
                StaticTools.ParticleReference = {
                    equals: (ref1, ref2) => {
                        return ref1.name === ref2.name &&
                            ref1.of === ref2.of &&
                            euglena.sys.type.StaticTools.Array.equals(ref1.primaryKeys, ref2.primaryKeys);
                    }
                };
                dna.StaticTools = StaticTools;
                class Gene {
                    constructor(name, triggers, // particle prop - value match
                        reaction, override, expiretime) {
                        this.name = name;
                        this.triggers = triggers;
                        this.reaction = reaction;
                        this.override = override;
                        this.expiretime = expiretime;
                    }
                }
                dna.Gene = Gene;
                class GarbageCollector {
                    constructor(chromosome) {
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
                dna.GarbageCollector = GarbageCollector;
            })(dna = alive.dna || (alive.dna = {}));
            var particles;
            (function (particles) {
                class Sap extends Particle {
                    constructor(content, of) {
                        super(constants.particles.Sap, content, of);
                    }
                }
                particles.Sap = Sap;
            })(particles = alive.particles || (alive.particles = {}));
            var constants;
            (function (constants) {
                constants.OutSide = "OutSide";
                var particles;
                (function (particles) {
                    particles.Sap = "Sap";
                })(particles = constants.particles || (constants.particles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            class Organelle {
                constructor(name, className, send) {
                    this.name = name;
                    this.className = className;
                    this.send = send;
                    this.actions = new sys.type.Map();
                    let this_ = this;
                    this.addAction(constants.particles.Sap, (particle) => {
                        this_._initialProperties = particle.content;
                        this_.onGettingAlive();
                    });
                }
                get initialProperties() {
                    return this._initialProperties;
                }
                receive(particle) {
                    let action = this.actions.get(particle.name);
                    if (action) {
                        action(particle);
                    }
                }
                addAction(particleName, action) {
                    this.actions.add(particleName, action);
                }
            }
            alive.Organelle = Organelle;
            class Body {
                constructor(particles, organelles, chromosome) {
                    this.particles = particles;
                    this.chromosome = chromosome;
                    this.organelles = null;
                    if (Body.instance) {
                        throw "There exists already a Body instance.";
                    }
                    this.organelles = {};
                    for (let organelle of organelles) {
                        organelle.send = Body.receive;
                        this.organelles[organelle.name] = organelle;
                    }
                    Body.instance = this;
                }
                static receive(particle) {
                    console.log("Organelle Nucleus says received particle " + particle.name);
                    //find which genes are matched with properties of the particle 
                    let triggerableReactions = new Array();
                    for (var i = 0; i < Body.instance.chromosome.length; i++) {
                        let triggers = Body.instance.chromosome[i].triggers;
                        if (euglena.js.Class.doesCover(particle, triggers)) {
                            var reaction = Body.instance.chromosome[i].reaction;
                            triggerableReactions.push({ index: i, triggers: Object.keys(triggers), reaction: reaction });
                        }
                    }
                    //get rid of overrided reactions
                    let reactions = Array();
                    for (let tr of triggerableReactions) {
                        let doTrigger = true;
                        //Check if the tr is contained by others, if true
                        for (let tr2 of triggerableReactions) {
                            //if it is the same object, do nothing 
                            if (tr.index === tr2.index)
                                continue;
                            //then if triggers of tr2 does not contain triggers of tr, do nothing
                            if (!euglena.sys.type.StaticTools.Array.containsArray(tr2.triggers, tr.triggers))
                                continue;
                            //then check if tr2 overrides tr
                            doTrigger = !(Body.instance.chromosome[tr2.index].override === Body.instance.chromosome[tr.index].name);
                        }
                        if (doTrigger) {
                            reactions.push(tr.reaction);
                        }
                    }
                    //trigger collected reactions
                    for (let reaction of reactions) {
                        try {
                            reaction(particle, Body.instance);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
                transmit(organelleName, particle) {
                    console.log("received Particle: " + particle.name + " sent to: " + organelleName);
                    let organelle = Body.instance.organelles[organelleName];
                    organelle.receive(particle);
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
                getParticle(particleReference) {
                    let index = Body.instance.indexOfParticle(particleReference);
                    return index >= 0 ? Body.instance.particles[index] : null;
                }
                indexOfParticle(particleReference) {
                    for (let i = 0; i < Body.instance.particles.length; i++) {
                        if (dna.StaticTools.ParticleReference.equals(Body.instance.particles[i], particleReference)) {
                            return i;
                        }
                    }
                    return -1;
                }
            }
            Body.instance = null;
            alive.Body = Body;
        })(alive = being.alive || (being.alive = {}));
    })(being = euglena.being || (euglena.being = {}));
})(euglena = exports.euglena || (exports.euglena = {}));
//# sourceMappingURL=index.js.map