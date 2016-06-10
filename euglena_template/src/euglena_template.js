/// <reference path="../../euglena/typings/node/node.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by codelovesme on 6/19/2015.
 */
var euglena_1 = require("../node_modules/euglena/euglena/src/euglena");
var euglena_template;
(function (euglena_template) {
    var being;
    (function (being) {
        var particles;
        (function (particles) {
            var BooleanParticle = (function (_super) {
                __extends(BooleanParticle, _super);
                function BooleanParticle(name, content, of) {
                    _super.call(this, name, content, of);
                }
                return BooleanParticle;
            })(euglena_1.euglena.being.Particle);
            particles.BooleanParticle = BooleanParticle;
            var VoidParticle = (function (_super) {
                __extends(VoidParticle, _super);
                function VoidParticle(name, of) {
                    _super.call(this, name, null, of);
                }
                return VoidParticle;
            })(euglena_1.euglena.being.Particle);
            particles.VoidParticle = VoidParticle;
        })(particles = being.particles || (being.particles = {}));
        var alive;
        (function (alive) {
            var Particle = euglena_1.euglena.being.Particle;
            var constants;
            (function (constants) {
                var particles;
                (function (particles) {
                    particles.ParticlesOf = "ParticlesOf";
                    particles.EuglenaInfo = "EuglenaInfo";
                    particles.OrganelleList = "OrganelleList";
                    particles.DbOrganelleInitialProperties = "DbOrganelleInitialProperties";
                    particles.WebOrganelleInitialProperties = "WebOrganelleInitialProperties";
                    particles.NucleusOrganelleInitialProperties = "NucleusOrganelleInitialProperties";
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
                    particles.Gene = "Gene";
                })(particles = constants.particles || (constants.particles = {}));
                var organelles;
                (function (organelles) {
                    organelles.Net = "ReceptionOrganelle";
                    organelles.TimeOrganelle = "TimeOrganelle";
                    organelles.WebOrganelle = "WebOrganelle";
                    organelles.Db = "DbOrganelle";
                    organelles.Nucleus = "NucleusOrganelle";
                })(organelles = constants.organelles || (constants.organelles = {}));
                var impacts;
                (function (impacts) {
                    impacts.AddGene = "AddGene";
                    impacts.TimeChanged = "TimeChanged";
                    impacts.ExceptionOccurred = "ExceptionOccurred";
                    impacts.SaveParticle = "SaveParticle";
                    impacts.ReadParticle = "ReadParticle";
                    impacts.ReadParticles = "ReadParticles";
                    impacts.ReadParticlesOf = "ReadParticlesOf";
                    impacts.RemoveParticle = "RemoveParticle";
                })(impacts = constants.impacts || (constants.impacts = {}));
            })(constants = alive.constants || (alive.constants = {}));
            var organelles;
            (function (organelles) {
                var Organelle = euglena_1.euglena.being.alive.Organelle;
                var Nucleus = (function (_super) {
                    __extends(Nucleus, _super);
                    function Nucleus(className) {
                        _super.call(this, alive.constants.organelles.Nucleus, className);
                    }
                    return Nucleus;
                })(Organelle);
                organelles.Nucleus = Nucleus;
                var TimeOrganelle = (function (_super) {
                    __extends(TimeOrganelle, _super);
                    function TimeOrganelle(className) {
                        _super.call(this, alive.constants.organelles.TimeOrganelle, className);
                    }
                    return TimeOrganelle;
                })(Organelle);
                organelles.TimeOrganelle = TimeOrganelle;
                var ReceptionOrganelle = (function (_super) {
                    __extends(ReceptionOrganelle, _super);
                    function ReceptionOrganelle(className) {
                        _super.call(this, constants.organelles.Net, className);
                    }
                    return ReceptionOrganelle;
                })(Organelle);
                organelles.ReceptionOrganelle = ReceptionOrganelle;
                var WebOrganelle = (function (_super) {
                    __extends(WebOrganelle, _super);
                    function WebOrganelle(className) {
                        _super.call(this, constants.organelles.WebOrganelle, className);
                    }
                    return WebOrganelle;
                })(Organelle);
                organelles.WebOrganelle = WebOrganelle;
                var DbOrganelle = (function (_super) {
                    __extends(DbOrganelle, _super);
                    function DbOrganelle(className) {
                        _super.call(this, constants.organelles.Db, className);
                    }
                    return DbOrganelle;
                })(Organelle);
                organelles.DbOrganelle = DbOrganelle;
            })(organelles = alive.organelles || (alive.organelles = {}));
            var particles;
            (function (particles_1) {
                var EuglenaInfo = (function () {
                    function EuglenaInfo(name, url, port) {
                        this.name = name;
                        this.url = url;
                        this.port = port;
                    }
                    return EuglenaInfo;
                })();
                particles_1.EuglenaInfo = EuglenaInfo;
                var OrganelleList = (function (_super) {
                    __extends(OrganelleList, _super);
                    function OrganelleList(content, of) {
                        _super.call(this, constants.particles.OrganelleList, content, of);
                    }
                    return OrganelleList;
                })(Particle);
                particles_1.OrganelleList = OrganelleList;
                var Token = (function (_super) {
                    __extends(Token, _super);
                    function Token(content, of) {
                        _super.call(this, constants.particles.Token, content, of);
                    }
                    return Token;
                })(Particle);
                particles_1.Token = Token;
                var Exception = (function (_super) {
                    __extends(Exception, _super);
                    function Exception(content, of) {
                        _super.call(this, constants.particles.Exception, content, of);
                    }
                    return Exception;
                })(euglena_1.euglena.being.Particle);
                particles_1.Exception = Exception;
                var Time = (function (_super) {
                    __extends(Time, _super);
                    function Time(content, of) {
                        _super.call(this, constants.particles.Time, content, of);
                    }
                    return Time;
                })(euglena_1.euglena.being.Particle);
                particles_1.Time = Time;
                var Acknowledge = (function (_super) {
                    __extends(Acknowledge, _super);
                    function Acknowledge(content, of) {
                        _super.call(this, constants.particles.Acknowledge, of);
                    }
                    return Acknowledge;
                })(being.particles.VoidParticle);
                particles_1.Acknowledge = Acknowledge;
                var ConnectedToTheInternet = (function (_super) {
                    __extends(ConnectedToTheInternet, _super);
                    function ConnectedToTheInternet(content, of) {
                        _super.call(this, constants.particles.ConnectedToTheInternet, content, of);
                    }
                    return ConnectedToTheInternet;
                })(being.particles.BooleanParticle);
                particles_1.ConnectedToTheInternet = ConnectedToTheInternet;
                var EuglenaHasBeenBorn = (function (_super) {
                    __extends(EuglenaHasBeenBorn, _super);
                    function EuglenaHasBeenBorn(of) {
                        _super.call(this, constants.particles.EuglenaHasBeenBorn, true, of);
                    }
                    return EuglenaHasBeenBorn;
                })(being.particles.BooleanParticle);
                particles_1.EuglenaHasBeenBorn = EuglenaHasBeenBorn;
                var EuglenaHasBeenDivided = (function (_super) {
                    __extends(EuglenaHasBeenDivided, _super);
                    function EuglenaHasBeenDivided(of) {
                        _super.call(this, constants.particles.EuglenaHasBeenDivided, true, of);
                    }
                    return EuglenaHasBeenDivided;
                })(being.particles.BooleanParticle);
                particles_1.EuglenaHasBeenDivided = EuglenaHasBeenDivided;
                var SaveParticle = (function (_super) {
                    __extends(SaveParticle, _super);
                    function SaveParticle(content, of) {
                        _super.call(this, constants.impacts.SaveParticle, content, of);
                    }
                    return SaveParticle;
                })(Particle);
                particles_1.SaveParticle = SaveParticle;
                var ReadParticle = (function (_super) {
                    __extends(ReadParticle, _super);
                    function ReadParticle(content, of) {
                        _super.call(this, constants.impacts.ReadParticle, content, of);
                    }
                    return ReadParticle;
                })(Particle);
                particles_1.ReadParticle = ReadParticle;
                var ReadParticles = (function (_super) {
                    __extends(ReadParticles, _super);
                    function ReadParticles(particleName, of) {
                        _super.call(this, constants.impacts.ReadParticles, particleName, of);
                    }
                    return ReadParticles;
                })(Particle);
                particles_1.ReadParticles = ReadParticles;
                var ReadParticlesOf = (function (_super) {
                    __extends(ReadParticlesOf, _super);
                    function ReadParticlesOf(whose, of) {
                        _super.call(this, constants.impacts.ReadParticlesOf, whose, of);
                    }
                    return ReadParticlesOf;
                })(Particle);
                particles_1.ReadParticlesOf = ReadParticlesOf;
                var ParticlesOf = (function (_super) {
                    __extends(ParticlesOf, _super);
                    function ParticlesOf(particles, of) {
                        _super.call(this, constants.particles.ParticlesOf, particles, of);
                    }
                    return ParticlesOf;
                })(Particle);
                particles_1.ParticlesOf = ParticlesOf;
                var RemoveParticle = (function (_super) {
                    __extends(RemoveParticle, _super);
                    function RemoveParticle(content, of) {
                        _super.call(this, constants.impacts.RemoveParticle, content, of);
                    }
                    return RemoveParticle;
                })(Particle);
                particles_1.RemoveParticle = RemoveParticle;
                var DoesParticleExist = (function (_super) {
                    __extends(DoesParticleExist, _super);
                    function DoesParticleExist(content, of) {
                        _super.call(this, alive.constants.particles.DoesParticleExist, content, of);
                    }
                    return DoesParticleExist;
                })(Particle);
                particles_1.DoesParticleExist = DoesParticleExist;
                var ImpactReceived = (function (_super) {
                    __extends(ImpactReceived, _super);
                    function ImpactReceived(content, of) {
                        _super.call(this, constants.particles.ImpactReceived, content, of);
                        this.content = content;
                    }
                    return ImpactReceived;
                })(euglena_1.euglena.being.Particle);
                particles_1.ImpactReceived = ImpactReceived;
            })(particles = alive.particles || (alive.particles = {}));
        })(alive = being.alive || (being.alive = {}));
        var ghost;
        (function (ghost) {
            var organelle;
            (function (organelle) {
                var impactthrower;
                (function (impactthrower) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var ThrowImpact = (function (_super) {
                            __extends(ThrowImpact, _super);
                            function ThrowImpact(content, of) {
                                _super.call(this, constants.incomingparticles.ThrowImpact, content, of);
                            }
                            return ThrowImpact;
                        })(euglena_1.euglena.being.Particle);
                        incomingparticles.ThrowImpact = ThrowImpact;
                    })(incomingparticles = impactthrower.incomingparticles || (impactthrower.incomingparticles = {}));
                    var constants;
                    (function (constants) {
                        var incomingparticles;
                        (function (incomingparticles) {
                            incomingparticles.ThrowImpact = "ThrowImpact";
                        })(incomingparticles = constants.incomingparticles || (constants.incomingparticles = {}));
                    })(constants = impactthrower.constants || (impactthrower.constants = {}));
                })(impactthrower = organelle.impactthrower || (organelle.impactthrower = {}));
                var reception;
                (function (reception) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var Listen = (function (_super) {
                            __extends(Listen, _super);
                            function Listen(of) {
                                _super.call(this, constants.incomingparticles.Listen, of);
                            }
                            return Listen;
                        })(being.particles.VoidParticle);
                        incomingparticles.Listen = Listen;
                        var ThrowImpact = (function (_super) {
                            __extends(ThrowImpact, _super);
                            function ThrowImpact(content, of) {
                                _super.call(this, constants.incomingparticles.ThrowImpact, content, of);
                            }
                            return ThrowImpact;
                        })(euglena_1.euglena.being.Particle);
                        incomingparticles.ThrowImpact = ThrowImpact;
                    })(incomingparticles = reception.incomingparticles || (reception.incomingparticles = {}));
                    var outgoingparticles;
                    (function (outgoingparticles) {
                        var ImpactReceived = (function (_super) {
                            __extends(ImpactReceived, _super);
                            function ImpactReceived(impact, of) {
                                _super.call(this, constants.outgoingparticles.ImpactReceived, impact, of);
                            }
                            return ImpactReceived;
                        })(euglena_1.euglena.being.Particle);
                        outgoingparticles.ImpactReceived = ImpactReceived;
                        var ConnectedToEuglena = (function (_super) {
                            __extends(ConnectedToEuglena, _super);
                            function ConnectedToEuglena(euglenaInfo, of) {
                                _super.call(this, constants.outgoingparticles.ConnectedToEuglena, euglenaInfo, of);
                            }
                            return ConnectedToEuglena;
                        })(euglena_1.euglena.being.Particle);
                        outgoingparticles.ConnectedToEuglena = ConnectedToEuglena;
                        var DisconnectedFromEuglena = (function (_super) {
                            __extends(DisconnectedFromEuglena, _super);
                            function DisconnectedFromEuglena(euglenaInfo, of) {
                                _super.call(this, constants.outgoingparticles.ConnectedToEuglena, euglenaInfo, of);
                            }
                            return DisconnectedFromEuglena;
                        })(euglena_1.euglena.being.Particle);
                        outgoingparticles.DisconnectedFromEuglena = DisconnectedFromEuglena;
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
                            outgoingparticles.ConnectedToEuglena = "ConnectedToEuglena";
                            outgoingparticles.DisconnectedFromEuglena = "DisconnectedFromEuglena";
                        })(outgoingparticles = constants.outgoingparticles || (constants.outgoingparticles = {}));
                    })(constants = reception.constants || (reception.constants = {}));
                })(reception = organelle.reception || (organelle.reception = {}));
                var impacttransmitter;
                (function (impacttransmitter) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var ConnectToEuglena = (function (_super) {
                            __extends(ConnectToEuglena, _super);
                            function ConnectToEuglena(euglenaInfo, of) {
                                _super.call(this, constants.incomingparticles.ConnectToEuglena, euglenaInfo, of);
                            }
                            return ConnectToEuglena;
                        })(euglena_1.euglena.being.Particle);
                        incomingparticles.ConnectToEuglena = ConnectToEuglena;
                        var ThrowImpact = (function (_super) {
                            __extends(ThrowImpact, _super);
                            function ThrowImpact(content, of) {
                                _super.call(this, constants.incomingparticles.ThrowImpact, content, of);
                            }
                            return ThrowImpact;
                        })(euglena_1.euglena.being.Particle);
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
                })(impacttransmitter = organelle.impacttransmitter || (organelle.impacttransmitter = {}));
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
                        var VoidParticle = euglena_template.being.particles.VoidParticle;
                        var Serve = (function (_super) {
                            __extends(Serve, _super);
                            function Serve(of) {
                                _super.call(this, constants.incomingparticles.Serve, of);
                            }
                            return Serve;
                        })(VoidParticle);
                        incomingparticles.Serve = Serve;
                        var ReturnCurrentTime = (function (_super) {
                            __extends(ReturnCurrentTime, _super);
                            function ReturnCurrentTime(of) {
                                _super.call(this, constants.incomingparticles.ReturnCurrentTime, of);
                            }
                            return ReturnCurrentTime;
                        })(VoidParticle);
                        incomingparticles.ReturnCurrentTime = ReturnCurrentTime;
                        var ReturnIfConnectedToTheInternet = (function (_super) {
                            __extends(ReturnIfConnectedToTheInternet, _super);
                            function ReturnIfConnectedToTheInternet(of) {
                                _super.call(this, constants.incomingparticles.ReturnIfConnectedToTheInternet, of);
                            }
                            return ReturnIfConnectedToTheInternet;
                        })(VoidParticle);
                        incomingparticles.ReturnIfConnectedToTheInternet = ReturnIfConnectedToTheInternet;
                    })(incomingparticles = web.incomingparticles || (web.incomingparticles = {}));
                })(web = organelle.web || (organelle.web = {}));
                var time;
                (function (time_1) {
                    var Particle = euglena_1.euglena.being.Particle;
                    var incomingparticles;
                    (function (incomingparticles) {
                        var SetTime = (function (_super) {
                            __extends(SetTime, _super);
                            function SetTime(time, of) {
                                _super.call(this, constants.incomingparticles.SetTime, time, of);
                            }
                            return SetTime;
                        })(Particle);
                        incomingparticles.SetTime = SetTime;
                        var StartClock = (function (_super) {
                            __extends(StartClock, _super);
                            function StartClock(of) {
                                _super.call(this, constants.incomingparticles.StartClock, of);
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
                })(time = organelle.time || (organelle.time = {}));
                var db;
                (function (db) {
                    var incomingparticles;
                    (function (incomingparticles) {
                        var StartDatabase = (function (_super) {
                            __extends(StartDatabase, _super);
                            function StartDatabase(of) {
                                _super.call(this, constants.StartDatabase, of);
                            }
                            return StartDatabase;
                        })(being.particles.VoidParticle);
                        incomingparticles.StartDatabase = StartDatabase;
                    })(incomingparticles = db.incomingparticles || (db.incomingparticles = {}));
                    var outgoingparticles;
                    (function (outgoingparticles) {
                        var DbIsOnline = (function (_super) {
                            __extends(DbIsOnline, _super);
                            function DbIsOnline(of) {
                                _super.call(this, constants.DbIsOnline, of);
                            }
                            return DbIsOnline;
                        })(being.particles.VoidParticle);
                        outgoingparticles.DbIsOnline = DbIsOnline;
                    })(outgoingparticles = db.outgoingparticles || (db.outgoingparticles = {}));
                    var constants;
                    (function (constants) {
                        constants.StartDatabase = "StartDatabase";
                        constants.DbIsOnline = "DbIsOnline";
                    })(constants = db.constants || (db.constants = {}));
                })(db = organelle.db || (organelle.db = {}));
            })(organelle = ghost.organelle || (ghost.organelle = {}));
        })(ghost = being.ghost || (being.ghost = {}));
    })(being = euglena_template.being || (euglena_template.being = {}));
})(euglena_template = exports.euglena_template || (exports.euglena_template = {}));
//# sourceMappingURL=euglena_template.js.map