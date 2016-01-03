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
var cessnalib_template;
(function (cessnalib_template) {
    var injection;
    (function (injection) {
        var StaticTools = (function () {
            function StaticTools() {
            }
            StaticTools.readConfigFile = function () {
                var readConfigFile = fs.readFileSync(path.join(path.resolve(__dirname), "config.json"), "utf8");
                return JSON.parse(readConfigFile);
            };
            return StaticTools;
        })();
        injection.StaticTools = StaticTools;
    })(injection = cessnalib_template.injection || (cessnalib_template.injection = {}));
    var being;
    (function (being) {
        var alive;
        (function (alive) {
            var Euglena = (function (_super) {
                __extends(Euglena, _super);
                function Euglena() {
                    var chromosome = new Array();
                    chromosome.push(new cessnalib_1.cessnalib.being.alive.dna.Gene("WhenEuglenaHasBeenBorn", [constants.particles.EuglenaHasBeenBorn], function (triggerParticle, particles, organelles) {
                        var timeOrganelle = organelles[constants.organelles.TimeOrganelle];
                        timeOrganelle.fetchCurrentTime();
                    }));
                    _super.call(this, chromosome);
                }
                return Euglena;
            })(cessnalib_1.cessnalib.being.alive.Euglena);
            alive.Euglena = Euglena;
            var constants;
            (function (constants) {
                var particles;
                (function (particles) {
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
                var Time = (function () {
                    function Time(content) {
                        this.content = content;
                        this.className = constants.particles.Time;
                    }
                    return Time;
                })();
                particles.Time = Time;
                var EuglenaHasBeenBorn = (function () {
                    function EuglenaHasBeenBorn() {
                        this.className = constants.particles.EuglenaHasBeenBorn;
                        this.content = true;
                    }
                    return EuglenaHasBeenBorn;
                })();
                particles.EuglenaHasBeenBorn = EuglenaHasBeenBorn;
                var Acknowledge = (function () {
                    function Acknowledge() {
                        this.className = constants.particles.Acknowledge;
                        this.content = true;
                    }
                    return Acknowledge;
                })();
                particles.Acknowledge = Acknowledge;
                var ExceptionOccurred = (function () {
                    function ExceptionOccurred(content) {
                        this.content = content;
                        this.className = constants.particles.ExceptionOccurred;
                    }
                    return ExceptionOccurred;
                })();
                particles.ExceptionOccurred = ExceptionOccurred;
            })(particles = alive.particles || (alive.particles = {}));
            var StaticTools = (function () {
                function StaticTools() {
                }
                StaticTools.createEuglena = function (injectionBank) {
                    var euglena = new Euglena();
                    var initialConfig = injection.StaticTools.readConfigFile();
                    euglena.receiveParticle(new particles.EuglenaHasBeenBorn());
                    for (var _i = 0, _a = initialConfig.objects; _i < _a.length; _i++) {
                        var objectProp = _a[_i];
                        var organelle = injectionBank.get(cessnalib_1.cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        euglena.addOrganelle(organelle);
                    }
                    for (var _b = 0, _c = initialConfig.values; _b < _c.length; _b++) {
                        var valueChooser = _c[_b];
                        euglena.receiveParticle(new cessnalib_1.cessnalib.being.Particle(valueChooser.className, cessnalib_1.cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser)));
                    }
                };
                return StaticTools;
            })();
            alive.StaticTools = StaticTools;
        })(alive = being.alive || (being.alive = {}));
    })(being = cessnalib_template.being || (cessnalib_template.being = {}));
})(cessnalib_template = exports.cessnalib_template || (exports.cessnalib_template = {}));
//# sourceMappingURL=cessnalib_template.js.map