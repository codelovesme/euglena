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
            var StaticTools;
            (function (StaticTools) {
                var Array = (function () {
                    function Array() {
                    }
                    Array.contains = function (array, t, compare) {
                        return Array.indexOf(array, t, compare) >= 0;
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
                                if (array[i] == t) {
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
    })(sys = cessnalib.sys || (cessnalib.sys = {}));
    var being;
    (function (being) {
        var constants;
        (function (constants) {
            constants.Particle = "cessnalib.being.Particle";
        })(constants = being.constants || (being.constants = {}));
        var Particle = (function () {
            function Particle(name, content) {
                this.name = name;
                this.content = content;
                this.className = constants.Particle;
            }
            return Particle;
        })();
        being.Particle = Particle;
        var alive;
        (function (alive) {
            var Particle = cessnalib.being.Particle;
            var constants;
            (function (constants) {
                constants.EuglenaInfo = "cessnalib.being.alive.EuglenaInfo";
            })(constants = alive.constants || (alive.constants = {}));
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
                    this.className = constants.EuglenaInfo;
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
                Euglena.prototype.addGene = function (gene) {
                    this.chromosome.push(gene);
                };
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
                        if (sys.type.StaticTools.Array.contains(this.chromosome[i].triggers, particle.name)) {
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
                    function Gene(className, triggers, reaction, condition) {
                        this.className = className;
                        this.triggers = triggers;
                        this.reaction = reaction;
                    }
                    return Gene;
                })();
                dna.Gene = Gene;
                var condition;
                (function (condition_1) {
                    var constants;
                    (function (constants) {
                        constants.TimeComparison = "cessnalib.being.alive.dna.condition.TimeComparison";
                        constants.NumberComparison = "cessnalib.being.alive.dna.condition.NumberComparison";
                        constants.LogicalPhrase = "cessnalib.being.alive.dna.condition.ConditionPhrase";
                        constants.CalculationPhrase = "cessnalib.being.alive.dna.condition.CalculationPhrase";
                        constants.ClockComparison = "cessnalib.being.alive.dna.condition.ClockComparison";
                        constants.DateComparison = "cessnalib.being.alive.dna.condition.DateComparison";
                    })(constants = condition_1.constants || (condition_1.constants = {}));
                    var ParticleReference = (function (_super) {
                        __extends(ParticleReference, _super);
                        function ParticleReference(name) {
                            _super.call(this, name, undefined);
                        }
                        return ParticleReference;
                    })(Particle);
                    condition_1.ParticleReference = ParticleReference;
                    var StaticTools = (function () {
                        function StaticTools() {
                        }
                        StaticTools.prototype.addOperandAndParameter = function (phrase, operand, parameter) {
                            phrase.stack.push(operand, parameter);
                        };
                        return StaticTools;
                    })();
                    condition_1.StaticTools = StaticTools;
                    var Executor = (function () {
                        function Executor(particles) {
                            this.particles = particles;
                        }
                        Executor.prototype.executeLogicalPhrase = function (logicalPhrase) {
                            var stack = logicalPhrase.stack;
                            var result = this.execute(stack.shift());
                            var operator = stack.shift();
                            do {
                                var operand2 = this.execute(stack.shift());
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
                        };
                        Executor.prototype.execute = function (condition) {
                            if (typeof condition == "string" || typeof condition == "number")
                                return;
                            var returnValue = null;
                            switch (condition.className) {
                                case constants.LogicalPhrase:
                                    returnValue = this.executeLogicalPhrase(condition);
                                    break;
                                case constants.CalculationPhrase:
                                    returnValue = this.executeCalculationPhrase(condition);
                                    break;
                                case cessnalib.being.constants.Particle:
                                    returnValue = this.executeParticleReference(condition);
                                case constants.TimeComparison:
                                case constants.DateComparison:
                                case constants.ClockComparison:
                                case constants.NumberComparison:
                                    returnValue = this.executeComparison(condition);
                                    break;
                            }
                            return returnValue;
                        };
                        Executor.prototype.executeComparison = function (comparison) {
                            var result = false;
                            var operand1 = this.execute(comparison.operand1);
                            var operator = comparison.operator;
                            var operand2 = this.execute(comparison.operand2);
                            switch (comparison.className) {
                                case constants.NumberComparison:
                                    var number1 = Number(operand1);
                                    var number2 = Number(operand2);
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
                                case constants.TimeComparison:
                                    var time1 = operand1;
                                    var time2 = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.BIGGERTHAN, time2.date)) ? true :
                                                this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.SMALLERTHAN, time2.date)) ? false :
                                                    this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.BIGGERTHAN, time2.clock));
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.EQUAL, time2.date)) &&
                                                this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.EQUAL, time2.clock));
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2));
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.SMALLERTHAN, time2.date)) ? true :
                                                this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.BIGGERTHAN, time2.date)) ? false :
                                                    this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.SMALLERTHAN, time2.clock));
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.BIGGERTHAN, time2)) ||
                                                this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2));
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.SMALLERTHAN, time2)) ||
                                                this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2));
                                            break;
                                    }
                                    break;
                                case constants.DateComparison:
                                    var date1 = operand1;
                                    var date2 = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = date1.year > date2.year ? true : date1.year < date2.year ? false :
                                                date1.month > date2.month ? true : date1.month < date2.month ? false :
                                                    date1.day > date2.day;
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = date1.year == date2.year &&
                                                date1.month == date2.month &&
                                                date1.day == date2.day;
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !(date1.year == date2.year &&
                                                date1.month == date2.month &&
                                                date1.day == date2.day);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = date1.year < date2.year ? true : date1.year > date2.year ? false :
                                                date1.month < date2.month ? true : date1.month > date2.month ? false :
                                                    date1.day < date2.day;
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.BIGGERTHAN, date2)) ||
                                                this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.EQUAL, date2));
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.SMALLERTHAN, date2)) ||
                                                this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.EQUAL, date2));
                                            break;
                                    }
                                    break;
                                case constants.ClockComparison:
                                    var clock1 = operand1;
                                    var clock2 = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = clock1.hour > clock2.hour ? true : clock1.hour < clock2.hour ? false :
                                                clock1.minute > clock2.minute ? true : clock1.minute < clock2.minute ? false :
                                                    clock1.second > clock2.second;
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = clock1.hour == clock2.hour &&
                                                clock1.minute == clock2.minute &&
                                                clock1.second == clock2.second;
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !(clock1.hour == clock2.hour &&
                                                clock1.minute == clock2.minute &&
                                                clock1.second == clock2.second);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = clock1.hour < clock2.hour ? true : clock1.hour > clock2.hour ? false :
                                                clock1.minute < clock2.minute ? true : clock1.minute > clock2.minute ? false :
                                                    clock1.second < clock2.second;
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.BIGGERTHAN, clock2)) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2));
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.SMALLERTHAN, clock2)) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2));
                                            break;
                                    }
                                    break;
                            }
                            return result;
                        };
                        Executor.prototype.executeCalculationPhrase = function (calculationPhrase) {
                            var stack = calculationPhrase.stack;
                            //get multiplication and division manipulations first
                            //for(let item of calculationPhrase.stack){
                            //}
                            var result = this.execute(stack.shift());
                            var operator = stack.shift();
                            do {
                                var operand2 = this.execute(stack.shift());
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
                        };
                        Executor.prototype.executeParticleReference = function (particle) {
                            return this.particles[particle.name];
                        };
                        return Executor;
                    })();
                    condition_1.Executor = Executor;
                    var Phrase = (function () {
                        function Phrase(className, operand1, operator, operand2) {
                            this.className = className;
                            this.operand1 = operand1;
                            this.operator = operator;
                            this.operand2 = operand2;
                            this.stack.push(operand1, operator, operand2);
                        }
                        return Phrase;
                    })();
                    condition_1.Phrase = Phrase;
                    var LogicalPhrase = (function (_super) {
                        __extends(LogicalPhrase, _super);
                        function LogicalPhrase(operand1, operator, operand2) {
                            _super.call(this, constants.LogicalPhrase, operand1, operator, operand2);
                        }
                        return LogicalPhrase;
                    })(Phrase);
                    condition_1.LogicalPhrase = LogicalPhrase;
                    var Comparison = (function () {
                        function Comparison(className, operand1, operator, operand2) {
                            this.className = className;
                            this.operand1 = operand1;
                            this.operator = operator;
                            this.operand2 = operand2;
                        }
                        return Comparison;
                    })();
                    condition_1.Comparison = Comparison;
                    var NumberComparison = (function (_super) {
                        __extends(NumberComparison, _super);
                        function NumberComparison(operand1, operator, operand2) {
                            _super.call(this, constants.NumberComparison, operand1, operator, operand2);
                        }
                        return NumberComparison;
                    })(Comparison);
                    condition_1.NumberComparison = NumberComparison;
                    var TimeComparison = (function (_super) {
                        __extends(TimeComparison, _super);
                        function TimeComparison(operand1, operator, operand2) {
                            _super.call(this, constants.TimeComparison, operand1, operator, operand2);
                        }
                        return TimeComparison;
                    })(Comparison);
                    condition_1.TimeComparison = TimeComparison;
                    var DateComparison = (function (_super) {
                        __extends(DateComparison, _super);
                        function DateComparison(operand1, operator, operand2) {
                            _super.call(this, constants.DateComparison, operand1, operator, operand2);
                        }
                        return DateComparison;
                    })(Comparison);
                    condition_1.DateComparison = DateComparison;
                    var ClockComparison = (function (_super) {
                        __extends(ClockComparison, _super);
                        function ClockComparison(operand1, operator, operand2) {
                            _super.call(this, constants.ClockComparison, operand1, operator, operand2);
                        }
                        return ClockComparison;
                    })(Comparison);
                    condition_1.ClockComparison = ClockComparison;
                    var CalculationPhrase = (function (_super) {
                        __extends(CalculationPhrase, _super);
                        function CalculationPhrase(operand1, operator, operand2) {
                            _super.call(this, constants.CalculationPhrase, operand1, operator, operand2);
                        }
                        return CalculationPhrase;
                    })(Phrase);
                    condition_1.CalculationPhrase = CalculationPhrase;
                    var operator;
                    (function (operator) {
                        var LogicalOperator;
                        (function (LogicalOperator) {
                            LogicalOperator.AND = "AND";
                            LogicalOperator.OR = "OR";
                        })(LogicalOperator = operator.LogicalOperator || (operator.LogicalOperator = {}));
                        var CalculationOperator;
                        (function (CalculationOperator) {
                            CalculationOperator.SUM = "AND";
                            CalculationOperator.SUB = "OR";
                            CalculationOperator.MUL = "MUL";
                            CalculationOperator.DIV = "DIV";
                        })(CalculationOperator = operator.CalculationOperator || (operator.CalculationOperator = {}));
                        var ComparisonOperator;
                        (function (ComparisonOperator) {
                            ComparisonOperator.EQUAL = "EQUAL";
                            ComparisonOperator.NOTEQUAL = "NOTEQUAL";
                            ComparisonOperator.BIGGERTHAN = "BIGGERTHAN";
                            ComparisonOperator.SMALLERTHAN = "SMALLERTHAN";
                            ComparisonOperator.BIGEQUAL = "BIGEQUAL";
                            ComparisonOperator.SMALLEQUAL = "SMALLEQUAL";
                        })(ComparisonOperator = operator.ComparisonOperator || (operator.ComparisonOperator = {}));
                    })(operator = condition_1.operator || (condition_1.operator = {}));
                })(condition = dna.condition || (dna.condition = {}));
            })(dna = alive.dna || (alive.dna = {}));
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib.being || (cessnalib.being = {}));
})(cessnalib = exports.cessnalib || (exports.cessnalib = {}));
//# sourceMappingURL=cessnalib.js.map