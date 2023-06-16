import { dco } from "@euglena/core";
import { cell, sys } from "@euglena/template";
import * as cessnalib from "cessnalib";
import Datastore from "nedb";

export type Sap = cell.organelle.Sap<{ filename: string }>;

let db: Datastore;
let sap: Sap["data"];
export default dco<sys.io.store.vacuole.Vacuole, Sap>({
    Sap: async (p) => {
        sap = p.data;
    },
    GetAlive: async (p, { cp, t }) => {
        const { filename } = sap;
        try {
            db = new Datastore({ filename, autoload: true });
            return cp("ACK");
        } catch (e: any) {
            return cp("Exception", new cessnalib.sys.Exception("Error occurred while initializing the Datastore"));
        }
    },
    Hibernate: async () => { },
    ReadParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query } = p.data;
            db.find(cessnalib.js.Class.toDotNotation(query), (err: Error, doc: Array<any>) => {
                if (err) return resolve(cp("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
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
                return resolve(cp("Exception", new cessnalib.sys.Exception("Db returns non array result")));
            });
        });
    },
    SaveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            if (p.data instanceof Array) {
                db.insert(p.data, (err) => {
                    if (err) return resolve(cp("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                    return resolve(cp("ACK"));
                });
            } else {
                const { query, particle, count } = p.data;
                if (query) {
                    if (count === "all") {
                        return db.update(
                            cessnalib.js.Class.toDotNotation(query),
                            particle,
                            { upsert: true, multi: true },
                            (err, doc) => {
                                if (err)
                                    return resolve(cp("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                                return resolve(cp("ACK"));
                            }
                        );
                    } else {
                        return db.update(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                            if (err)
                                return resolve(cp("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                            return resolve(cp("ACK"));
                        });
                    }
                } else {
                    return db.insert(particle, (err) => {
                        if (err) return resolve(cp("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                        return resolve(cp("ACK"));
                    });
                }
            }
        });
    },
    RemoveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query, count } = p.data;
            if (count === "all") {
                db.remove(cessnalib.js.Class.toDotNotation(query), { multi: true }, (err, doc) => {
                    if (err) return resolve(cp("Exception", new cessnalib.sys.Exception(JSON.stringify(err))));
                    return resolve(cp("ACK"));
                });
            } else {
                resolve(cp("Exception", new cessnalib.sys.Exception("Not yet implemented")));
            }
        });
    }
});
