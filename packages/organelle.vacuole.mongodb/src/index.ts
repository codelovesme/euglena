import * as cessnalib from "cessnalib";
import { Particle, dco } from "@euglena/core";
import { cell, sys } from "@euglena/template";
import { MongoClient, Db } from "mongodb";

export type Sap = cell.organelle.Sap<
    {
        databaseName: string;
        collectionName: string;

        /**
         * @example
         * "mongodb://dbdevc2scdlvsm:<password>@dbdevc2scdlvsm.documents.azure.com:10255/?ssl=true"
         */
        uri: string;
    }
>;

let db: Db;
let sap: Sap["data"];
export default dco<sys.io.store.vacuole.Vacuole, Sap>({
    Sap: async (p) => {
        sap = p.data;
    },
    GetAlive: async (p, { cp, t }) => {
        const client = new MongoClient(sap.uri);
        try {
            await client.connect();
            db = client.db(sap.databaseName);
            t(cp("Log", { message: "Db is Online", level: "Info" }));
            return cp("ACK");
        } catch (err) {
            t(cp("Log", { message: "Couldn't connect to db", level: "Error" }));
            return cp("Exception", { message: JSON.stringify(err) });
        }
    },
    Hibernate: async () => { },
    ReadParticle: async (p, { cp, t }) => {
        const { query } = p.data;
        try {
            const collection = db.collection<Particle>(sap.collectionName);
            const findResult = collection.find(cessnalib.js.Class.toDotNotation(query), { _id: 0 } as any);
            const particleArray: Particle[] = (await findResult.toArray()).map(item => {
                delete (item as any)._id;
                return item;
            });
            return cp("Particles", particleArray);
        } catch (err) {
            t(cp("Log", { message: "Couldn't connect to db", level: "Error" }));
            return cp("Exception", { message: JSON.stringify(err) });
        }
    },
    SaveParticle: async (p, { cp }) => {
        return new Promise((resolve) => {
            const data = p.data;
            if (data instanceof Array) {
                db.collection(sap.collectionName).insertMany(data, async (err: any, result: any) => {
                    if (err) return resolve(cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(cp("ACK"));
                });
            } else {
                const { query, particle, count } = p.data as {
                    particle: Particle;
                    query?: cessnalib.sys.RecursivePartial<Particle>;
                    count: sys.io.store.vacuole.Count;
                };
                if (query) {
                    if (count === "all") {
                        return db
                            .collection(sap.collectionName)
                            .updateMany(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, async (err, doc) => {
                                if (err) return resolve(cp("Exception", { message: JSON.stringify(err) }));
                                return resolve(cp("ACK"));
                            });
                    } else {
                        return db
                            .collection(sap.collectionName)
                            .replaceOne(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                                if (err) return resolve(cp("Exception", { message: JSON.stringify(err) }));
                                return resolve(cp("ACK"));
                            });
                    }
                } else {
                    return db.collection(sap.collectionName).insertOne(particle, (err: any) => {
                        if (err) return resolve(cp("Exception", { message: JSON.stringify(err) }));
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
                db.collection(sap.collectionName).deleteMany(cessnalib.js.Class.toDotNotation(query), (err: any, doc: any) => {
                    if (err) return resolve(cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(cp("ACK"));
                });
            } else {
                db.collection(sap.collectionName).deleteOne(cessnalib.js.Class.toDotNotation(query), (err: any, doc: any) => {
                    if (err) return resolve(cp("Exception", { message: JSON.stringify(err) }));
                    return resolve(cp("ACK"));
                });
            }
        });
    }
});
