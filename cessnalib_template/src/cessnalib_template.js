var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by codelovesme on 6/19/2015.
 */
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib");
var path = require("path");
var fs = require("fs");
var jsonminify = require("jsonminify");
var cessnalib_template;
(function (cessnalib_template) {
    var reference;
    (function (reference) {
        var being;
        (function (being) {
            being.Particle = new cessnalib_1.cessnalib.being.Particle("Reference Particle", true);
        })(being = reference.being || (reference.being = {}));
    })(reference = cessnalib_template.reference || (cessnalib_template.reference = {}));
    var injection;
    (function (injection) {
        var StaticTools = (function () {
            function StaticTools() {
            }
            StaticTools.readConfigFile = function (applicationDirectory) {
                var readConfigFile = fs.readFileSync(path.join(path.resolve(applicationDirectory), "config.json"), "utf8");
                return JSON.parse(jsonminify(readConfigFile));
            };
            return StaticTools;
        })();
        injection.StaticTools = StaticTools;
    })(injection = cessnalib_template.injection || (cessnalib_template.injection = {}));
    var being;
    (function (being) {
        var alive;
        (function (alive) {
            var Gene = cessnalib_1.cessnalib.being.alive.dna.Gene;
            var RegularlyTriggeredGene = (function (_super) {
                __extends(RegularlyTriggeredGene, _super);
                function RegularlyTriggeredGene(className, timeSpan, reaction) {
                    _super.call(this, className, [constants.particles.Time], reaction);
                    this.className = className;
                    this.reaction = reaction;
                }
                return RegularlyTriggeredGene;
            })(Gene);
            alive.RegularlyTriggeredGene = RegularlyTriggeredGene;
            var constants;
            (function (constants) {
                var particles;
                (function (particles) {
                    particles.EuglenaName = "cessnalib_template.being.alive.particles.EuglenaName";
                    particles.EuglenaHasBeenBorn = "cessnalib_template.being.alive.particles.EuglenaHasBeenBorn";
                    particles.Acknowledge = "cessnalib_template.being.alive.particles.Acknowledge";
                    particles.ExceptionOccurred = "cessnalib_template.being.alive.particles.ExceptionOccurred";
                    particles.Time = "cessnalib_template.being.alive.particles.Time";
                })(particles = constants.particles || (constants.particles = {}));
                var organelles;
                (function (organelles) {
                    organelles.WebParticleTransmitterOrganelle = "cessnalib_template.being.alive.organelles.WebParticleTransmitterOrganelle";
                    organelles.WebParticleThrowerOrganelle = "cessnalib_template.being.alive.organelles.WebParticleThrowerOrganelle";
                    organelles.WebReceptionOrganelle = "cessnalib_template.being.alive.organelles.WebReceptionOrganelle";
                    organelles.TimeOrganelle = "cessnalib_template.being.alive.organelles.TimeOrganelle";
                })(organelles = constants.organelles || (constants.organelles = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var organelles;
            (function (organelles) {
                var Limb = cessnalib_1.cessnalib.being.alive.Limb;
                var Organelle = cessnalib_1.cessnalib.being.alive.Organelle;
                var TimeOrganelle = (function (_super) {
                    __extends(TimeOrganelle, _super);
                    function TimeOrganelle() {
                        _super.call(this, constants.organelles.TimeOrganelle);
                    }
                    return TimeOrganelle;
                })(Organelle);
                organelles.TimeOrganelle = TimeOrganelle;
                var WebParticleThrowerOrganelle = (function (_super) {
                    __extends(WebParticleThrowerOrganelle, _super);
                    function WebParticleThrowerOrganelle() {
                        _super.call(this, constants.organelles.WebParticleThrowerOrganelle);
                    }
                    return WebParticleThrowerOrganelle;
                })(Limb);
                organelles.WebParticleThrowerOrganelle = WebParticleThrowerOrganelle;
                var WebParticleTransmitterOrganelle = (function (_super) {
                    __extends(WebParticleTransmitterOrganelle, _super);
                    function WebParticleTransmitterOrganelle() {
                        _super.call(this, constants.organelles.WebParticleTransmitterOrganelle);
                    }
                    return WebParticleTransmitterOrganelle;
                })(Limb);
                organelles.WebParticleTransmitterOrganelle = WebParticleTransmitterOrganelle;
                var WebReceptionOrganelle = (function (_super) {
                    __extends(WebReceptionOrganelle, _super);
                    function WebReceptionOrganelle() {
                        _super.call(this, constants.organelles.WebReceptionOrganelle);
                    }
                    return WebReceptionOrganelle;
                })(Organelle);
                organelles.WebReceptionOrganelle = WebReceptionOrganelle;
            })(organelles = alive.organelles || (alive.organelles = {}));
            var particles;
            (function (particles) {
                var Time = (function (_super) {
                    __extends(Time, _super);
                    function Time(content) {
                        _super.call(this, constants.particles.Time, content);
                    }
                    return Time;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.Time = Time;
                var EuglenaHasBeenBorn = (function (_super) {
                    __extends(EuglenaHasBeenBorn, _super);
                    function EuglenaHasBeenBorn() {
                        _super.call(this, constants.particles.EuglenaHasBeenBorn, true);
                    }
                    return EuglenaHasBeenBorn;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.EuglenaHasBeenBorn = EuglenaHasBeenBorn;
                var Acknowledge = (function (_super) {
                    __extends(Acknowledge, _super);
                    function Acknowledge() {
                        _super.apply(this, arguments);
                        this.className = constants.particles.Acknowledge;
                        this.content = true;
                    }
                    return Acknowledge;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.Acknowledge = Acknowledge;
                var ExceptionOccurred = (function (_super) {
                    __extends(ExceptionOccurred, _super);
                    function ExceptionOccurred(content) {
                        _super.call(this, constants.particles.ExceptionOccurred, content);
                    }
                    return ExceptionOccurred;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.ExceptionOccurred = ExceptionOccurred;
            })(particles = alive.particles || (alive.particles = {}));
            var StaticTools = (function () {
                function StaticTools() {
                }
                StaticTools.createEuglena = function (applicationDirectory, organelleBank) {
                    var euglena = new cessnalib_1.cessnalib.being.alive.Euglena();
                    var initialConfig = injection.StaticTools.readConfigFile(applicationDirectory);
                    for (var _i = 0, _a = initialConfig.objects; _i < _a.length; _i++) {
                        var objectProp = _a[_i];
                        var organelle = organelleBank.get(cessnalib_1.cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        euglena.addOrganelle(organelle);
                        organelle.seed = euglena;
                    }
                    for (var _b = 0, _c = initialConfig.values; _b < _c.length; _b++) {
                        var valueChooser = _c[_b];
                        euglena.receiveParticle(new cessnalib_1.cessnalib.being.Particle(valueChooser.className, cessnalib_1.cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser)));
                    }
                    euglena.receiveParticle(new particles.EuglenaHasBeenBorn());
                    return euglena;
                };
                return StaticTools;
            })();
            alive.StaticTools = StaticTools;
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib_template.being || (cessnalib_template.being = {}));
})(cessnalib_template = exports.cessnalib_template || (exports.cessnalib_template = {}));
//# sourceMappingURL=cessnalib_template.js.map