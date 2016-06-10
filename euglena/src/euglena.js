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
var euglena;
(function (euglena) {
    euglena.JavascriptDate = Date;
    var js;
    (function (js) {
        var Class = (function () {
            function Class() {
            }
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
                    else if (typeof prop === "object") {
                        valueObj[prop] = Class.valuefy(instance[prop]);
                    }
                    else if ((prop.substring(0, 3) === "get") && (propToValuefy = prop.substring(3, prop.length))) {
                        valueObj[propToValuefy[0].toLowerCase() + propToValuefy.substring(1, propToValuefy.length)] = instance[prop]();
                    }
                }
                return valueObj;
            };
            Class.isPrimaryType = function (obj) {
                return typeof obj === "string" ||
                    typeof obj === "number" ||
                    typeof obj === "boolean";
            };
            Class.instanceOf = function (referenceObject, obj) {
                if (Class.isPrimaryType(referenceObject))
                    return typeof referenceObject === typeof obj;
                for (var prop in referenceObject) {
                    if (obj[prop] === undefined)
                        return false;
                }
                return true;
            };
            return Class;
        })();
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
        })();
        injection.StaticTools = StaticTools;
        var Configuration = (function () {
            function Configuration() {
            }
            return Configuration;
        })();
        injection.Configuration = Configuration;
        var ValueChooser = (function () {
            function ValueChooser() {
                this.index = 0;
            }
            return ValueChooser;
        })();
        injection.ValueChooser = ValueChooser;
        var ObjectChooser = (function () {
            function ObjectChooser() {
            }
            return ObjectChooser;
        })();
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
            })();
            type.Exception = Exception;
            var Map = (function () {
                function Map(condition) {
                    this.condition = condition;
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
                    var index = this.keys.indexOf(key);
                    if (index >= 0) {
                        this.values[index] = value;
                    }
                    else {
                        this.keys.push(key);
                        this.values.push(value);
                    }
                };
                Map.prototype.remove = function (key) {
                    var index = this.keys.indexOf(key);
                    this.keys.slice(index, 1);
                    this.values.slice(index, 1);
                };
                Map.prototype.indexOf = function (key) {
                    var _this = this;
                    var index = -1;
                    if (this.condition) {
                        this.keys.forEach(function (k) {
                            if (_this.condition(k, key)) {
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
            })();
            type.Map = Map;
            var Time = (function () {
                function Time(date, clock) {
                    this.date = date;
                    this.clock = clock;
                    this.className = "euglena.sys.type.Time";
                }
                return Time;
            })();
            type.Time = Time;
            var Date = (function () {
                function Date(year, month, day) {
                    this.year = year;
                    this.month = month;
                    this.day = day;
                    this.className = "euglena.sys.type.Date";
                }
                return Date;
            })();
            type.Date = Date;
            var Clock = (function () {
                function Clock(hour, minute, second) {
                    this.hour = hour;
                    this.minute = minute;
                    this.second = second;
                    this.className = "euglena.sys.type.Clock";
                }
                return Clock;
            })();
            type.Clock = Clock;
            var StaticTools;
            (function (StaticTools) {
                var Exception = (function () {
                    function Exception() {
                    }
                    Exception.isNotException = function (t) {
                        return !euglena.js.Class.instanceOf(euglena.reference.sys.type.Exception, t);
                    };
                    return Exception;
                })();
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
                })();
                StaticTools.UUID = UUID;
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
                        var newDate = new euglena.JavascriptDate();
                        return new sys.type.Time(new sys.type.Date(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, newDate.getUTCDate()), new sys.type.Clock(newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds()));
                    };
                    Time.addMiliseconds = function (time, miliseconds) {
                        return Time.fromJavascriptDate(new euglena.JavascriptDate(Time.toJavascriptDate(time).getTime() + miliseconds));
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
                        var date = new euglena.JavascriptDate();
                        date.setUTCFullYear(time.date.year);
                        date.setUTCMonth(time.date.month - 1);
                        date.setUTCDate(time.date.day);
                        date.setUTCHours(time.clock.hour);
                        date.setUTCMinutes(time.clock.minute);
                        date.setUTCSeconds(time.clock.second);
                        return date;
                    };
                    return Time;
                })();
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
                })();
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
                })();
                StaticTools.Clock = Clock;
                var Array = (function () {
                    function Array() {
                    }
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
                        for (var i = 0; i < array1.length; i++) {
                            if (array1[i] !== array2[i])
                                return false;
                        }
                        return true;
                    };
                    Array.contains = function (array, t, compare) {
                        return Array.indexOf(array, t, compare) >= 0;
                    };
                    Array.containsArray = function (master, slave, compare) {
                        for (var _i = 0; _i < slave.length; _i++) {
                            var s = slave[_i];
                            if (!Array.contains(master, s, compare))
                                return false;
                        }
                        return true;
                    };
                    Array.indexOf = function (array, t, compare) {
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
                    };
                    return Array;
                })();
                StaticTools.Array = Array;
            })(StaticTools = type.StaticTools || (type.StaticTools = {}));
        })(type = sys.type || (sys.type = {}));
    })(sys = euglena.sys || (euglena.sys = {}));
    var being;
    (function (being) {
        var Particle = (function () {
            function Particle(name, content, of, primaryKeys) {
                this.name = name;
                this.content = content;
                this.of = of;
                this.primaryKeys = primaryKeys;
            }
            return Particle;
        })();
        being.Particle = Particle;
        var interaction;
        (function (interaction) {
            var Impact = (function () {
                function Impact(particle, token) {
                    this.particle = particle;
                    this.token = token;
                }
                return Impact;
            })();
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
                var ParticleReference = (function (_super) {
                    __extends(ParticleReference, _super);
                    function ParticleReference(name, of, primaryKeys, content) {
                        _super.call(this, name, content, of, primaryKeys);
                    }
                    return ParticleReference;
                })(Particle);
                dna.ParticleReference = ParticleReference;
                var StaticTools = (function () {
                    function StaticTools() {
                    }
                    StaticTools.ParticleReference = {
                        equals: function (ref1, ref2) {
                            return ref1.name === ref2.name &&
                                ref1.of === ref2.of &&
                                euglena.sys.type.StaticTools.Array.equals(ref1.primaryKeys, ref2.primaryKeys);
                        }
                    };
                    return StaticTools;
                })();
                dna.StaticTools = StaticTools;
            })(dna = alive.dna || (alive.dna = {}));
            var constants;
            (function (constants) {
                constants.OutSide = "OutSide";
            })(constants = alive.constants || (alive.constants = {}));
            var Organelle = (function () {
                function Organelle(name, className, send, initialProperties) {
                    this.name = name;
                    this.className = className;
                    this.send = send;
                    this.initialProperties = initialProperties;
                }
                return Organelle;
            })();
            alive.Organelle = Organelle;
            var Body = (function () {
                function Body(particles) {
                    this.particles = particles;
                    this.organelles = {};
                }
                Body.generateInstance = function (particles) {
                    if (!Body.instance) {
                        Body.instance = new Body(particles);
                    }
                    return Body.instance;
                };
                Body.prototype.transmit = function (organelleName, particle, response) {
                    console.log("received Particle: " + particle.name + " sent to: " + organelleName);
                    var organelle = Body.instance.organelles[organelleName];
                    organelle.receive(particle, function (resp) {
                        console.log("Response :" + resp.name + " from: " + organelleName + " for: " + particle.name);
                        response ? response(resp) : false;
                    });
                };
                Body.prototype.getParticle = function (particleReference) {
                    var index = Body.instance.indexOfParticle(particleReference);
                    return index >= 0 ? Body.instance.particles[index] : null;
                };
                Body.prototype.indexOfParticle = function (particleReference) {
                    for (var i = 0; i < Body.instance.particles.length; i++) {
                        if (dna.StaticTools.ParticleReference.equals(Body.instance.particles[i], particleReference)) {
                            return i;
                        }
                    }
                    return -1;
                };
                Body.prototype.saveParticle = function (particle) {
                    var index = Body.instance.indexOfParticle(particle);
                    if (index >= 0) {
                        Body.instance.particles[index] = particle;
                    }
                    else {
                        Body.instance.particles.push(particle);
                    }
                };
                Body.prototype.getOrganelle = function (organelleName) {
                    return Body.instance.organelles[organelleName];
                };
                Body.prototype.setOrganelle = function (organelle) {
                    Body.instance.organelles[organelle.name] = organelle;
                };
                Body.instance = null;
                return Body;
            })();
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