import { Sap,Particle } from "@euglena/core";
import { vacuole } from "@euglena/template";
import { js } from "cessnalib";
import { MongoClient, Db } from "mongodb";

type VacuoleMongoDbSap = Sap<{
    /**
     * @deprecated since version 1.4.13
     * Use @param uri instead
     */
    host: string;
    /**
     * @deprecated since version 1.4.13
     * Use @param uri instead
     */
    port: number;
    database: string;

    /**
     * @example
     * "mongodb://dbdevc2scdlvsm:<password>@dbdevc2scdlvsm.documents.azure.com:10255/?ssl=true"
     */
    uri?: string;
}>;

let db: Db;
let sap: VacuoleMongoDbSap["data"];
export default vacuole.v1.com<VacuoleMongoDbSap>({
    Sap: async (p) => {
        sap = p.data;
    },
    GetAlive: async (p, { cp, t }) => {
        const { host, port, database, uri } = sap;
        const client = new MongoClient(uri ? uri : `mongodb://${host}:${port}`);
        try {
            await client.connect();
            db = client.db(database);
            t(cp.Log({ message: "Db is Online", level: "Info" }));
            return cp.ACK();
        } catch (err) {
            t(cp.Log({ message: "Couldn't connect to db", level: "Error" }));
            return cp.Exception({ message: JSON.stringify(err) });
        }
    },
    Hibernate: async () => {},
    ReadParticle: async (p, { cp, t }) => {
        const { query } = p.data;
        try {
            const collection = db.collection<Particle>("particles");
            const findResult = collection.find(js.Class.toDotNotation(query),{_id:0} as any);
            return cp.Particles(await findResult.toArray());
        } catch (err) {
            t(cp.Log({ message: "Couldn't connect to db", level: "Error" }));
            return cp.Exception({ message: JSON.stringify(err) });
        }
    },
    SaveParticle: async (p, { cp }) => {
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
                            .replaceOne(js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
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
                db.collection("particles").deleteMany(js.Class.toDotNotation(query), (err, doc) => {
                    if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                    return resolve(cp.ACK());
                });
            } else {
                db.collection("particles").deleteOne(js.Class.toDotNotation(query), (err, doc) => {
                    if (err) return resolve(cp.Exception({ message: JSON.stringify(err) }));
                    return resolve(cp.ACK());
                });
            }
        });
    }
});
