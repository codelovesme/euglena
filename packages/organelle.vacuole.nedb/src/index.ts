import { dco, Particle } from "@euglena/core";
import { organelle, particle } from "@euglena/template";
import { js, sys } from "cessnalib";
import Datastore from "nedb";

import vacuole = organelle.vacuole;
import common = particle.common;

export type Sap = Particle<"Sap", { filename: string }>;

let db: Datastore;
let sap: Sap["data"];
export default dco<vacuole.Vacuole, Sap>({
    Sap: async (p) => {
        sap = p.data;
    },
    GetAlive: async (p, { cp, t }) => {
        const { filename } = sap;
        try {
            db = new Datastore({ filename, autoload: true });
            return common.cp("ACK");
        } catch (e: any) {
            return common.cp("Exception", new sys.type.Exception("Error occurred while initializing the Datastore"));
        }
    },
    Hibernate: async () => {},
    ReadParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query } = p.data;
            db.find(js.Class.toDotNotation(query), (err: Error, doc: Array<any>) => {
                if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                if (doc instanceof Array)
                    return resolve(
                        cp(
                            "Particles",
                            doc.map((d) => {
                                delete d["_id"];
                                return d;
                            })
                        )
                    );
                return resolve(common.cp("Exception", new sys.type.Exception("Db returns non array result")));
            });
        });
    },
    SaveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            if (p.data instanceof Array) {
                db.insert(p.data, (err) => {
                    if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                    return resolve(common.cp("ACK"));
                });
            } else {
                const { query, particle, count } = p.data;
                if (query) {
                    if (count === "all") {
                        return db.update(
                            js.Class.toDotNotation(query),
                            particle,
                            { upsert: true, multi: true },
                            (err, doc) => {
                                if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                                return resolve(common.cp("ACK"));
                            }
                        );
                    } else {
                        return db.update(js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                            if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                            return resolve(common.cp("ACK"));
                        });
                    }
                } else {
                    return db.insert(particle, (err) => {
                        if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                        return resolve(common.cp("ACK"));
                    });
                }
            }
        });
    },
    RemoveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query, count } = p.data;
            if (count === "all") {
                db.remove(js.Class.toDotNotation(query), { multi: true }, (err, doc) => {
                    if (err) return resolve(common.cp("Exception", new sys.type.Exception(JSON.stringify(err))));
                    return resolve(common.cp("ACK"));
                });
            } else {
                resolve(common.cp("Exception", new sys.type.Exception("Not yet implemented")));
            }
        });
    }
});
