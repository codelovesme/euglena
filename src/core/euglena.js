"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cessnalib_1 = require("cessnalib");
var common_particles_1 = require("../template/common-particles");
var timer_1 = require("../template/organelles/timer");
var logger_1 = require("../template/organelles/logger");
var vacuole_1 = require("../template/organelles/vacuole");
var cytoplasm;
exports.createEuglena = function (createOrganelles, geneCluster) {
    if (cytoplasm) {
        throw "There exists a cytoplasm instance already.";
    }
    var genes = [];
    var organelles = {};
    /**
     * define transmit
     */
    var transmit = function (organelleName, particle) {
        organelles[logger_1.logger.n](logger_1.logger.cp.incoming.LoggerLog("Transmitting To " + organelleName + " Particle: " + JSON.stringify(particle.meta), "Info"));
        var organelleReceive = organelles[organelleName];
        if (!organelleReceive) {
            organelles[logger_1.logger.n](logger_1.logger.cp.incoming.LoggerLog(organelleName + " receive function is not implemeted!", "Info"));
            throw "Not Implemented";
        }
        return organelleReceive(particle);
    };
    /**
     * define receive
     */
    var receive = function (sender, particle) {
        organelles[logger_1.logger.n](logger_1.logger.cp.incoming.LoggerLog("Receiving from " + sender + " Particle " + JSON.stringify(particle), "Info"));
        organelles[logger_1.logger.n](logger_1.logger.cp.incoming.LoggerLog("Receiving from " + sender + " Particle " + JSON.stringify(particle.meta), "Info"));
        //find which genes are matched with properties of the particle
        var triggerableReactions = new Array();
        for (var i = 0; i < genes.length; i++) {
            var triggers = genes[i].data.triggers;
            if (cessnalib_1.js.Class.doesMongoCover(particle, triggers)) {
                var reaction = genes[i].data.reaction;
                triggerableReactions.push({
                    index: i,
                    triggers: Object.keys(triggers),
                    reaction: reaction
                });
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
                doTrigger = !(genes[tr2.index].data.override === genes[tr.index].data.name);
            }
            if (doTrigger) {
                reactions.push(tr.reaction);
                names.push(genes[tr.index].data.name);
            }
        }
        //trigger collected reactions
        for (var i = 0; i < reactions.length; i++) {
            var reaction = reactions[i];
            var geneName = names[i];
            organelles[logger_1.logger.n](logger_1.logger.cp.incoming.LoggerLog("Triggering Gene: " + geneName + " Particle: " + JSON.stringify(particle.meta), "Info"));
            reaction(particle, sender, {
                receive: receive,
                r: receive,
                transmit: transmit,
                t: transmit
            });
        }
    };
    /**
     * fill chromosome
     */
    genes = genes.concat(geneCluster);
    /**
     * create organelle logger
     */
    organelles[logger_1.logger.n] = logger_1.logger.co(receive);
    /**
     * create organelle vacuole
     */
    organelles[vacuole_1.vacuole.n] = vacuole_1.vacuole.co(receive);
    /**
     * create organelle timer
     */
    organelles[timer_1.timer.n] = timer_1.timer.co(receive);
    /**
     * generate Organelles
     */
    organelles = Object.keys(createOrganelles).reduce(function (organelles, organelleName) { return ((organelles[organelleName] = createOrganelles[organelleName](receive)), organelles); }, organelles);
    cytoplasm = {
        organelles: organelles,
        chromosome: genes
    };
    receive("cytoplasm", common_particles_1.ccp.EuglenaHasBeenBorn());
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=euglena.js.map