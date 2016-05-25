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
                    constructor(name, triggers, reaction, condition, parameters, expiretime) {
                        this.name = name;
                        this.triggers = triggers;
                        this.reaction = reaction;
                        this.condition = condition;
                        this.parameters = parameters;
                        this.expiretime = expiretime;
                    }
                }
                dna.Gene = Gene;
                var condition;
                (function (condition_1) {
                    var Date = euglena.sys.type.Date;
                    var Clock = euglena.sys.type.Clock;
                    var constants;
                    (function (constants) {
                        constants.DoesParticalExist = "euglena.being.alive.dna.condition.DoesParticalExist";
                        constants.TimeComparison = "euglena.being.alive.dna.condition.TimeComparison";
                        constants.NumberComparison = "euglena.being.alive.dna.condition.NumberComparison";
                        constants.StringComparison = "euglena.being.alive.dna.condition.StringComparison";
                        constants.LogicalPhrase = "euglena.being.alive.dna.condition.ConditionPhrase";
                        constants.CalculationPhrase = "euglena.being.alive.dna.condition.CalculationPhrase";
                        constants.ClockComparison = "euglena.being.alive.dna.condition.ClockComparison";
                        constants.DateComparison = "euglena.being.alive.dna.condition.DateComparison";
                        constants.DateTemplateComparison = "euglena.being.alive.dna.condition.DateTemplateComparison";
                        constants.DateTemplate = "euglena.being.alive.dna.condition.DateTemplate";
                        constants.ClockTemplateComparison = "euglena.being.alive.dna.condition.ClockTemplateComparison";
                        constants.ClockTemplate = "euglena.being.alive.dna.condition.ClockTemplate";
                        constants.TimeTemplateComparison = "euglena.being.alive.dna.condition.TimeTemplateComparison";
                        constants.TimeTemplate = "euglena.being.alive.dna.condition.TimeTemplate";
                        constants.DetailedParticleReference = "euglena.being.alive.dna.condition.DetailedParticleReference";
                    })(constants = condition_1.constants || (condition_1.constants = {}));
                    class DoesParticalExist {
                        constructor(name, of) {
                            this.name = name;
                            this.of = of;
                            this.className = constants.DoesParticalExist;
                        }
                    }
                    condition_1.DoesParticalExist = DoesParticalExist;
                    class ParticleReference extends Particle {
                        constructor(name, of) {
                            super(name, null, of);
                        }
                    }
                    condition_1.ParticleReference = ParticleReference;
                    class DetailedParticleReference {
                        constructor(particleReference, query) {
                            this.particleReference = particleReference;
                            this.query = query;
                            this.className = constants.DetailedParticleReference;
                        }
                    }
                    condition_1.DetailedParticleReference = DetailedParticleReference;
                    class ReceivedParticleReference extends Particle {
                        constructor() {
                            super(being.interaction.constants.ReceivedParticleReference, null, null);
                        }
                    }
                    condition_1.ReceivedParticleReference = ReceivedParticleReference;
                    class DateTemplate extends Date {
                        constructor(year, month, day) {
                            super(year, month, day);
                            this.className = constants.DateTemplate;
                        }
                    }
                    condition_1.DateTemplate = DateTemplate;
                    class ClockTemplate extends Clock {
                        constructor(hour, minute, second) {
                            super(hour, minute, second);
                            this.className = constants.ClockTemplate;
                        }
                    }
                    condition_1.ClockTemplate = ClockTemplate;
                    class TimeTemplate {
                        constructor(dateTemplate, clockTemplate) {
                            this.dateTemplate = dateTemplate;
                            this.clockTemplate = clockTemplate;
                            this.className = constants.TimeTemplate;
                        }
                    }
                    condition_1.TimeTemplate = TimeTemplate;
                    class StaticTools {
                        addOperandAndParameter(phrase, operand, parameter) {
                            phrase.stack.push(operand, parameter);
                        }
                    }
                    condition_1.StaticTools = StaticTools;
                    class Executor {
                        constructor(particles) {
                            this.particles = particles;
                        }
                        executeLogicalPhrase(logicalPhrase, receivedParticle) {
                            var stack = logicalPhrase.stack;
                            var result = this.execute(stack.shift(), receivedParticle);
                            var operator = stack.shift();
                            do {
                                let operand2 = this.execute(stack.shift(), receivedParticle);
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
                        execute(condition, receivedParticle) {
                            let result = condition;
                            if (typeof condition === "string" || typeof condition === "number") {
                                result = condition;
                            }
                            if (euglena.js.Class.instanceOf(new Particle("Reference", true, "mine"), condition)) {
                                result = condition.name === interaction.constants.ReceivedParticleReference ? receivedParticle.content : this.executeParticleReference(condition);
                            }
                            else {
                                switch (condition.className) {
                                    case constants.DoesParticalExist:
                                        result = this.executeDoesParticleExists(condition, receivedParticle);
                                        break;
                                    case constants.DetailedParticleReference:
                                        result = this.executeDetailedParticle(condition, receivedParticle);
                                        break;
                                    case constants.LogicalPhrase:
                                        result = this.executeLogicalPhrase(condition, receivedParticle);
                                        break;
                                    case constants.CalculationPhrase:
                                        result = this.executeCalculationPhrase(condition, receivedParticle);
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
                                        result = this.executeComparison(condition, receivedParticle);
                                        break;
                                }
                            }
                            return result;
                        }
                        executeComparison(comparison, receivedParticle) {
                            let result = false;
                            let operand1 = this.execute(comparison.operand1, receivedParticle);
                            let operator = comparison.operator;
                            let operand2 = this.execute(comparison.operand2, receivedParticle);
                            switch (comparison.className) {
                                case constants.NumberComparison:
                                    let number1 = Number(operand1);
                                    let number2 = Number(operand2);
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
                                    let string1 = String(operand1);
                                    let string2 = String(operand2);
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
                                    let time1 = operand1;
                                    let time2 = operand2;
                                    switch (comparison.operator) {
                                        case condition.operator.ComparisonOperator.BIGGERTHAN:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.BIGGERTHAN, time2.date), receivedParticle) ? true :
                                                this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.SMALLERTHAN, time2.date), receivedParticle) ? false :
                                                    this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.BIGGERTHAN, time2.clock), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.EQUAL:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.EQUAL, time2.date), receivedParticle) &&
                                                this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.EQUAL, time2.clock), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.NOTEQUAL:
                                            result = !this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLERTHAN:
                                            result = this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.SMALLERTHAN, time2.date), receivedParticle) ? true :
                                                this.execute(new DateComparison(time1.date, condition.operator.ComparisonOperator.BIGGERTHAN, time2.date), receivedParticle) ? false :
                                                    this.execute(new ClockComparison(time1.clock, condition.operator.ComparisonOperator.SMALLERTHAN, time2.clock), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.BIGEQUAL:
                                            result = this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.BIGGERTHAN, time2), receivedParticle) ||
                                                this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.SMALLERTHAN, time2), receivedParticle) ||
                                                this.execute(new TimeComparison(time1, condition.operator.ComparisonOperator.EQUAL, time2), receivedParticle);
                                            break;
                                    }
                                    break;
                                case constants.DateComparison:
                                    let date1 = operand1;
                                    let date2 = operand2;
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
                                            result = this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.BIGGERTHAN, date2), receivedParticle) ||
                                                this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.EQUAL, date2), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.SMALLERTHAN, date2), receivedParticle) ||
                                                this.execute(new DateComparison(date1, condition.operator.ComparisonOperator.EQUAL, date2), receivedParticle);
                                            break;
                                    }
                                    break;
                                case constants.ClockComparison:
                                    let clock1 = operand1;
                                    let clock2 = operand2;
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
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.BIGGERTHAN, clock2), receivedParticle) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2), receivedParticle);
                                            break;
                                        case condition.operator.ComparisonOperator.SMALLEQUAL:
                                            result = this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.SMALLERTHAN, clock2), receivedParticle) ||
                                                this.execute(new ClockComparison(clock1, condition.operator.ComparisonOperator.EQUAL, clock2), receivedParticle);
                                            break;
                                    }
                                    break;
                                case constants.DateTemplateComparison:
                                    let dateTemplate = null;
                                    let date = null;
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
                                    let clockTemplate = null;
                                    let clock = null;
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
                                    let timeTemplate = null;
                                    let time = null;
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
                                            result = timeTemplate.dateTemplate ? this.execute(new DateTemplateComparison(timeTemplate.dateTemplate, condition.operator.TemplateOperator.COVER, time.date), receivedParticle) : true;
                                            result = result && (timeTemplate.clockTemplate ? this.execute(new ClockTemplateComparison(timeTemplate.clockTemplate, condition.operator.TemplateOperator.COVER, time.clock), receivedParticle) : true);
                                            break;
                                    }
                                    break;
                            }
                            return result;
                        }
                        executeDoesParticleExists(doesParticleExist, receivedParticle) {
                            let returnValue = false;
                            if (typeof doesParticleExist.of === "string") {
                                returnValue = this.particles[doesParticleExist.name] ? true : false;
                            }
                            else if (typeof doesParticleExist.of === "object") {
                                let of = this.execute(doesParticleExist.of, receivedParticle);
                                returnValue = this.particles[doesParticleExist.name] ? true : false;
                            }
                            return returnValue;
                        }
                        executeCalculationPhrase(calculationPhrase, receivedParticle) {
                            var stack = calculationPhrase.stack;
                            //get multiplication and division manipulations first
                            //for(let item of calculationPhrase.stack){
                            //}
                            var result = this.execute(stack.shift(), receivedParticle);
                            var operator = stack.shift();
                            do {
                                let operand2 = this.execute(stack.shift(), receivedParticle);
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
                        executeParticleReference(particle) {
                            return this.particles[particle.name].content;
                        }
                        executeDetailedParticle(detailedParticleReference, receivedParticle) {
                            let details = detailedParticleReference.query.split(".");
                            let obj = null;
                            if (detailedParticleReference.particleReference.name === interaction.constants.ReceivedParticleReference) {
                                obj = receivedParticle;
                                details.shift(); //remove this
                                for (let prop of details) {
                                    obj = obj[prop];
                                }
                            }
                            else {
                                obj = this.executeParticleReference(detailedParticleReference.particleReference);
                            }
                            return obj;
                        }
                    }
                    condition_1.Executor = Executor;
                    class Phrase {
                        constructor(className, operand1, operator, operand2) {
                            this.className = className;
                            this.operand1 = operand1;
                            this.operator = operator;
                            this.operand2 = operand2;
                            this.stack.push(operand1, operator, operand2);
                        }
                    }
                    condition_1.Phrase = Phrase;
                    class LogicalPhrase extends Phrase {
                        constructor(operand1, operator, operand2) {
                            super(constants.LogicalPhrase, operand1, operator, operand2);
                        }
                    }
                    condition_1.LogicalPhrase = LogicalPhrase;
                    class Comparison {
                        constructor(className, operand1, operator, operand2) {
                            this.className = className;
                            this.operand1 = operand1;
                            this.operator = operator;
                            this.operand2 = operand2;
                        }
                    }
                    condition_1.Comparison = Comparison;
                    class NumberComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.NumberComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.NumberComparison = NumberComparison;
                    class StringComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.StringComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.StringComparison = StringComparison;
                    class TimeComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.TimeComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.TimeComparison = TimeComparison;
                    class DateComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.DateComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.DateComparison = DateComparison;
                    class ClockComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.ClockComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.ClockComparison = ClockComparison;
                    class TimeTemplateComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.TimeTemplateComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.TimeTemplateComparison = TimeTemplateComparison;
                    class DateTemplateComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.DateTemplateComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.DateTemplateComparison = DateTemplateComparison;
                    class ClockTemplateComparison extends Comparison {
                        constructor(operand1, operator, operand2) {
                            super(constants.ClockTemplateComparison, operand1, operator, operand2);
                        }
                    }
                    condition_1.ClockTemplateComparison = ClockTemplateComparison;
                    class CalculationPhrase extends Phrase {
                        constructor(operand1, operator, operand2) {
                            super(constants.CalculationPhrase, operand1, operator, operand2);
                        }
                    }
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
                constants.EuglenaInfo = "EuglenaInfo";
                var particles;
                (function (particles) {
                    particles.EuglenaName = "EuglenaName";
                })(particles = constants.particles || (constants.particles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            class Organelle {
                constructor(name, className, nucleus, saveParticle, initialProperties) {
                    this.name = name;
                    this.className = className;
                    this.nucleus = nucleus;
                    this.saveParticle = saveParticle;
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
            class Euglena {
                constructor(chromosome, particles) {
                    this.chromosome = chromosome;
                    this.particles = particles;
                    this.garbageCollector = null;
                    this.executor = null;
                    this.organelles = {};
                    this.executor = new euglena.being.alive.dna.condition.Executor(this.particles);
                    this.garbageCollector = new GarbageCollector(this.chromosome);
                    this.garbageCollector.start();
                }
                static generateInstance(chromosome, particles) {
                    if (!Euglena.instance) {
                        Euglena.instance = new Euglena(chromosome, particles);
                    }
                    return Euglena.instance;
                }
                addGene(gene) {
                    this.chromosome.push(gene);
                }
                receiveParticle(particle) {
                    console.log("received Particle: " + particle.name);
                    for (var i = 0; i < Euglena.instance.chromosome.length; i++) {
                        if (sys.type.StaticTools.Array.contains(Euglena.instance.chromosome[i].triggers, particle.name) &&
                            (Euglena.instance.chromosome[i].condition ? Euglena.instance.executor.execute(Euglena.instance.chromosome[i].condition, particle) : true)) {
                            var reaction = Euglena.instance.chromosome[i].reaction;
                            var parameters = Euglena.instance.chromosome[i].parameters;
                            var particles = Euglena.instance.particles;
                            var organelles = Euglena.instance.organelles;
                            var receiveParticle = Euglena.instance.receiveParticle;
                            console.log("triggering gene " + Euglena.instance.chromosome[i].name);
                            reaction(particle, Euglena.instance, parameters);
                        }
                    }
                }
                getParticle(particleReference) {
                    let index = Euglena.instance.indexOfParticle(particleReference);
                    return index >= 0 ? Euglena.instance.particles[index] : null;
                }
                indexOfParticle(particleReference) {
                    for (let i = 0; i < Euglena.instance.particles.length; i++) {
                        if (Euglena.instance.particles[i].name === particleReference.name && Euglena.instance.particles[i].of === particleReference.of) {
                            return i;
                        }
                    }
                    return -1;
                }
                saveParticle(particle) {
                    let index = Euglena.instance.indexOfParticle(particle);
                    if (index >= 0) {
                        Euglena.instance.particles[index] = particle;
                    }
                    else {
                        Euglena.instance.particles.push(particle);
                    }
                }
                getOrganelle(organelleName) {
                    return Euglena.instance.organelles[organelleName];
                }
                setOrganelle(organelle) {
                    organelle.nucleus = Euglena.instance;
                    organelle.saveParticle = Euglena.instance.saveParticle;
                    Euglena.instance.organelles[organelle.name] = organelle;
                }
            }
            Euglena.instance = null;
            alive.Euglena = Euglena;
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