"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
var cessnalib_1 = require("cessnalib");
exports.JavascriptDate = Date;
exports.JavascriptObject = Object;
var ParticleV1 = (function () {
    function ParticleV1(meta, data) {
        this.meta = meta;
        this.data = data;
    }
    return ParticleV1;
}());
exports.ParticleV1 = ParticleV1;
var ParticleV2 = (function () {
    function ParticleV2(meta, data) {
        this.meta = meta;
        this.data = data;
    }
    return ParticleV2;
}());
exports.ParticleV2 = ParticleV2;
var MetaV2 = (function () {
    function MetaV2(name, of, expireTime) {
        this.name = name;
        this.of = of;
        this.version = StaticTools.Particle.Versions.v2;
        this.createTime = new exports.JavascriptDate().getTime();
        if (expireTime)
            this.expireTime = expireTime;
    }
    return MetaV2;
}());
exports.MetaV2 = MetaV2;
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
})(StaticTools = exports.StaticTools || (exports.StaticTools = {}));
var interaction;
(function (interaction) {
    var Impact = (function (_super) {
        __extends(Impact, _super);
        function Impact(particle, token, of) {
            return _super.call(this, new MetaV2("Impact", of), { particle: particle, token: token }) || this;
        }
        return Impact;
    }(ParticleV2));
    interaction.Impact = Impact;
    var constants;
    (function (constants) {
        constants.ReceivedParticleReference = "ReceivedParticleReference";
    })(constants = interaction.constants || (interaction.constants = {}));
})(interaction = exports.interaction || (exports.interaction = {}));
var alive;
(function (alive) {
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
            function GeneV2(name, triggers, reaction, of, override, expireTime) {
                return _super.call(this, new MetaV2(constants.particles.Gene, of, expireTime), { name: name, triggers: triggers, reaction: reaction, override: override }) || this;
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
                    var now = cessnalib_1.sys.type.StaticTools.Time.now();
                    var nowDigit = new exports.JavascriptDate().getTime();
                    var doesExpire = function (ai) {
                        return (!ai.meta.version || ai.meta.version === StaticTools.Particle.Versions.v1) ?
                            (ai.meta.expiretime && cessnalib_1.sys.type.StaticTools.Time.biggerThan(now, ai.meta.expiretime)) :
                            (ai.meta.version === StaticTools.Particle.Versions.v2 ?
                                (ai.meta.expireTime && ai.meta.expireTime <= nowDigit) : false);
                    };
                    cessnalib_1.sys.type.StaticTools.Array.removeAllMatched(_this.chromosome, null, doesExpire);
                    //process particles
                    cessnalib_1.sys.type.StaticTools.Array.removeAllMatched(_this.particles, null, doesExpire);
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
        function Organelle(name, send) {
            this.name = name;
            this.send = send;
            var this_ = this;
            this.actions = new cessnalib_1.sys.type.Map();
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
            Cytoplasm.particles.push(new ParticleV2(new MetaV2(alive.constants.particles.Chromosome, euglenaName), chromosome));
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
                return Cytoplasm.getParticle({ meta: { name: alive.constants.particles.Chromosome } }).data;
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
                if (cessnalib_1.js.Class.doesMongoCover(particle, triggers)) {
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
                    if (!cessnalib_1.sys.type.StaticTools.Array.containsArray(tr2.triggers, tr.triggers))
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
                //} catch (e) {
                //  console.log(e);
                //response(new euglena_template.being.alive.particles.Exception(new euglena.sys.type.Exception(e.message), this.name));
                //}
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
            var index = cessnalib_1.sys.type.StaticTools.Array.indexOf(Cytoplasm.particles, particle.meta, function (tt, m) { return cessnalib_1.sys.type.StaticTools.Object.equals(tt.meta, m); });
            if (index >= 0) {
                Cytoplasm.particles[index] = particle;
            }
            else {
                Cytoplasm.particles.push(particle);
            }
        };
        Cytoplasm.removeParticles = function (query) {
            return cessnalib_1.sys.type.StaticTools.Array.removeAllMatched(Cytoplasm.particles, query, function (ai, t) { return cessnalib_1.js.Class.doesMongoCover(ai, query); });
        };
        Cytoplasm.getParticle = function (query) {
            for (var _i = 0, _a = Cytoplasm.particles; _i < _a.length; _i++) {
                var p = _a[_i];
                if (cessnalib_1.js.Class.doesMongoCover(p, query)) {
                    return p;
                }
            }
            return null;
        };
        Cytoplasm.getParticles = function (query) {
            var returnList = Array();
            for (var _i = 0, _a = Cytoplasm.particles; _i < _a.length; _i++) {
                var p = _a[_i];
                if (cessnalib_1.js.Class.doesMongoCover(p, query)) {
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
})(alive = exports.alive || (exports.alive = {}));
//# sourceMappingURL=index.js.map