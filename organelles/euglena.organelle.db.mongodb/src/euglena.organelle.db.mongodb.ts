
/// <reference path="../typings/mongodb/mongodb.d.ts" />

"use strict";
import * as mongodb from "mongodb";
import {euglena_template} from "../node_modules/euglena/euglena_template/src/euglena_template";
import {euglena} from "../node_modules/euglena/euglena/src/euglena";
import Particle = euglena.being.Particle;

const OrganelleName = "DbOrganelleImplMongoDb";

export class Organelle extends euglena_template.being.alive.organelles.DbOrganelle {
    private euglenaInfos: euglena.sys.type.Map<string, euglena.being.alive.EuglenaInfo>;
    private db: mongodb.Db;
    constructor() {
        super(OrganelleName);
        this.euglenaInfos = new euglena.sys.type.Map<string, euglena.being.alive.EuglenaInfo>();
        this.euglenaInfos.add("idcore", new euglena.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
        this.euglenaInfos.add("postman", new euglena.being.alive.EuglenaInfo("idcore", "localhost", "1337"));
    }
    public receive(particle: Particle,response:euglena.being.interaction.Response): void {
        switch (particle.name) {
            case euglena_template.being.ghost.organelle.db.constants.StartDatabase:
                let this3_: Organelle = this;
                let startDatabase = particle as euglena_template.being.ghost.organelle.db.incomingparticles.StartDatabase;
                mongodb.MongoClient.connect("mongodb://" + this.initialProperties.url + ":" + this.initialProperties.port + "/" + startDatabase.content.euglenaName, (err, db) => {
                    if (!err) {
                        this.db = db;
                        this3_.send(new euglena_template.being.ghost.organelle.db.outgoingparticles.DbIsOnline(particle.of));
                    } else {
                        //TODO
                    }
                });
                break;
            case euglena_template.being.alive.constants.impacts.ReadParticle:
                let this_ = this;
                this.db.collection(particle.content.name).find({ of: particle.content.of }).toArray((err, doc) => {
                    this_.send(doc[0]);
                });
                break;
            case euglena_template.being.alive.constants.impacts.ReadParticles:
                let this4_ = this;
                this.db.collection(particle.content).find({}).toArray((err, doc) => {
                    for (var index = 0; index < doc.length; index++) {
                        this4_.send(doc[index]);
                    }
                });
                break;
            case euglena_template.being.alive.constants.impacts.RemoveParticle:
                this.db.collection(particle.content.name).findOneAndDelete({ of: particle.content.of }, (err, doc) => {
                    //TODO
                });
                break;
            case euglena_template.being.alive.constants.impacts.SaveParticle:
                let saveParticle = particle as euglena_template.being.alive.particles.SaveParticle;
                let this2_ = this;
                this.db.collection(saveParticle.content.name).findOneAndUpdate({ of: saveParticle.content.of }, saveParticle.content, { upsert: true }, (err, document) => {
                    if (err) {
                        //TODO
                    } else {
                        this2_.send(new euglena_template.being.alive.particles.Acknowledge({ of: saveParticle.of, id: saveParticle.content.name }, euglena_template.being.alive.constants.organelles.Db));
                    }
                });
                break;
        }
    }
}

