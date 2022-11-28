import * as core from "@euglena/core";
import { particle, organelle } from "@euglena/template";
import { js, sys } from "cessnalib";
import { MongoClient, Db } from "mongodb";

import vacuole = organelle.vacuole;
import common = particle.common;
import Particle = core.particle.Particle;

const dco = core.organelle.dco;

export type Sap = Particle<
    "Sap",
    {
        database: string;

        /**
         * @example
         * "mongodb://dbdevc2scdlvsm:<password>@dbdevc2scdlvsm.documents.azure.com:10255/?ssl=true"
         */
        uri: string;
    }
>;

let db: Db;
let sap: Sap["data"];
export default dco<vacuole.Vacuole, Sap>({
    Sap: async (p) => {
        sap = p.data;
    },
    GetAlive: async (p, { cp, t }) => {
        const { database, uri } = sap;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            db = client.db(database);
            t(cp("Log", { message: "Db is Online", level: "Info" }));
            return common.cp("ACK");
        } catch (err) {
            t(cp("Log", { message: "Couldn't connect to db", level: "Error" }));
            return common.cp("Exception", { message: JSON.stringify(err) });
        }
    },
    Hibernate: async () => {},
    ReadParticle: async (p, { cp, t }) => {
        const { query } = p.data;
        try {
            const collection = db.collection<Particle>("particles");
            const findResult = collection.find(js.Class.toDotNotation(query), { _id: 0 } as any);
            return cp("Particles", await findResult.toArray());
        } catch (err) {
            t(cp("Log", { message: "Couldn't connect to db", level: "Error" }));
            return common.cp("Exception", { message: JSON.stringify(err) });
        }
    },
    SaveParticle: async (p, { cp }) => {
        return new Promise((resolve) => {
            const data = p.data;
            if (data instanceof Array) {
                db.collection("particles").insertMany(data, async (err: any, result: any) => {
                    if (err) return resolve(common.cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(common.cp("ACK"));
                });
            } else {
                const { query, particle, count } = p.data as {
                    particle: Particle;
                    query?: sys.type.RecursivePartial<Particle>;
                    count: vacuole.Count;
                };
                if (query) {
                    if (count === "all") {
                        return db
                            .collection("particles")
                            .updateMany(js.Class.toDotNotation(query), particle, { upsert: true }, async (err, doc) => {
                                if (err) return resolve(common.cp("Exception", { message: JSON.stringify(err) }));
                                return resolve(common.cp("ACK"));
                            });
                    } else {
                        return db
                            .collection("particles")
                            .replaceOne(js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                                if (err) return resolve(common.cp("Exception", { message: JSON.stringify(err) }));
                                return resolve(common.cp("ACK"));
                            });
                    }
                } else {
                    return db.collection("particles").insertOne(particle, (err: any) => {
                        if (err) return resolve(common.cp("Exception", { message: JSON.stringify(err) }));
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
                db.collection("particles").deleteMany(js.Class.toDotNotation(query), (err: any, doc: any) => {
                    if (err) return resolve(common.cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(common.cp("ACK"));
                });
            } else {
                db.collection("particles").deleteOne(js.Class.toDotNotation(query), (err: any, doc: any) => {
                    if (err) return resolve(common.cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(common.cp("ACK"));
                });
            }
        });
    }
});
