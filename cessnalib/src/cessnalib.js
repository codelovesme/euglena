var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by codelovesme on 6/19/2015.
 */
var cessnalib;
(function (cessnalib) {
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
                if (deep === void 0) { deep = false; }
                var sub = {};
                for (var prop in obj) {
                    sub[prop] = (deep && ('object' == typeof obj[prop])) ? Class.clone(obj[prop], true) : obj[prop];
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
                    if (("function" != typeof emptyInstance[prop]) && !emptyInstance[prop])
                        emptyInstance[prop] = valueObj[prop];
                }
                return emptyInstance;
            };
            Class.valuefy = function (instance) {
                var valueObj = {};
                var propToValuefy = null;
                for (var prop in instance) {
                    if ("function" != typeof instance[prop]) {
                        valueObj[prop] = instance[prop];
                    }
                    else if (typeof prop == "object") {
                        valueObj[prop] = Class.valuefy(instance[prop]);
                    }
                    else if ((prop.substring(0, 3) == "get") && (propToValuefy = prop.substring(3, prop.length))) {
                        valueObj[propToValuefy[0].toLowerCase() + propToValuefy.substring(1, propToValuefy.length)] = instance[prop]();
                    }
                }
                return valueObj;
            };
            Class.isPrimaryType = function (obj) {
                return typeof obj == "string" ||
                    typeof obj == "number" ||
                    typeof obj == "boolean";
            };
            Class.instanceOf = function (referenceObject, obj) {
                if (Class.isPrimaryType(referenceObject))
                    return typeof referenceObject == typeof obj;
                for (var prop in referenceObject) {
                    if (obj[prop] == undefined)
                        return false;
                }
                return true;
            };
            return Class;
        })();
        js.Class = Class;
    })(js = cessnalib.js || (cessnalib.js = {}));
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
    })(injection = cessnalib.injection || (cessnalib.injection = {}));
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
                Map.prototype.get = function (key) {
                    var _this = this;
                    var returnValue = null;
                    if (this.condition) {
                        this.keys.forEach(function (k) {
                            if (_this.condition(k, key)) {
                                returnValue = _this.values[_this.keys.indexOf(k)];
                            }
                        });
                    }
                    else {
                        returnValue = this.values[this.keys.indexOf(key)];
                    }
                    return returnValue;
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
            var StaticTools;
            (function (StaticTools) {
                var Array = (function () {
                    function Array() {
                    }
                    Array.contains = function (array, t, compare) {
                        return Array.indexOf(array, t, compare) >= 0;
                    };
                    Array.indexOf = function (array, t, compare) {
                        for (var i = 0; i < array.length; i++) {
                            if (compare(array[i], t)) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    return Array;
                })();
                StaticTools.Array = Array;
            })(StaticTools = type.StaticTools || (type.StaticTools = {}));
            var Time = (function () {
                function Time(date, clock) {
                    this.date = date;
                    this.clock = clock;
                    this.className = "cessnalib.sys.type.Time";
                }
                return Time;
            })();
            type.Time = Time;
            var Date = (function () {
                function Date(year, month, day) {
                    this.year = year;
                    this.month = month;
                    this.day = day;
                    this.className = "cessnalib.sys.type.Date";
                }
                return Date;
            })();
            type.Date = Date;
            var Clock = (function () {
                function Clock(hour, minute, second) {
                    this.hour = hour;
                    this.minute = minute;
                    this.second = second;
                    this.className = "cessnalib.sys.type.Clock";
                }
                return Clock;
            })();
            type.Clock = Clock;
        })(type = sys.type || (sys.type = {}));
    })(sys = cessnalib.sys || (cessnalib.sys = {}));
    var being;
    (function (being) {
        var Particle = (function () {
            function Particle(className, content) {
                this.className = className;
                this.content = content;
            }
            return Particle;
        })();
        being.Particle = Particle;
        var alive;
        (function (alive) {
            var Organelle = (function () {
                function Organelle(className, seed, initialProperties) {
                    this.className = className;
                    this.seed = seed;
                    this.initialProperties = initialProperties;
                }
                return Organelle;
            })();
            alive.Organelle = Organelle;
            var Limb = (function (_super) {
                __extends(Limb, _super);
                function Limb(className, seed, initialProperties) {
                    _super.call(this, className, seed, initialProperties);
                }
                return Limb;
            })(Organelle);
            alive.Limb = Limb;
            var EuglenaInfo = (function () {
                function EuglenaInfo(euglenaId, url, port) {
                    this.euglenaId = euglenaId;
                    this.url = url;
                    this.port = port;
                    this.className = "cessnalib.being.alive.EuglenaInfo";
                }
                return EuglenaInfo;
            })();
            alive.EuglenaInfo = EuglenaInfo;
            var Euglena = (function () {
                function Euglena(chromosome) {
                    this.organelles = {};
                    this.particles = {};
                    this.chromosome = [];
                    this.chromosome = chromosome ? chromosome : [];
                }
                Euglena.prototype.addOrganelle = function (organelle) {
                    this.organelles[organelle.className] = organelle;
                };
                Euglena.prototype.receiveParticle = function (impact) {
                    this.triggerGene(impact);
                };
                Euglena.prototype.saveParticle = function (particle) {
                    this.particles[particle.className] = particle.content;
                    this.triggerGene(particle);
                };
                Euglena.prototype.deleteParticle = function (className) {
                    delete this.particles[className];
                };
                Euglena.prototype.getParticle = function (className) {
                    return this.particles[className];
                };
                Euglena.prototype.triggerGene = function (particle) {
                    for (var i = 0; i < this.chromosome.length; i++) {
                        if (sys.type.StaticTools.Array.contains(this.chromosome[i].triggers, particle.className)) {
                            var reaction = this.chromosome[i].reaction;
                            var particles = this.particles;
                            var organelles = this.organelles;
                            reaction(particle, particles, organelles);
                        }
                    }
                };
                return Euglena;
            })();
            alive.Euglena = Euglena;
            var dna;
            (function (dna) {
                var Gene = (function () {
                    function Gene(className, triggers, reaction) {
                        this.className = className;
                        this.triggers = triggers;
                        this.reaction = reaction;
                    }
                    return Gene;
                })();
                dna.Gene = Gene;
            })(dna = alive.dna || (alive.dna = {}));
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib.being || (cessnalib.being = {}));
})(cessnalib = exports.cessnalib || (exports.cessnalib = {}));
//# sourceMappingURL=cessnalib.js.map