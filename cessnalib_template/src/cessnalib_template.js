var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="C:/git/me.codeloves/cessnalib/cessnalib/typings/node/node.d.ts" />
/**
 * Created by codelovesme on 6/19/2015.
 */
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib");
var path = require("path");
var fs = require("fs");
var jsonminify = require("jsonminify");
var interaction = cessnalib_1.cessnalib.being.interaction;
var cessnalib_template;
(function (cessnalib_template) {
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
        var particles;
        (function (particles) {
            var BooleanParticle = (function (_super) {
                __extends(BooleanParticle, _super);
                function BooleanParticle(className, content) {
                    _super.call(this, className, content);
                }
                return BooleanParticle;
            })(cessnalib_1.cessnalib.being.Particle);
            particles.BooleanParticle = BooleanParticle;
            var VoidParticle = (function (_super) {
                __extends(VoidParticle, _super);
                function VoidParticle(name) {
                    _super.call(this, name, null);
                }
                return VoidParticle;
            })(cessnalib_1.cessnalib.being.Particle);
            particles.VoidParticle = VoidParticle;
        })(particles = being.particles || (being.particles = {}));
        var alive;
        (function (alive) {
            var Particle = cessnalib_1.cessnalib.being.Particle;
            var constants;
            (function (constants) {
                var particles;
                (function (particles) {
                    particles.EuglenaName = "EuglenaName";
                    particles.EuglenaInfos = "EuglenaInfos";
                    particles.ImpactReceived = "ImpactReceived";
                    particles.EuglenaHasBeenBorn = "EuglenaHasBeenBorn";
                    particles.Acknowledge = "Acknowledge";
                    particles.Time = "Time";
                    particles.Exception = "Exception";
                    particles.ConnectedToTheInternet = "ConnectedToTheInternet";
                })(particles = constants.particles || (constants.particles = {}));
                var organelles;
                (function (organelles) {
                    organelles.ImpactTransmitterOrganelle = "ImpactTransmitterOrganelle";
                    organelles.ImpactThrowerOrganelle = "ImpactThrowerOrganelle";
                    organelles.ReceptionOrganelle = "ReceptionOrganelle";
                    organelles.TimeOrganelle = "TimeOrganelle";
                    organelles.WebOrganelle = "WebOrganelle";
                    organelles.DbOrganelle = "DbOrganelle";
                })(organelles = constants.organelles || (constants.organelles = {}));
                var impacts;
                (function (impacts) {
                    impacts.FetchImpacts = "FetchImpacts";
                    impacts.TimeChanged = "TimeChanged";
                    impacts.ExceptionOccurred = "ExceptionOccurred";
                })(impacts = constants.impacts || (constants.impacts = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var organelles;
            (function (organelles) {
                var Organelle = cessnalib_1.cessnalib.being.alive.Organelle;
                var TimeOrganelle = (function (_super) {
                    __extends(TimeOrganelle, _super);
                    function TimeOrganelle() {
                        _super.call(this, alive.constants.organelles.TimeOrganelle);
                    }
                    return TimeOrganelle;
                })(Organelle);
                organelles.TimeOrganelle = TimeOrganelle;
                var ImpactThrowerOrganelle = (function (_super) {
                    __extends(ImpactThrowerOrganelle, _super);
                    function ImpactThrowerOrganelle() {
                        _super.call(this, constants.organelles.ImpactThrowerOrganelle);
                    }
                    return ImpactThrowerOrganelle;
                })(Organelle);
                organelles.ImpactThrowerOrganelle = ImpactThrowerOrganelle;
                var ImpactTransmitterOrganelle = (function (_super) {
                    __extends(ImpactTransmitterOrganelle, _super);
                    function ImpactTransmitterOrganelle() {
                        _super.call(this, alive.constants.organelles.ImpactTransmitterOrganelle);
                    }
                    return ImpactTransmitterOrganelle;
                })(Organelle);
                organelles.ImpactTransmitterOrganelle = ImpactTransmitterOrganelle;
                var ReceptionOrganelle = (function (_super) {
                    __extends(ReceptionOrganelle, _super);
                    function ReceptionOrganelle() {
                        _super.call(this, constants.organelles.ReceptionOrganelle);
                    }
                    return ReceptionOrganelle;
                })(Organelle);
                organelles.ReceptionOrganelle = ReceptionOrganelle;
                var WebOrganelle = (function (_super) {
                    __extends(WebOrganelle, _super);
                    function WebOrganelle() {
                        _super.call(this, constants.organelles.WebOrganelle);
                    }
                    return WebOrganelle;
                })(Organelle);
                organelles.WebOrganelle = WebOrganelle;
                var DbOrganelle = (function (_super) {
                    __extends(DbOrganelle, _super);
                    function DbOrganelle() {
                        _super.call(this, constants.organelles.DbOrganelle);
                    }
                    return DbOrganelle;
                })(Organelle);
                organelles.DbOrganelle = DbOrganelle;
            })(organelles = alive.organelles || (alive.organelles = {}));
            var particles;
            (function (particles) {
                var Exception = (function (_super) {
                    __extends(Exception, _super);
                    function Exception(content) {
                        _super.call(this, constants.particles.Exception, content);
                    }
                    return Exception;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.Exception = Exception;
                var Time = (function (_super) {
                    __extends(Time, _super);
                    function Time(content) {
                        _super.call(this, constants.particles.Time, content);
                    }
                    return Time;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.Time = Time;
                var Acknowledge = (function (_super) {
                    __extends(Acknowledge, _super);
                    function Acknowledge() {
                        _super.call(this, constants.particles.Acknowledge);
                    }
                    return Acknowledge;
                })(being.particles.VoidParticle);
                particles.Acknowledge = Acknowledge;
                var ConnectedToTheInternet = (function (_super) {
                    __extends(ConnectedToTheInternet, _super);
                    function ConnectedToTheInternet(content) {
                        _super.call(this, constants.particles.ConnectedToTheInternet, content);
                    }
                    return ConnectedToTheInternet;
                })(being.particles.BooleanParticle);
                particles.ConnectedToTheInternet = ConnectedToTheInternet;
                var EuglenaHasBeenBorn = (function (_super) {
                    __extends(EuglenaHasBeenBorn, _super);
                    function EuglenaHasBeenBorn() {
                        _super.call(this, constants.particles.EuglenaHasBeenBorn, true);
                    }
                    return EuglenaHasBeenBorn;
                })(being.particles.BooleanParticle);
                particles.EuglenaHasBeenBorn = EuglenaHasBeenBorn;
                var FetchImpacts = (function (_super) {
                    __extends(FetchImpacts, _super);
                    function FetchImpacts(from) {
                        _super.call(this, constants.impacts.FetchImpacts, from);
                        this.from = from;
                    }
                    return FetchImpacts;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.FetchImpacts = FetchImpacts;
                var ImpactReceived = (function (_super) {
                    __extends(ImpactReceived, _super);
                    function ImpactReceived(content) {
                        _super.call(this, constants.particles.ImpactReceived, content);
                        this.content = content;
                    }
                    return ImpactReceived;
                })(cessnalib_1.cessnalib.being.Particle);
                particles.ImpactReceived = ImpactReceived;
            })(particles = alive.particles || (alive.particles = {}));
            var StaticTools = (function () {
                function StaticTools() {
                }
                StaticTools.instantiateEuglena = function (applicationDirectory, organelleBank, chromosome) {
                    var initialConfig = injection.StaticTools.readConfigFile(applicationDirectory);
                    var particles = {};
                    for (var _i = 0, _a = initialConfig.values; _i < _a.length; _i++) {
                        var valueChooser = _a[_i];
                        particles[valueChooser.className] = new Particle(valueChooser.className, cessnalib_1.cessnalib.injection.StaticTools.valueOfValueChooser(valueChooser));
                    }
                    var organelles = {};
                    var euglenaName = particles[cessnalib_1.cessnalib.being.alive.constants.particles.EuglenaName].content;
                    var impactGenerator = new interaction.ImpactGenerator(euglenaName);
                    for (var _b = 0, _c = initialConfig.objects; _b < _c.length; _b++) {
                        var objectProp = _c[_b];
                        var organelle = organelleBank.get(cessnalib_1.cessnalib.injection.StaticTools.valueOfValueChooser(objectProp.class));
                        organelle.initialProperties = objectProp.initialProperties;
                        organelle.impactGenerator = impactGenerator;
                        organelles[organelle.name] = organelle;
                    }
                    var euglena = cessnalib_1.cessnalib.being.alive.Euglena.generateInstance(chromosome, particles, organelles, impactGenerator);
                    euglena.receiveParticle(new cessnalib_template.being.alive.particles.EuglenaHasBeenBorn());
                    return euglena;
                };
                return StaticTools;
            })();
            alive.StaticTools = StaticTools;
        })(alive = being.alive || (being.alive = {}));
        var ghost;
        (function (ghost) {
            var euglena;
            (function (euglena) {
                var impactthrower;
                (function (impactthrower) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var ThrowImpact = (function (_super) {
                            __extends(ThrowImpact, _super);
                            function ThrowImpact(content) {
                                _super.call(this, constants.incomingparticles.ThrowImpact, content);
                            }
                            return ThrowImpact;
                        })(cessnalib_1.cessnalib.being.Particle);
                        incomingparticles.ThrowImpact = ThrowImpact;
                    })(incomingparticles = impactthrower.incomingparticles || (impactthrower.incomingparticles = {}));
                    var constants;
                    (function (constants) {
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.ThrowImpact = "ThrowImpact";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = impactthrower.constants || (impactthrower.constants = {}));
                })(impactthrower = euglena.impactthrower || (euglena.impactthrower = {}));
                var reception;
                (function (reception) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var Listen = (function (_super) {
                            __extends(Listen, _super);
                            function Listen() {
                                _super.call(this, constants.incomingparticles.Listen);
                            }
                            return Listen;
                        })(being.particles.VoidParticle);
                        incomingparticles.Listen = Listen;
                        var ThrowImpact = (function (_super) {
                            __extends(ThrowImpact, _super);
                            function ThrowImpact(content) {
                                _super.call(this, constants.incomingparticles.ThrowImpact, content);
                            }
                            return ThrowImpact;
                        })(cessnalib_1.cessnalib.being.Particle);
                        incomingparticles.ThrowImpact = ThrowImpact;
                    })(incomingparticles = reception.incomingparticles || (reception.incomingparticles = {}));
                    var outgoingparticles;
                    (function (outgoingparticles) {
                        var ImpactReceived = (function (_super) {
                            __extends(ImpactReceived, _super);
                            function ImpactReceived(impact) {
                                _super.call(this, constants.outgoingparticles.ImpactReceived, impact);
                            }
                            return ImpactReceived;
                        })(cessnalib_1.cessnalib.being.Particle);
                        outgoingparticles.ImpactReceived = ImpactReceived;
                    })(outgoingparticles = reception.outgoingparticles || (reception.outgoingparticles = {}));
                    var constants;
                    (function (constants) {
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.Listen = "Listen";
                            incomingparticles.ThrowImpact = "ThrowImpact";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                        var outgoingparticles;
                        (function (outgoingparticles) {
                            outgoingparticles.ImpactReceived = "ImpactReceived";
                        })(outgoingparticles = constants.outgoingparticles || (constants.outgoingparticles = {}));
                    })(constants = reception.constants || (reception.constants = {}));
                })(reception = euglena.reception || (euglena.reception = {}));
                var impacttransmitter;
                (function (impacttransmitter) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var ConnectToEuglena = (function (_super) {
                            __extends(ConnectToEuglena, _super);
                            function ConnectToEuglena(euglenaInfo) {
                                _super.call(this, constants.incomingparticles.ConnectToEuglena, euglenaInfo);
                            }
                            return ConnectToEuglena;
                        })(cessnalib_1.cessnalib.being.Particle);
                        incomingparticles.ConnectToEuglena = ConnectToEuglena;
                        var ThrowImpact = (function (_super) {
                            __extends(ThrowImpact, _super);
                            function ThrowImpact(content) {
                                _super.call(this, constants.incomingparticles.ThrowImpact, content);
                            }
                            return ThrowImpact;
                        })(cessnalib_1.cessnalib.being.Particle);
                        incomingparticles.ThrowImpact = ThrowImpact;
                    })(incomingparticles = impacttransmitter.incomingparticles || (impacttransmitter.incomingparticles = {}));
                    var constants;
                    (function (constants) {
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.ConnectToEuglena = "ConnectToEuglena";
                            incomingparticles.ThrowImpact = "ThrowImpact";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = impacttransmitter.constants || (impacttransmitter.constants = {}));
                })(impacttransmitter = euglena.impacttransmitter || (euglena.impacttransmitter = {}));
                var web;
                (function (web) {
                    var constants;
                    (function (constants) {
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.ReturnCurrentTime = "ReturnCurrentTime";
                            incomingparticles.ReturnIfConnectedToTheInternet = "ReturnIfConnectedToTheInternet";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = web.constants || (web.constants = {}));
                    var incomingparticles;
                    (function (incomingparticles) {
                        var VoidParticle = cessnalib_template.being.particles.VoidParticle;
                        var ReturnCurrentTime = (function (_super) {
                            __extends(ReturnCurrentTime, _super);
                            function ReturnCurrentTime() {
                                _super.call(this, constants.incomingparticles.ReturnCurrentTime);
                            }
                            return ReturnCurrentTime;
                        })(VoidParticle);
                        incomingparticles.ReturnCurrentTime = ReturnCurrentTime;
                        var ReturnIfConnectedToTheInternet = (function (_super) {
                            __extends(ReturnIfConnectedToTheInternet, _super);
                            function ReturnIfConnectedToTheInternet() {
                                _super.call(this, constants.incomingparticles.ReturnIfConnectedToTheInternet);
                            }
                            return ReturnIfConnectedToTheInternet;
                        })(VoidParticle);
                        incomingparticles.ReturnIfConnectedToTheInternet = ReturnIfConnectedToTheInternet;
                    })(incomingparticles = web.incomingparticles || (web.incomingparticles = {}));
                })(web = euglena.web || (euglena.web = {}));
                var time;
                (function (time_1) {
                    var Particle = cessnalib_1.cessnalib.being.Particle;
                    var incomingparticles;
                    (function (incomingparticles) {
                        var SetTime = (function (_super) {
                            __extends(SetTime, _super);
                            function SetTime(time) {
                                _super.call(this, constants.incomingparticles.SetTime, time);
                            }
                            return SetTime;
                        })(Particle);
                        incomingparticles.SetTime = SetTime;
                        var StartClock = (function (_super) {
                            __extends(StartClock, _super);
                            function StartClock() {
                                _super.call(this, constants.incomingparticles.StartClock);
                            }
                            return StartClock;
                        })(being.particles.VoidParticle);
                        incomingparticles.StartClock = StartClock;
                    })(incomingparticles = time_1.incomingparticles || (time_1.incomingparticles = {}));
                    var constants;
                    (function (constants) {
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.SetTime = "SetTime";
                            incomingparticles.StartClock = "StartClock";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = time_1.constants || (time_1.constants = {}));
                })(time = euglena.time || (euglena.time = {}));
                var db;
                (function (db) {
                    var Particle = cessnalib_1.cessnalib.being.Particle;
                    var incomingparticles;
                    (function (incomingparticles) {
                        var Save = (function (_super) {
                            __extends(Save, _super);
                            function Save() {
                                _super.call(this, constants.incomingparticles.Save, time);
                            }
                            return Save;
                        })(Particle);
                        incomingparticles.Save = Save;
                        var DoesTokenExist = (function (_super) {
                            __extends(DoesTokenExist, _super);
                            function DoesTokenExist(token) {
                                _super.call(this, constants.incomingparticles.DoesTokenExist, { token: token });
                            }
                            return DoesTokenExist;
                        })(Particle);
                        incomingparticles.DoesTokenExist = DoesTokenExist;
                    })(incomingparticles = db.incomingparticles || (db.incomingparticles = {}));
                    var outgoingparticles;
                    (function (outgoingparticles) {
                        var UserExists = (function (_super) {
                            __extends(UserExists, _super);
                            function UserExists(userId) {
                                _super.call(this, constants.outgoingparticles.UserExists, { userId: userId });
                            }
                            return UserExists;
                        })(cessnalib_1.cessnalib.being.Particle);
                        outgoingparticles.UserExists = UserExists;
                        var UserNotExists = (function (_super) {
                            __extends(UserNotExists, _super);
                            function UserNotExists(userId) {
                                _super.call(this, constants.outgoingparticles.UserNotExists, { userId: userId });
                            }
                            return UserNotExists;
                        })(cessnalib_1.cessnalib.being.Particle);
                        outgoingparticles.UserNotExists = UserNotExists;
                        var TokenIsValid = (function (_super) {
                            __extends(TokenIsValid, _super);
                            function TokenIsValid(token) {
                                _super.call(this, constants.outgoingparticles.TokenIsValid, { token: token });
                            }
                            return TokenIsValid;
                        })(cessnalib_1.cessnalib.being.Particle);
                        outgoingparticles.TokenIsValid = TokenIsValid;
                        var TokenIsNotValid = (function (_super) {
                            __extends(TokenIsNotValid, _super);
                            function TokenIsNotValid(token) {
                                _super.call(this, constants.outgoingparticles.TokenIsNotValid, { token: token });
                            }
                            return TokenIsNotValid;
                        })(cessnalib_1.cessnalib.being.Particle);
                        outgoingparticles.TokenIsNotValid = TokenIsNotValid;
                    })(outgoingparticles = db.outgoingparticles || (db.outgoingparticles = {}));
                    var constants;
                    (function (constants) {
                        var outgoingparticles;
                        (function (outgoingparticles) {
                            outgoingparticles.UserExists = "UserExists";
                            outgoingparticles.UserNotExists = "UserNotExists";
                            outgoingparticles.TokenIsValid = "TokenIsValid";
                            outgoingparticles.TokenIsNotValid = "TokenIsNotValid";
                        })(outgoingparticles = constants.outgoingparticles || (constants.outgoingparticles = {}));
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.Save = "Save";
                            incomingparticles.DoesTokenExist = "DoesTokenExist";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.Read = "Read";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.Remove = "Remove";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = db.constants || (db.constants = {}));
                })(db = euglena.db || (euglena.db = {}));
            })(euglena = ghost.euglena || (ghost.euglena = {}));
        })(ghost = being.ghost || (being.ghost = {}));
    })(being = cessnalib_template.being || (cessnalib_template.being = {}));
    var reference;
    (function (reference) {
        var being;
        (function (being) {
            being.Particle = new cessnalib_1.cessnalib.being.Particle("Reference Particle", true);
            var interaction;
            (function (interaction) {
                interaction.Impact = {
                    from: "Reference",
                    particle: being.Particle
                };
            })(interaction = being.interaction || (being.interaction = {}));
        })(being = reference.being || (reference.being = {}));
    })(reference = cessnalib_template.reference || (cessnalib_template.reference = {}));
})(cessnalib_template = exports.cessnalib_template || (exports.cessnalib_template = {}));
//# sourceMappingURL=cessnalib_template.js.map