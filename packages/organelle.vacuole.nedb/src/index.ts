import { ccp, dco, Particle } from "@euglena/core";
import { vacuole } from "@euglena/template";
import { js } from "cessnalib";
import Datastore from "nedb";

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
            return;
        } catch (e: any) {
            return ccp.Exception({
                innerException: e,
                message: "Error occurred while initializing the Datastore"
            });
        }
    },
    Hibernate: async () => {},
    ReadParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query } = p.data;
            db.find(js.Class.toDotNotation(query), (err: Error, doc: Array<any>) => {
                if (err) return resolve(ccp.Exception({ message: JSON.stringify(err) }));
                if (doc instanceof Array)
                    return resolve(
                        cp("Particles",
                            doc.map((d) => {
                                delete d["_id"];
                                return d;
                            })
                        )
                    );
                return resolve(ccp.Exception({ message: "Db returns non array result" }));
            });
        });
    },
    SaveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            if (p.data instanceof Array) {
                db.insert(p.data, (err) => {
                    if (err) return resolve(ccp.Exception({ message: JSON.stringify(err) }));
                    return resolve();
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
                                if (err) return resolve(ccp.Exception({ message: JSON.stringify(err) }));
                                return resolve();
                            }
                        );
                    } else {
                        return db.update(js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                            if (err) return resolve(ccp.Exception({ message: JSON.stringify(err) }));
                            return resolve();
                        });
                    }
                } else {
                    return db.insert(particle, (err) => {
                        if (err) return resolve(ccp.Exception({ message: JSON.stringify(err) }));
                        return resolve();
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
                    if (err) return resolve(ccp.Exception({ message: JSON.stringify(err) }));
                    return resolve();
                });
            } else {
                resolve(
                    ccp.Exception({
                        message: "Not yet implemented"
                    })
                );
            }
        });
    }
});
