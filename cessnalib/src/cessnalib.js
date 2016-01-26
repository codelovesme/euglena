/**
 * Created by codelovesme on 6/19/2015.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
*TODO List
*
* #Generate impact for particle value change
* #Seperate nucleus to a organelle
* #Seperate particle, request, event
*
*/
var JavascriptDate = Date;
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
                var Exception = (function () {
                    function Exception() {
                    }
                    Exception.isNotException = function (t) {
                        return cessnalib.js.Class.instanceOf(cessnalib.reference.sys.type.Exception, t);
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
                    Time.equals = function (time1, time2) {
                        return Date.equals(time1.date, time2.date) && Clock.equals(time1.clock, time2.clock);
                    };
                    Time.now = function () {
                        var newDate = new JavascriptDate();
                        return new sys.type.Time(new sys.type.Date(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, newDate.getUTCDate()), new sys.type.Clock(newDate.getUTCHours(), newDate.getUTCMinutes(), newDate.getUTCSeconds()));
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
                    return Clock;
                })();
                StaticTools.Clock = Clock;
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
    })(sys = cessnalib.sys || (cessnalib.sys = {}));
    var being;
    (function (being) {
        var Particle = (function () {
            function Particle(name, content) {
                this.name = name;
                this.content = content;
            }
            return Particle;
        })();
        being.Particle = Particle;
        var interaction;
        (function (interaction) {
            var ImpactGenerator = (function () {
                function ImpactGenerator(euglenaName) {
                    this.euglenaName = euglenaName;
                }
                ImpactGenerator.prototype.generateImpact = function (particle, destination) {
                    return StaticTools.generateImpact(this.euglenaName, particle, destination);
                };
                return ImpactGenerator;
            })();
            interaction.ImpactGenerator = ImpactGenerator;
            var StaticTools = (function () {
                function StaticTools() {
                }
                StaticTools.generateImpact = function (sender, particle, destination) {
                    return {
                        "name": sys.type.StaticTools.UUID.generate(),
                        "sender": sender,
                        "particle": particle
                    };
                };
                return StaticTools;
            })();
            interaction.StaticTools = StaticTools;
        })(interaction = being.interaction || (being.interaction = {}));
        var alive;
        (function (alive) {
            var Particle = cessnalib.being.Particle;
            var dna;
            (function (dna) {
                var Time = cessnalib.sys.type.Time;
                var Gene = (function () {
                    function Gene(name, triggers, reaction, condition) {
                        this.name = name;
                        this.triggers = triggers;
                        this.reaction = reaction;
                        this.condition = condition;
                    }
                    return Gene;
                })();
                dna.Gene = Gene;
                var condition;
                (function (condition_1) {
                    var Date = cessnalib.sys.type.Date;
                    var Clock = cessnalib.sys.type.Clock;
                    var constants;
                    (function (constants) {
                        constants.TimeComparison = "cessnalib.being.alive.dna.condition.TimeComparison";
                        constants.NumberComparison = "cessnalib.being.alive.dna.condition.NumberComparison";
                        constants.LogicalPhrase = "cessnalib.being.alive.dna.condition.ConditionPhrase";
                        constants.CalculationPhrase = "cessnalib.being.alive.dna.condition.CalculationPhrase";
                        constants.ClockComparison = "cessnalib.being.alive.dna.condition.ClockComparison";
                        constants.DateComparison = "cessnalib.being.alive.dna.condition.DateComparison";
                        constants.DateTemplateComparison = "cessnalib.being.alive.dna.condition.DateTemplateComparison";
                        constants.DateTemplate = "cessnalib.being.alive.dna.condition.DateTemplate";
                        constants.ClockTemplateComparison = "cessnalib.being.alive.dna.condition.ClockTemplateComparison";
                        constants.ClockTemplate = "cessnalib.being.alive.dna.condition.ClockTemplate";
                        constants.TimeTemplateComparison = "cessnalib.being.alive.dna.condition.TimeTemplateComparison";
                        constants.TimeTemplate = "cessnalib.being.alive.dna.condition.TimeTemplate";
                    })(constants = condition_1.constants || (condition_1.constants = {}));
                    var ParticleReference = (function (_super) {
                        __extends(ParticleReference, _super);
                        function ParticleReference(name) {
                            _super.call(this, name, null);
                        }
                        return ParticleReference;
                    })(Particle);
                    condition_1.ParticleReference = ParticleReference;
                    var DateTemplate = (function (_super) {
                        __extends(DateTemplate, _super);
                        function DateTemplate(year, month, day) {
                            _super.call(this, year, month, day);
                            this.className = constants.DateTemplate;
                        }
                        return DateTemplate;
                    })(Date);
                    condition_1.DateTemplate = DateTemplate;
                    var ClockTemplate = (function (_super) {
                        __extends(ClockTemplate, _super);
                        function ClockTemplate(hour, minute, second) {
                            _super.call(this, hour, minute, second);
                            this.className = constants.ClockTemplate;
                        }
                        return ClockTemplate;
                    })(Clock);
                    condition_1.ClockTemplate = ClockTemplate;
                    var TimeTemplate = (function (_super) {
                        __extends(TimeTemplate, _super);
                        function TimeTemplate(date, clock) {
                            _super.call(this, date, clock);
                            this.className = constants.TimeTemplate;
                        }
                        return TimeTemplate;
                    })(Time);
                    condition_1.TimeTemplate = TimeTemplate;
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
                            var result = condition;
                            if (typeof condition === "string" || typeof condition === "number") {
                                result = condition;
                            }
                            if (cessnalib.js.Class.instanceOf(new Particle("Reference", true), condition)) {
                                result = this.executeParticleReference(condition);
                            }
                            else {
                                switch (condition.className) {
                                    case constants.LogicalPhrase:
                                        result = this.executeLogicalPhrase(condition);
                                        break;
                                    case constants.CalculationPhrase:
                                        result = this.executeCalculationPhrase(condition);
                                        break;
                                    case constants.TimeComparison:
                                    case constants.TimeTemplateComparison:
                                    case constants.DateComparison:
                                    case constants.DateTemplateComparison:
                                    case constants.ClockComparison:
                                    case constants.ClockTemplateComparison:
                                    case constants.NumberComparison:
                                    case constants.DateTemplateComparison:
                                        result = this.executeComparison(condition);
                                        break;
                                }
                            }
                            return result;
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
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.BIGGERTHAN, clock2)) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2));
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.SMALLERTHAN, clock2)) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2));
                                            break;
                                    }
                                    break;
                                case constants.DateTemplateComparison:
                                    var dateTemplate = null;
                                    var date = null;
                                    if (operand1.className === constants.DateTemplate) {
                                        dateTemplate = operand1;
                                        date = operand2;
                                    }
                                    else {
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
                                    var clockTemplate = null;
                                    var clock = null;
                                    if (operand1.className === constants.ClockTemplate) {
                                        clockTemplate = operand1;
                                        clock = operand2;
                                    }
                                    else {
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
                                    var timeTemplate = null;
                                    var time = null;
                                    if (operand1.className === constants.TimeTemplate) {
                                        timeTemplate = operand1;
                                        time = operand2;
                                    }
                                    else {
                                        time = operand1;
                                        timeTemplate = operand2;
                                    }
                                    switch (comparison.operator) {
                                        case condition.operator.TemplateOperator.COVER:
                                            result = timeTemplate.date ? this.execute(new DateTemplateComparison(timeTemplate.date, condition.operator.TemplateOperator.COVER, time.date)) : true;
                                            result = result && (timeTemplate.clock ? this.execute(new ClockTemplateComparison(timeTemplate.clock, condition.operator.TemplateOperator.COVER, time.clock)) : true);
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
                    var DateTemplateComparison = (function (_super) {
                        __extends(DateTemplateComparison, _super);
                        function DateTemplateComparison(operand1, operator, operand2) {
                            _super.call(this, constants.DateTemplateComparison, operand1, operator, operand2);
                        }
                        return DateTemplateComparison;
                    })(Comparison);
                    condition_1.DateTemplateComparison = DateTemplateComparison;
                    var ClockTemplateComparison = (function (_super) {
                        __extends(ClockTemplateComparison, _super);
                        function ClockTemplateComparison(operand1, operator, operand2) {
                            _super.call(this, constants.ClockTemplateComparison, operand1, operator, operand2);
                        }
                        return ClockTemplateComparison;
                    })(Comparison);
                    condition_1.ClockTemplateComparison = ClockTemplateComparison;
                    var TimeTemplateComparison = (function (_super) {
                        __extends(TimeTemplateComparison, _super);
                        function TimeTemplateComparison(operand1, operator, operand2) {
                            _super.call(this, constants.TimeTemplateComparison, operand1, operator, operand2);
                        }
                        return TimeTemplateComparison;
                    })(Comparison);
                    condition_1.TimeTemplateComparison = TimeTemplateComparison;
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
                        var TemplateOperator;
                        (function (TemplateOperator) {
                            TemplateOperator.COVER = "COVER";
                        })(TemplateOperator = operator.TemplateOperator || (operator.TemplateOperator = {}));
                    })(operator = condition_1.operator || (condition_1.operator = {}));
                })(condition = dna.condition || (dna.condition = {}));
            })(dna = alive.dna || (alive.dna = {}));
            var constants;
            (function (constants) {
                constants.OutSide = "OutSide";
                constants.EuglenaInfo = "cessnalib.being.alive.EuglenaInfo";
                var particles;
                (function (particles) {
                    particles.EuglenaName = "EuglenaName";
                })(particles = constants.particles || (constants.particles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var Organelle = (function () {
                function Organelle(name, impactGenerator, nucleus, initialProperties) {
                    this.name = name;
                    this.impactGenerator = impactGenerator;
                    this.nucleus = nucleus;
                    this.initialProperties = initialProperties;
                }
                return Organelle;
            })();
            alive.Organelle = Organelle;
            var EuglenaInfo = (function () {
                function EuglenaInfo(name, url, port) {
                    this.name = name;
                    this.url = url;
                    this.port = port;
                }
                return EuglenaInfo;
            })();
            alive.EuglenaInfo = EuglenaInfo;
            var Euglena = (function () {
                function Euglena(chromosome, particles, organelles, impactGenerator) {
                    if (chromosome === void 0) { chromosome = []; }
                    if (particles === void 0) { particles = {}; }
                    if (organelles === void 0) { organelles = []; }
                    this.chromosome = chromosome;
                    this.particles = particles;
                    this.impactGenerator = impactGenerator;
                    this.executor = null;
                    this.organelles = {};
                    this.executor = new cessnalib.being.alive.dna.condition.Executor(this.particles);
                    for (var _i = 0; _i < organelles.length; _i++) {
                        var organelle = organelles[_i];
                        organelle.nucleus = this;
                        this.organelles[organelle.name] = organelle;
                    }
                }
                Euglena.prototype.receiveParticle = function (particle) {
                    this.triggerGene(particle);
                };
                Euglena.prototype.triggerGene = function (particle) {
                    for (var i = 0; i < this.chromosome.length; i++) {
                        if (sys.type.StaticTools.Array.contains(this.chromosome[i].triggers, particle.name) &&
                            this.chromosome[i].condition ? this.executor.execute(this.chromosome[i].condition) : true) {
                            var reaction = this.chromosome[i].reaction;
                            var particles = this.particles;
                            var organelles = this.organelles;
                            reaction(particle, particles, organelles, this.receiveParticle, this.impactGenerator);
                        }
                    }
                };
                return Euglena;
            })();
            alive.Euglena = Euglena;
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib.being || (cessnalib.being = {}));
    var reference;
    (function (reference) {
        var sys;
        (function (sys) {
            var type;
            (function (type) {
                type.Exception = new cessnalib.sys.type.Exception("Exception", null);
            })(type = sys.type || (sys.type = {}));
        })(sys = reference.sys || (reference.sys = {}));
    })(reference = cessnalib.reference || (cessnalib.reference = {}));
})(cessnalib = exports.cessnalib || (exports.cessnalib = {}));
//# sourceMappingURL=cessnalib.js.map