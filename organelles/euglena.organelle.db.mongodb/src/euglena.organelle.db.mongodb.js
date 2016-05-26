/// <reference path="../typings/mongodb/mongodb.d.ts" />
"use strict";
var mongodb = require("mongodb");
var euglena_template_1 = require("../node_modules/euglena/euglena_template/src/euglena_template");
var euglena_1 = require("../node_modules/euglena/euglena/src/euglena");
const OrganelleName = "DbOrganelleImplMongoDb";
class Organelle extends euglena_template_1.euglena_template.being.alive.organelles.DbOrganelle {
    constructor() {
        super(OrganelleName);
        this.euglenaInfos = new euglena_1.euglena.sys.type.Map();
        this.euglenaInfos.add("idcore", new euglena_1.euglena.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
        this.euglenaInfos.add("postman", new euglena_1.euglena.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
    }
    receive(particle, response) {
        switch (particle.name) {
            case euglena_template_1.euglena_template.being.ghost.organelle.db.constants.StartDatabase:
                let this3_ = this;
                let startDatabase = particle;
                mongodb.MongoClient.connect("mongodb://" + this.initialProperties.url + ":" + this.initialProperties.port + "/" + startDatabase.content.euglenaName, (err, db) => {
                    if (!err) {
                        this.db = db;
                        this3_.send(new euglena_template_1.euglena_template.being.ghost.organelle.db.outgoingparticles.DbIsOnline(particle.of));
                    }
                    else {
                    }
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticle:
                let this_ = this;
                this.db.collection(particle.content.name).find({ of: particle.content.of }).toArray((err, doc) => {
                    this_.send(doc[0]);
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.ReadParticles:
                let this4_ = this;
                this.db.collection(particle.content).find({}).toArray((err, doc) => {
                    for (var index = 0; index < doc.length; index++) {
                        this4_.send(doc[index]);
                    }
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.RemoveParticle:
                this.db.collection(particle.content.name).findOneAndDelete({ of: particle.content.of }, (err, doc) => {
                    //TODO
                });
                break;
            case euglena_template_1.euglena_template.being.alive.constants.impacts.SaveParticle:
                let saveParticle = particle;
                let this2_ = this;
                this.db.collection(saveParticle.content.name).findOneAndUpdate({ of: saveParticle.content.of }, saveParticle.content, { upsert: true }, (err, document) => {
                    if (err) {
                    }
                    else {
                        this2_.send(new euglena_template_1.euglena_template.being.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, euglena_template_1.euglena_template.being.alive.constants.organelles.Db));
                    }
                });
                break;
        }
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=euglena.organelle.db.mongodb.js.map