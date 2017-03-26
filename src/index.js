"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var sift = require("sift");
exports.JavascriptDate = Date;
exports.JavascriptObject = Object;
var euglena;
(function (euglena) {
    var js;
    (function (js) {
        var Class = (function () {
            function Class() {
            }
            Class.toDotNotation = function (obj) {
                var obj_ = obj;
                //check if obj is object or not
                if (!obj && typeof obj !== "object")
                    return obj;
                //if the obj terminal then return itself
                var ret_ = {};
                for (var key in obj) {
                    if (!Class.isPrimitiveType(obj_[key])) {
                        var r = Class.toDotNotation(obj_[key]);
                        for (var k in r) {
                            ret_[key + "." + k] = r[k];
                        }
                    }
                    else {
                        ret_[key] = obj_[key];
                    }
                }
                return ret_;
            };
            Class.clean = function (obj) {
                delete obj.__proto__;
            };
            Class.extend = function (subInstance, parentInstance) {
                for (var prop in parentInstance) {
                    if (!subInstance[prop])
                        subInstance[prop] = parentInstance[prop];
                }
                return subInstance;
            };
            Class.clone = function (obj, deep) {
                var sub = {};
                for (var prop in obj) {
                    sub[prop] = (deep && ('object' === typeof obj[prop])) ? Class.clone(obj[prop], true) : obj[prop];
                }
                return sub;
            };
            Class.merge = function (primaryInstance, secondaryInstance) {
                for (var prop in secondaryInstance) {
                    if (!primaryInstance[prop])
                        primaryInstance[prop] = secondaryInstance[prop];
                }
                return primaryInstance;
            };
            Class.classify = function (emptyInstance, valueObj) {
                for (var prop in emptyInstance) {
                    if (("function" !== typeof emptyInstance[prop]) && !emptyInstance[prop])
                        emptyInstance[prop] = valueObj[prop];
                }
                return emptyInstance;
            };
            Class.valuefy = function (instance) {
                var valueObj = {};
                var propToValuefy = null;
                for (var prop in instance) {
                    if ("function" !== typeof instance[prop]) {
                        valueObj[prop] = instance[prop];
                    }
                    else if (typeof instance[prop] === "object") {
                        valueObj[prop] = Class.valuefy(instance[prop]);
                    }
                    else if ((prop.substring(0, 3) === "get") && (propToValuefy = prop.substring(3, prop.length))) {
                        valueObj[propToValuefy[0].toLowerCase() + propToValuefy.substring(1, propToValuefy.length)] = instance[prop]();
                    }
                }
                return valueObj;
            };
            Class.isPrimitiveType = function (obj) {
                return typeof obj === "string" ||
                    typeof obj === "number" ||
                    typeof obj === "boolean" ||
                    obj === undefined ||
                    obj === null ||
                    typeof obj === "symbol";
            };
            Class.instanceOf = function (referenceObject, obj) {
                if (obj === null || obj === undefined)
                    return false;
                if (Class.isPrimitiveType(referenceObject))
                    return typeof referenceObject === typeof obj;
                for (var prop in referenceObject) {
                    if (obj[prop] === undefined)
                        return false;
                }
                return true;
            };
            ///TODO must be upgraded
            Class.doesCover = function (obj1, obj2) {
                for (var key in obj2) {
                    if (obj2[key] === null || obj2[key] === undefined)
                        continue;
                    if (obj1[key] === undefined || obj1[key] === null)
                        return false;
                    if (Class.isPrimitiveType(obj2[key])) {
                        if (obj1[key] !== obj2[key])
                            return false;
                    }
                    else {
                        if (!Class.doesCover(obj1[key], obj2[key]))
                            return false;
                    }
                }
                return true;
            };
            Class.doesMongoCover = function (obj, query) {
                var array = sift(query, [obj]);
                return array instanceof Array && array.length > 0;
            };
            return Class;
        }());
        js.Class = Class;
    })(js = euglena.js || (euglena.js = {}));
    var injection;
    (function (injection) {
        var StaticTools = (function () {
            function StaticTools() {
            }
            StaticTools.valueOfValueChooser = function (valueChooser) {
                return valueChooser.values[valueChooser.index];
            };
            return StaticTools;
        }());
        injection.StaticTools = StaticTools;
        var Configuration = (function () {
            function Configuration() {
            }
            return Configuration;
        }());
        injection.Configuration = Configuration;
        var ValueChooser = (function () {
            function ValueChooser() {
                this.index = 0;
            }
            return ValueChooser;
        }());
        injection.ValueChooser = ValueChooser;
        var ObjectChooser = (function () {
            function ObjectChooser() {
            }
            return ObjectChooser;
        }());
        injection.ObjectChooser = ObjectChooser;
    })(injection = euglena.injection || (euglena.injection = {}));
    var sys;
    (function (sys) {
        var type;
        (function (type) {
            var Exception = (function () {
                function Exception(message, innerException) {
                    this.message = message;
                    this.innerException = innerException;
                }
                return Exception;
            }());
            type.Exception = Exception;
            var Map = (function () {
                function Map(compareKeys) {
                    this.compareKeys = compareKeys;
                    this.keys = new Array();
                    this.values = new Array();
                }
                Map.prototype.add = function (key, value) {
                    if (!this.get(key)) {
                        this.keys.push(key);
                        this.values.push(value);
                    }
                    else {
                        throw "KeyAlreadyExistException";
                    }
                };
                Map.prototype.keyExists = function (key) {
                    return this.indexOf(key) >= 0;
                };
                Map.prototype.set = function (key, value) {
                    var index = this.indexOf(key);
                    if (index >= 0) {
                        this.values[index] = value;
                    }
                    else {
                        this.keys.push(key);
                        this.values.push(value);
                    }
                };
                Map.prototype.remove = function (key) {
                    var index = this.indexOf(key);
                    if (index >= 0) {
                        this.keys.slice(index, 1);
                        this.values.slice(index, 1);
                    }
                };
                Map.prototype.indexOf = function (key) {
                    var _this = this;
                    var index = -1;
                    if (this.compareKeys) {
                        this.keys.forEach(function (k) {
                            if (_this.compareKeys(k, key)) {
                                index = _this.keys.indexOf(k);
                            }
                        });
                    }
                    else {
                        index = this.keys.indexOf(key);
                    }
                    return index;
                };
                Map.prototype.get = function (key) {
                    return this.values[this.indexOf(key)];
                };
                Map.prototype.getKeys = function () {
                    return this.keys;
                };
                Map.prototype.getValues = function () {
                    return this.values;
                };
                return Map;
            }());
            type.Map = Map;
            var TimeSpan = (function () {
                function TimeSpan(days, hours, minutes, seconds, miliseconds) {
                    this.days = days;
                    this.hours = hours;
                    this.minutes = minutes;
                    this.seconds = seconds;
                    this.miliseconds = miliseconds;
                    this.className = "euglena.sys.type.TimeSpan";
                }
                return TimeSpan;
            }());
            type.TimeSpan = TimeSpan;
            var Time = (function () {
                function Time(date, clock) {
                    this.date = date;
                    this.clock = clock;
                    this.className = "euglena.sys.type.Time";
                }
                return Time;
            }());
            type.Time = Time;
            var Date = (function () {
                function Date(year, month, day) {
                    this.year = year;
                    this.month = month;
                    this.day = day;
                    this.className = "euglena.sys.type.Date";
                }
                return Date;
            }());
            type.Date = Date;
            var Clock = (function () {
                function Clock(hour, minute, second) {
                    this.hour = hour;
                    this.minute = minute;
                    this.second = second;
                    this.className = "euglena.sys.type.Clock";
                }
                return Clock;
            }());
            type.Clock = Clock;
            var reference;
            (function (reference) {
                reference.Exception = new euglena.sys.type.Exception("Exception", null);
            })(reference = type.reference || (type.reference = {}));
            var StaticTools;
            (function (StaticTools) {
                var Object = (function () {
                    function Object() {
                    }
                    Object.equals = function (obj1, obj2, deep) {
                        var obj1keys = exports.JavascriptObject.keys(obj1);
                        var obj2keys = exports.JavascriptObject.keys(obj2);
                        if (!Array.equals(obj1keys, obj2keys))
                            return false;
                        if (obj1keys.length == 0)
                            return true;
                        if (deep) {
                            for (var _i = 0, obj1keys_1 = obj1keys; _i < obj1keys_1.length; _i++) {
                                var key = obj1keys_1[_i];
                                if (typeof obj1[key] == "object") {
                                    if (!Object.equals(obj1[key], obj2[key], deep))
                                        return false;
                                }
                                else {
                                    if (obj1[key] != obj2[key])
                                        return false;
                                }
                            }
                        }
                        else {
                            for (var _a = 0, obj1keys_2 = obj1keys; _a < obj1keys_2.length; _a++) {
                                var key = obj1keys_2[_a];
                                if (obj1[key] != obj2[key])
                                    return false;
                            }
                        }
                        return true;
                    };
                    return Object;
                }());
                StaticTools.Object = Object;
                var Exception = (function () {
                    function Exception() {
                    }
                    Exception.isNotException = function (t) {
                        return !euglena.js.Class.instanceOf(reference.Exception, t);
                    };
                    return Exception;
                }());
                StaticTools.Exception = Exception;
                var UUID = (function () {
                    function UUID() {
                    }
                    UUID.generate = function () {
                        function word() {
                            return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                        }
                        return word() + word() + '-' + word() + '-' + word() + '-' +
                            word() + '-' + word() + word() + word();
                    };
                    return UUID;
                }());
                StaticTools.UUID = UUID;
                var TimeSpan = (function () {
                    function TimeSpan() {
                    }
                    TimeSpan.fromUnixTimestamp = function (timestamp) {
                        timestamp *= 1000;
                        var days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
                        timestamp -= days * (1000 * 60 * 60 * 24);
                        var hours = Math.floor(timestamp / (1000 * 60 * 60));
                        timestamp -= hours * (1000 * 60 * 60);
                        var minutes = Math.floor(timestamp / (1000 * 60));
                        timestamp -= minutes * (1000 * 60);
                        var seconds = Math.floor(timestamp / 1000);
                        timestamp -= seconds * 1000;
                        var miliseconds = timestamp;
                        return new sys.type.TimeSpan(days, hours, minutes, seconds, miliseconds);
                    };
                    TimeSpan.toUnixTimestamp = function (timespan) {
                        var fromdays = timespan.days * 60 * 60 * 24;
                        var fromhours = timespan.hours * 60 * 60;
                        var fromminutes = timespan.minutes * 60;
                        var fromseconds = timespan.seconds;
                        var frommiliseconds = timespan.miliseconds / 1000;
                        return fromdays + fromhours + fromminutes + fromseconds + frommiliseconds;
                    };
                    return TimeSpan;
                }());
                StaticTools.TimeSpan = TimeSpan;
                var Time = (function () {
                    function Time() {
                    }
                    Time.biggerThan = function (time1, time2) {
                        return Date.biggerThan(time1.date, time2.date) ? true :
                            Date.biggerThan(time1.date, time2.date) ? false :
                                Clock.biggerThan(time1.clock, time2.clock);
                    };
                    Time.equals = function (time1, time2) {
                        return Date.equals(time1.date, time2.date) && Clock.equals(time1.clock, time2.clock);
                    };
                    Time.now = function () {
                        var newDate = new exports.JavascriptDate();
                        return new sys.type.Time(new sys.type.Date(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, newDate.getUTCDate()), new sys.type.Clock(newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds()));
                    };
                    Time.addMiliseconds = function (time, miliseconds) {
                        return Time.fromJavascriptDate(new exports.JavascriptDate(Time.toJavascriptDate(time).getTime() + miliseconds));
                    };
                    Time.addMinutes = function (time, minutes) {
                        var miliseconds = minutes * 60000;
                        return Time.addMiliseconds(time, miliseconds);
                    };
                    Time.DayToMiliseconds = function (minute) {
                        return minute * 86400000;
                    };
                    Time.HourToMiliseconds = function (minute) {
                        return minute * 3600000;
                    };
                    Time.MinuteToMiliseconds = function (minute) {
                        return minute * 60000;
                    };
                    Time.SecondToMiliseconds = function (minute) {
                        return minute * 1000;
                    };
                    Time.fromJavascriptDate = function (date) {
                        return new sys.type.Time(new sys.type.Date(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()), new sys.type.Clock(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
                    };
                    Time.toJavascriptDate = function (time) {
                        var date = new exports.JavascriptDate();
                        date.setUTCFullYear(time.date.year);
                        date.setUTCMonth(time.date.month - 1);
                        date.setUTCDate(time.date.day);
                        date.setUTCHours(time.clock.hour);
                        date.setUTCMinutes(time.clock.minute);
                        date.setUTCSeconds(time.clock.second);
                        return date;
                    };
                    return Time;
                }());
                StaticTools.Time = Time;
                var Date = (function () {
                    function Date() {
                    }
                    Date.equals = function (date1, date2) {
                        return date1.year == date2.year &&
                            date1.month == date2.month &&
                            date1.day == date2.day;
                    };
                    Date.biggerThan = function (date1, date2) {
                        return date1.year > date2.year ? true : date1.year < date2.year ? false :
                            date1.month > date2.month ? true : date1.month < date2.month ? false :
                                date1.day > date2.day;
                    };
                    return Date;
                }());
                StaticTools.Date = Date;
                var Clock = (function () {
                    function Clock() {
                    }
                    Clock.equals = function (clock1, clock2) {
                        return clock1.hour == clock2.hour &&
                            clock1.minute == clock2.minute &&
                            clock1.second == clock2.second;
                    };
                    Clock.biggerThan = function (clock1, clock2) {
                        return clock1.hour > clock2.hour ? true : clock1.hour < clock2.hour ? false :
                            clock1.minute > clock2.minute ? true : clock1.minute < clock2.minute ? false :
                                clock1.second > clock2.second;
                    };
                    return Clock;
                }());
                StaticTools.Clock = Clock;
                var Array = (function () {
                    function Array() {
                    }
                    Array.orderBy = function (array, compare) {
                        for (var i = 0; i < array.length - 1; i++) {
                            for (var j = i + 1; j < array.length; j++) {
                                if (compare(array[i], array[j])) {
                                    Array.swap(array, i, j);
                                }
                            }
                        }
                    };
                    Array.swap = function (array, index1, index2) {
                        var temp = array[index1];
                        array[index1] = array[index2];
                        array[index2] = temp;
                    };
                    Array.combine = function (array1, array2) {
                        var a = array1.concat(array2);
                        for (var i = 0; i < a.length; ++i) {
                            for (var j = i + 1; j < a.length; ++j) {
                                if (a[i] === a[j])
                                    a.splice(j--, 1);
                            }
                        }
                        return a;
                    };
                    Array.equals = function (array1, array2, compare) {
                        if (!array1 && !array2)
                            return true;
                        if (!array1 || !array2)
                            return false;
                        if (array1.length !== array2.length)
                            return false;
                        if (compare) {
                            for (var i = 0; i < array1.length; i++) {
                                if (!compare(array1[i], array2[i]))
                                    return false;
                            }
                        }
                        else {
                            for (var i = 0; i < array1.length; i++) {
                                if (array1[i] !== array2[i])
                                    return false;
                            }
                        }
                        return true;
                    };
                    Array.contains = function (array, k, compare) {
                        return Array.indexOf(array, k, compare) >= 0;
                    };
                    Array.containsArray = function (master, slave, compare) {
                        for (var _i = 0, slave_1 = slave; _i < slave_1.length; _i++) {
                            var s = slave_1[_i];
                            if (!Array.contains(master, s, compare))
                                return false;
                        }
                        return true;
                    };
                    Array.indexOf = function (array, k, compare) {
                        if (compare) {
                            for (var i = 0; i < array.length; i++) {
                                if (compare(array[i], k)) {
                                    return i;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === k) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    };
                    Array.removeAt = function (array, index) {
                        return array.splice(index, 1)[0];
                    };
                    Array.remove = function (array, k, compare) {
                        if (compare) {
                            for (var i = 0; i < array.length; i++) {
                                if (compare(array[i], k)) {
                                    return array.splice(i, 1)[0];
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] == k) {
                                    return array.splice(i, 1)[0];
                                }
                            }
                        }
                    };
                    Array.removeAllMatched = function (array, k, compare) {
                        var returnValue = [];
                        if (compare) {
                            for (var i = 0; i < array.length; i++) {
                                if (compare(array[i], k)) {
                                    returnValue.push(array.splice(i, 1)[0]);
                                    i--;
                                }
                            }
                        }
                        else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] == k) {
                                    returnValue.push(array.splice(i, 1)[0]);
                                    i--;
                                }
                            }
                        }
                        return returnValue;
                    };
                    return Array;
                }());
                StaticTools.Array = Array;
            })(StaticTools = type.StaticTools || (type.StaticTools = {}));
        })(type = sys.type || (sys.type = {}));
    })(sys = euglena.sys || (euglena.sys = {}));
    var being;
    (function (being) {
        var ParticleV1 = (function () {
            function ParticleV1(meta, data) {
                this.meta = meta;
                this.data = data;
            }
            return ParticleV1;
        }());
        being.ParticleV1 = ParticleV1;
        var ParticleV2 = (function () {
            function ParticleV2(meta, data) {
                this.meta = meta;
                this.data = data;
            }
            return ParticleV2;
        }());
        being.ParticleV2 = ParticleV2;
        var MetaV2 = (function () {
            function MetaV2(name, of, expireTime) {
                this.name = name;
                this.of = of;
                this.expireTime = expireTime;
                this.version = StaticTools.Particle.Versions.v2;
                this.createTime = new exports.JavascriptDate().getTime();
            }
            return MetaV2;
        }());
        being.MetaV2 = MetaV2;
        var StaticTools;
        (function (StaticTools) {
            var Particle;
            (function (Particle) {
                var Versions;
                (function (Versions) {
                    Versions.v1 = "v1";
                    Versions.v2 = "v2";
                })(Versions = Particle.Versions || (Particle.Versions = {}));
                function validate(particle) {
                    if (!particle || !particle.meta)
                        return false;
                    switch (particle.meta.version) {
                        case Versions.v2:
                            var meta = particle.meta;
                            return meta.name && (typeof meta.name === "string") && typeof meta.of &&
                                (typeof meta.of === "string") && (meta.version === Versions.v2) && (typeof meta.createTime === "number");
                        case Versions.v1:
                        case "undefined":
                            return particle.meta.name ? true : false;
                    }
                }
                Particle.validate = validate;
            })(Particle = StaticTools.Particle || (StaticTools.Particle = {}));
        })(StaticTools = being.StaticTools || (being.StaticTools = {}));
        var interaction;
        (function (interaction) {
            var Impact = (function () {
                function Impact(particle, token, from) {
                    this.particle = particle;
                    this.token = token;
                    this.from = from;
                }
                return Impact;
            }());
            interaction.Impact = Impact;
            var constants;
            (function (constants) {
                constants.ReceivedParticleReference = "ReceivedParticleReference";
            })(constants = interaction.constants || (interaction.constants = {}));
        })(interaction = being.interaction || (being.interaction = {}));
        var alive;
        (function (alive) {
            var ParticleV2 = euglena.being.ParticleV2;
            var dna;
            (function (dna) {
                var GeneV1 = (function (_super) {
                    __extends(GeneV1, _super);
                    function GeneV1(name, triggers, // particle prop - value match
                        reaction, override, expiretime) {
                        return _super.call(this, { expiretime: expiretime, name: alive.constants.particles.Gene }, { name: name, triggers: triggers, reaction: reaction, override: override }) || this;
                    }
                    return GeneV1;
                }(ParticleV1));
                dna.GeneV1 = GeneV1;
                var GeneV2 = (function (_super) {
                    __extends(GeneV2, _super);
                    function GeneV2(meta, data) {
                        return _super.call(this, new MetaV2(constants.particles.Gene, meta.of, meta.expireTime), data) || this;
                    }
                    return GeneV2;
                }(ParticleV2));
                dna.GeneV2 = GeneV2;
                var GarbageCollector = (function () {
                    function GarbageCollector(chromosome, particles) {
                        this.timeout = 1000;
                        this.chromosome = [];
                        this.particles = [];
                        this.chromosome = chromosome;
                        this.particles = particles;
                    }
                    GarbageCollector.prototype.start = function () {
                        var _this = this;
                        var chromosome = this.chromosome;
                        var particles = this.particles;
                        setInterval(function () {
                            //process genes
                            var now = euglena.sys.type.StaticTools.Time.now();
                            var nowDigit = new exports.JavascriptDate().getTime();
                            var doesExpire = function (ai) {
                                return (!ai.meta.version || ai.meta.version === StaticTools.Particle.Versions.v1) ?
                                    (ai.meta.expiretime && euglena.sys.type.StaticTools.Time.biggerThan(now, ai.meta.expiretime)) :
                                    (ai.meta.version === StaticTools.Particle.Versions.v2 ?
                                        (ai.meta.expireTime && ai.meta.expireTime <= nowDigit) : false);
                            };
                            euglena.sys.type.StaticTools.Array.removeAllMatched(_this.chromosome, null, doesExpire);
                            //process particles
                            euglena.sys.type.StaticTools.Array.removeAllMatched(_this.particles, null, doesExpire);
                        }, this.timeout);
                    };
                    return GarbageCollector;
                }());
                dna.GarbageCollector = GarbageCollector;
            })(dna = alive.dna || (alive.dna = {}));
            var constants;
            (function (constants) {
                constants.OutSide = "OutSide";
                var particles;
                (function (particles) {
                    particles.Gene = "Gene";
                    particles.Chromosome = "Chromosome";
                })(particles = constants.particles || (constants.particles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var Organelle = (function () {
                function Organelle(name, className, send) {
                    this.name = name;
                    this.className = className;
                    this.send = send;
                    var this_ = this;
                    this.actions = new sys.type.Map();
                    this.bindActions(function (particleName, action) {
                        this_.actions.add(particleName, action);
                    });
                }
                Organelle.prototype.receive = function (particle, callback) {
                    var action = this.actions.get(particle.meta.name);
                    if (action) {
                        action(particle, callback);
                    }
                };
                return Organelle;
            }());
            alive.Organelle = Organelle;
            var Cytoplasm = (function () {
                function Cytoplasm(euglenaName, particles, organelles, chromosome) {
                    if (Cytoplasm.instance) {
                        throw "There exists a cytoplasm instance already.";
                    }
                    Cytoplasm.particles = particles;
                    Cytoplasm.particles.push(new being.ParticleV2(new MetaV2(alive.constants.particles.Chromosome, euglenaName), chromosome));
                    Cytoplasm.organelles = {};
                    for (var _i = 0, organelles_1 = organelles; _i < organelles_1.length; _i++) {
                        var organelle = organelles_1[_i];
                        organelle.send = Cytoplasm.receive;
                        Cytoplasm.organelles[organelle.name] = organelle;
                    }
                    Cytoplasm.instance = this;
                    Cytoplasm.garbageCollector = new dna.GarbageCollector(chromosome, particles);
                    Cytoplasm.garbageCollector.start();
                }
                Object.defineProperty(Cytoplasm, "chromosome", {
                    get: function () {
                        return Cytoplasm.getParticle({ name: alive.constants.particles.Chromosome }).data;
                    },
                    enumerable: true,
                    configurable: true
                });
                Cytoplasm.receive = function (particle, source, callback) {
                    console.log("Cytoplasm says : received " + JSON.stringify(particle.meta));
                    //find which genes are matched with properties of the particle 
                    var triggerableReactions = new Array();
                    for (var i = 0; i < Cytoplasm.chromosome.length; i++) {
                        var triggers = Cytoplasm.chromosome[i].data.triggers;
                        if (js.Class.doesMongoCover(particle, triggers)) {
                            var reaction = Cytoplasm.chromosome[i].data.reaction;
                            triggerableReactions.push({ index: i, triggers: Object.keys(triggers), reaction: reaction });
                        }
                    }
                    //get rid of overrided reactions
                    var reactions = Array();
                    var names = Array();
                    for (var _i = 0, triggerableReactions_1 = triggerableReactions; _i < triggerableReactions_1.length; _i++) {
                        var tr = triggerableReactions_1[_i];
                        var doTrigger = true;
                        //Check if the tr is contained by others, if true
                        for (var _a = 0, triggerableReactions_2 = triggerableReactions; _a < triggerableReactions_2.length; _a++) {
                            var tr2 = triggerableReactions_2[_a];
                            //if it is the same object, do nothing 
                            if (tr.index === tr2.index)
                                continue;
                            //then if triggers of tr2 does not contain triggers of tr, do nothing
                            if (!euglena.sys.type.StaticTools.Array.containsArray(tr2.triggers, tr.triggers))
                                continue;
                            //then check if tr2 overrides tr
                            doTrigger = !(Cytoplasm.chromosome[tr2.index].data.override === Cytoplasm.chromosome[tr.index].data.name);
                        }
                        if (doTrigger) {
                            reactions.push(tr.reaction);
                            names.push(Cytoplasm.chromosome[tr.index].data.name);
                        }
                    }
                    //trigger collected reactions
                    for (var i_1 = 0; i_1 < reactions.length; i_1++) {
                        var reaction_1 = reactions[i_1];
                        //try {
                        console.log("Cytoplasm says : triggering gene \"" + names[i_1] + "\"");
                        reaction_1(particle, source, callback ? function (particle) {
                            console.log("Cytoplasm says : transmitting " + JSON.stringify(particle.meta) + " to " + source);
                            callback(particle);
                        } : callback);
                    }
                };
                Cytoplasm.transmit = function (organelleName, particle, callback) {
                    console.log("Cytoplasm says : transmitting " + JSON.stringify(particle.meta) + " to " + organelleName);
                    var organelle = Cytoplasm.organelles[organelleName];
                    organelle.receive(particle, callback ? function (particle) {
                        console.log("Cytoplasm says : received " + JSON.stringify(particle.meta));
                        callback(particle);
                    } : callback);
                };
                Cytoplasm.saveParticle = function (particle) {
                    var index = sys.type.StaticTools.Array.indexOf(Cytoplasm.particles, particle.meta, function (tt, m) { return sys.type.StaticTools.Object.equals(tt.meta, m); });
                    if (index >= 0) {
                        Cytoplasm.particles[index] = particle;
                    }
                    else {
                        Cytoplasm.particles.push(particle);
                    }
                };
                Cytoplasm.removeParticles = function (query) {
                    return sys.type.StaticTools.Array.removeAllMatched(Cytoplasm.particles, query, function (ai, t) { return js.Class.doesMongoCover(ai, query); });
                };
                Cytoplasm.getParticle = function (query) {
                    for (var _i = 0, _a = Cytoplasm.particles; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (js.Class.doesMongoCover(p, query)) {
                            return p;
                        }
                    }
                    return null;
                };
                Cytoplasm.getParticles = function (query) {
                    var returnList = Array();
                    for (var _i = 0, _a = Cytoplasm.particles; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (js.Class.doesMongoCover(p, query)) {
                            returnList.push(p);
                        }
                    }
                    return returnList;
                };
                return Cytoplasm;
            }());
            Cytoplasm.instance = null;
            Cytoplasm.organelles = null;
            alive.Cytoplasm = Cytoplasm;
        })(alive = being.alive || (being.alive = {}));
    })(being = euglena.being || (euglena.being = {}));
})(euglena = exports.euglena || (exports.euglena = {}));
//# sourceMappingURL=index.js.map