/// <reference path="../../cessnalib/typings/node/node.d.ts" />
"use strict";
/**
 * Created by codelovesme on 6/19/2015.
 */
var cessnalib_1 = require("../node_modules/cessnalib/cessnalib");
var path = require("path");
var fs = require("fs");
var jsonminify = require("jsonminify");
var cessnalib_template;
(function (cessnalib_template) {
    var injection;
    (function (injection) {
        class StaticTools {
            static readFileParticles(applicationDirectory) {
                let particles = fs.readFileSync(path.join(path.resolve(applicationDirectory), "particles.json"), "utf8");
                return JSON.parse(jsonminify(particles));
            }
        }
        injection.StaticTools = StaticTools;
    })(injection = cessnalib_template.injection || (cessnalib_template.injection = {}));
    var being;
    (function (being) {
        var particles;
        (function (particles) {
            class BooleanParticle extends cessnalib_1.cessnalib.being.Particle {
                constructor(name, content, of) {
                    super(name, content, of);
                }
            }
            particles.BooleanParticle = BooleanParticle;
            class VoidParticle extends cessnalib_1.cessnalib.being.Particle {
                constructor(name, of) {
                    super(name, null, of);
                }
            }
            particles.VoidParticle = VoidParticle;
        })(particles = being.particles || (being.particles = {}));
        var alive;
        (function (alive) {
            var Particle = cessnalib_1.cessnalib.being.Particle;
            var constants;
            (function (constants) {
                var particles;
                (function (particles) {
                    particles.DbOrganelleInitialProperties = "DbOrganelleInitialProperties";
                    particles.ReceptionOrganelleInitialProperties = "ReceptionOrganelleInitialProperties";
                    particles.EuglenaName = "EuglenaName";
                    particles.ImpactReceived = "ImpactReceived";
                    particles.EuglenaHasBeenBorn = "EuglenaHasBeenBorn";
                    particles.EuglenaHasBeenDivided = "EuglenaHasBeenDivided";
                    particles.Acknowledge = "Acknowledge";
                    particles.Time = "Time";
                    particles.Exception = "Exception";
                    particles.ConnectedToTheInternet = "ConnectedToTheInternet";
                    particles.Token = "Token";
                    particles.Impacts = "Impacts";
                    particles.DoesParticleExist = "DoesParticleExist";
                    particles.DoesUniqueParticleExist = "DoesUniqueParticleExist";
                })(particles = constants.particles || (constants.particles = {}));
                var organelles;
                (function (organelles) {
                    organelles.ReceptionOrganelle = "ReceptionOrganelle";
                    organelles.TimeOrganelle = "TimeOrganelle";
                    organelles.WebOrganelle = "WebOrganelle";
                    organelles.DbOrganelle = "DbOrganelle";
                    organelles.WebUIOrganelle = "WebUIOrganelle";
                })(organelles = constants.organelles || (constants.organelles = {}));
                var impacts;
                (function (impacts) {
                    impacts.TimeChanged = "TimeChanged";
                    impacts.ExceptionOccurred = "ExceptionOccurred";
                    impacts.SaveParticle = "SaveParticle";
                    impacts.ReadParticle = "ReadParticle";
                    impacts.ReadParticles = "ReadParticles";
                    impacts.RemoveParticle = "RemoveParticle";
                })(impacts = constants.impacts || (constants.impacts = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var organelles;
            (function (organelles) {
                var Organelle = cessnalib_1.cessnalib.being.alive.Organelle;
                class WebUIOrganelle extends Organelle {
                    constructor(className) {
                        super(alive.constants.organelles.WebUIOrganelle, className);
                    }
                }
                organelles.WebUIOrganelle = WebUIOrganelle;
                class TimeOrganelle extends Organelle {
                    constructor(className) {
                        super(alive.constants.organelles.TimeOrganelle, className);
                    }
                }
                organelles.TimeOrganelle = TimeOrganelle;
                class ReceptionOrganelle extends Organelle {
                    constructor(className) {
                        super(constants.organelles.ReceptionOrganelle, className);
                    }
                }
                organelles.ReceptionOrganelle = ReceptionOrganelle;
                class WebOrganelle extends Organelle {
                    constructor(className) {
                        super(constants.organelles.WebOrganelle, className);
                    }
                }
                organelles.WebOrganelle = WebOrganelle;
                class DbOrganelle extends Organelle {
                    constructor(className) {
                        super(constants.organelles.DbOrganelle, className);
                    }
                }
                organelles.DbOrganelle = DbOrganelle;
            })(organelles = alive.organelles || (alive.organelles = {}));
            var particles;
            (function (particles) {
                class Token extends Particle {
                    constructor(content, of) {
                        super(constants.particles.Token, content, of);
                    }
                }
                particles.Token = Token;
                class Exception extends cessnalib_1.cessnalib.being.Particle {
                    constructor(content, of) {
                        super(constants.particles.Exception, content, of);
                    }
                }
                particles.Exception = Exception;
                class Time extends cessnalib_1.cessnalib.being.Particle {
                    constructor(content, of) {
                        super(constants.particles.Time, content, of);
                    }
                }
                particles.Time = Time;
                class Acknowledge extends being.particles.VoidParticle {
                    constructor(content, of) {
                        super(constants.particles.Acknowledge, of);
                    }
                }
                particles.Acknowledge = Acknowledge;
                class ConnectedToTheInternet extends being.particles.BooleanParticle {
                    constructor(content, of) {
                        super(constants.particles.ConnectedToTheInternet, content, of);
                    }
                }
                particles.ConnectedToTheInternet = ConnectedToTheInternet;
                class EuglenaHasBeenBorn extends being.particles.BooleanParticle {
                    constructor(of) {
                        super(constants.particles.EuglenaHasBeenBorn, true, of);
                    }
                }
                particles.EuglenaHasBeenBorn = EuglenaHasBeenBorn;
                class EuglenaHasBeenDivided extends being.particles.BooleanParticle {
                    constructor(of) {
                        super(constants.particles.EuglenaHasBeenDivided, true, of);
                    }
                }
                particles.EuglenaHasBeenDivided = EuglenaHasBeenDivided;
                class SaveParticle extends Particle {
                    constructor(content, of) {
                        super(constants.impacts.SaveParticle, content, of);
                    }
                }
                particles.SaveParticle = SaveParticle;
                class ReadParticle extends Particle {
                    constructor(content, of) {
                        super(constants.impacts.ReadParticle, content, of);
                    }
                }
                particles.ReadParticle = ReadParticle;
                class ReadParticles extends Particle {
                    constructor(particleName, of) {
                        super(constants.impacts.ReadParticles, particleName, of);
                    }
                }
                particles.ReadParticles = ReadParticles;
                class RemoveParticle extends Particle {
                    constructor(content, of) {
                        super(constants.impacts.RemoveParticle, content, of);
                    }
                }
                particles.RemoveParticle = RemoveParticle;
                class DoesParticleExist extends Particle {
                    constructor(content, of) {
                        super(alive.constants.particles.DoesParticleExist, content, of);
                    }
                }
                particles.DoesParticleExist = DoesParticleExist;
                class ImpactReceived extends cessnalib_1.cessnalib.being.Particle {
                    constructor(content, of) {
                        super(constants.particles.ImpactReceived, content, of);
                        this.content = content;
                    }
                }
                particles.ImpactReceived = ImpactReceived;
            })(particles = alive.particles || (alive.particles = {}));
            class StaticTools {
                static instantiateEuglena(applicationDirectory, chromosome, euglenaName) {
                    let euglena = cessnalib_1.cessnalib.being.alive.Euglena.generateInstance(chromosome, injection.StaticTools.readFileParticles(applicationDirectory));
                    euglena.receiveParticle(new cessnalib_template.being.alive.particles.EuglenaHasBeenDivided(euglena.getParticle(new cessnalib_1.cessnalib.being.alive.dna.condition.ParticleReference(cessnalib_template.being.alive.constants.particles.EuglenaName, euglenaName)).content));
                    return euglena;
                }
            }
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
                        class ThrowImpact extends cessnalib_1.cessnalib.being.Particle {
                            constructor(content, of) {
                                super(constants.incomingparticles.ThrowImpact, content, of);
                            }
                        }
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
                        class Listen extends being.particles.VoidParticle {
                            constructor(of) {
                                super(constants.incomingparticles.Listen, of);
                            }
                        }
                        incomingparticles.Listen = Listen;
                        class ThrowImpact extends cessnalib_1.cessnalib.being.Particle {
                            constructor(content, of) {
                                super(constants.incomingparticles.ThrowImpact, content, of);
                            }
                        }
                        incomingparticles.ThrowImpact = ThrowImpact;
                    })(incomingparticles = reception.incomingparticles || (reception.incomingparticles = {}));
                    var outgoingparticles;
                    (function (outgoingparticles) {
                        class ImpactReceived extends cessnalib_1.cessnalib.being.Particle {
                            constructor(impact, of) {
                                super(constants.outgoingparticles.ImpactReceived, impact, of);
                            }
                        }
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
                        class ConnectToEuglena extends cessnalib_1.cessnalib.being.Particle {
                            constructor(euglenaInfo, of) {
                                super(constants.incomingparticles.ConnectToEuglena, euglenaInfo, of);
                            }
                        }
                        incomingparticles.ConnectToEuglena = ConnectToEuglena;
                        class ThrowImpact extends cessnalib_1.cessnalib.being.Particle {
                            constructor(content, of) {
                                super(constants.incomingparticles.ThrowImpact, content, of);
                            }
                        }
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
                            incomingparticles.Serve = "Serve";
                            incomingparticles.ReturnIfConnectedToTheInternet = "ReturnIfConnectedToTheInternet";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = web.constants || (web.constants = {}));
                    var incomingparticles;
                    (function (incomingparticles) {
                        var VoidParticle = cessnalib_template.being.particles.VoidParticle;
                        class Serve extends VoidParticle {
                            constructor(of) {
                                super(constants.incomingparticles.Serve, of);
                            }
                        }
                        incomingparticles.Serve = Serve;
                        class ReturnCurrentTime extends VoidParticle {
                            constructor(of) {
                                super(constants.incomingparticles.ReturnCurrentTime, of);
                            }
                        }
                        incomingparticles.ReturnCurrentTime = ReturnCurrentTime;
                        class ReturnIfConnectedToTheInternet extends VoidParticle {
                            constructor(of) {
                                super(constants.incomingparticles.ReturnIfConnectedToTheInternet, of);
                            }
                        }
                        incomingparticles.ReturnIfConnectedToTheInternet = ReturnIfConnectedToTheInternet;
                    })(incomingparticles = web.incomingparticles || (web.incomingparticles = {}));
                })(web = euglena.web || (euglena.web = {}));
                var time;
                (function (time_1) {
                    var Particle = cessnalib_1.cessnalib.being.Particle;
                    var incomingparticles;
                    (function (incomingparticles) {
                        class SetTime extends Particle {
                            constructor(time, of) {
                                super(constants.incomingparticles.SetTime, time, of);
                            }
                        }
                        incomingparticles.SetTime = SetTime;
                        class StartClock extends being.particles.VoidParticle {
                            constructor(of) {
                                super(constants.incomingparticles.StartClock, of);
                            }
                        }
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
                        class StartDatabase extends Particle {
                            constructor(content, of) {
                                super(constants.StartDatabase, content, of);
                            }
                        }
                        incomingparticles.StartDatabase = StartDatabase;
                    })(incomingparticles = db.incomingparticles || (db.incomingparticles = {}));
                    var outgoingparticles;
                    (function (outgoingparticles) {
                        class DbIsOnline extends being.particles.VoidParticle {
                            constructor(of) {
                                super(constants.DbIsOnline, of);
                            }
                        }
                        outgoingparticles.DbIsOnline = DbIsOnline;
                    })(outgoingparticles = db.outgoingparticles || (db.outgoingparticles = {}));
                    var constants;
                    (function (constants) {
                        constants.StartDatabase = "StartDatabase";
                        constants.DbIsOnline = "DbIsOnline";
                    })(constants = db.constants || (db.constants = {}));
                })(db = euglena.db || (euglena.db = {}));
            })(euglena = ghost.euglena || (ghost.euglena = {}));
        })(ghost = being.ghost || (being.ghost = {}));
    })(being = cessnalib_template.being || (cessnalib_template.being = {}));
    var reference;
    (function (reference) {
        var being;
        (function (being) {
            being.Particle = new cessnalib_1.cessnalib.being.Particle("Reference Particle", true, "mine");
            var interaction;
            (function (interaction) {
                interaction.Impact = {
                    particle: being.Particle,
                    token: "token"
                };
            })(interaction = being.interaction || (being.interaction = {}));
        })(being = reference.being || (reference.being = {}));
    })(reference = cessnalib_template.reference || (cessnalib_template.reference = {}));
})(cessnalib_template = exports.cessnalib_template || (exports.cessnalib_template = {}));
//# sourceMappingURL=cessnalib_template.js.map