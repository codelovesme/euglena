import { vacuole, Sap } from "@euglena/core";
import { js } from "cessnalib";
import { MongoClient, Db } from "mongodb";

type VacuoleMongoDbSap = Sap<{
    /**
     * @deprecated since version 1.4.13
     * Use @param url instead
     */
    host: string;
    /**
     * @deprecated since version 1.4.13
     * Use @param url instead
     */
    port: number;
    database: string;

    /**
     * @example
     * "mongodb://dbdevc2scdlvsm:<password>@dbdevc2scdlvsm.documents.azure.com:10255/?ssl=true"
     */
    url?: string;
}>;

let db: Db;
let sap: VacuoleMongoDbSap["data"];
export default vacuole.v1.com<VacuoleMongoDbSap>({
    Sap: async (p) => {
        sap = p.data;
    },
    GetAlive: (p, { cp, t }) => {
        const { host, port, database, url } = sap;
        return new Promise((resolve) => {
            MongoClient.connect(
                url ? url : `mongodb://${host}:${port}`,
                { useNewUrlParser: true, useUnifiedTopology: true },
                (err, _db) => {
                    if (!err) {
                        db = _db.db(database);
                        t(cp.Log({ message: "Db is Online", level: "Info" }));
                        return resolve(cp.ACK());
                    } else {
                        t(cp.Log({ message: "Couldn't connect to db", level: "Error" }));
                        return resolve(cp.Exception({ message: JSON.stringify(err) }));
                    }
                }
            );
        });
    },
    Hibernate: async () => {},
    ReadParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query } = p.data;
            db.collection("particles")
                .find(js.Class.toDotNotation(query))
                .toArray((err, doc) => {
                    if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                    if (doc instanceof Array)
                        return resolve(
                            cp.Particles(
                                doc.map((d) => {
                                    delete (d as any)["_id"];
                                    return d;
                                })
                            )
                        );
                    return resolve(cp.Exception({ message: "Db returns non array result" }));
                });
        });
    },
    SaveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            if (p.data instanceof Array) {
                db.collection("particles").insertMany(p.data, (err) => {
                    if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                    return resolve(cp.ACK());
                });
            } else {
                const { query, particle, count } = p.data;
                if (query) {
                    if (count === "all") {
                        return db
                            .collection("particles")
                            .updateMany(js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                                if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                                return resolve(cp.ACK());
                            });
                    } else {
                        return db
                            .collection("particles")
                            .findOneAndUpdate(js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                                if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                                return resolve(cp.ACK());
                            });
                    }
                } else {
                    return db.collection("particles").insertOne(particle, (err) => {
                        if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                        return resolve(cp.ACK());
                    });
                }
            }
        });
    },
    RemoveParticle: (p, { cp }) => {
        return new Promise((resolve) => {
            const { query, count } = p.data;
            if (count === "all") {
                db.collection("particles").remove(js.Class.toDotNotation(query), (err, doc) => {
                    if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                    return resolve(cp.ACK());
                });
            } else {
                resolve(cp.ACK());
            }
        });
    }
});
