import * as cessnalib from "cessnalib";
import { MongoClient, Db } from "mongodb";
import {vacuole, Exception, Particle} from "@euglena/compact";

export class VacuoleMongoDB extends vacuole.Vacuole {
    private db?: Db;
    constructor(private database: string,
        /**
         * @example
         * "mongodb://dbdevc2scdlvsm:<password>@dbdevc2scdlvsm.documents.azure.com:10255/?ssl=true"
         */
        private uri: string,
        nucleus: vacuole.Nucleus) {
        super(nucleus);
    }
    async getAlive(): Promise<void | Exception> {
        const client = new MongoClient(this.uri);
        try {
            await client.connect();
            this.db = client.db(this.database);
            this.nucleus.log("Db is Online", "Info");
        } catch (err) {
            this.nucleus.log("Couldn't connect to db", "Error");
            return new Exception(JSON.stringify(err));
        }
    }
    async read(query: Partial<Particle>, count: number | "All" = 1): Promise<Particle[] | Exception> {
        try {
            const collection = this.db!.collection<Particle>("particles");
            const findResult = collection.find(cessnalib.js.Class.toDotNotation(query), { _id: 0 } as any);
            const particleArray: Particle[] = (await findResult.toArray()).map(item => {
                delete (item as any)._id;
                return item;
            });
            return particleArray;
        } catch (err) {
            return new Exception(JSON.stringify(err));
        }
    }
    async save( particle: Particle, query: Partial<Particle>, count: number | "All" = 1): Promise<void | Exception> {
        return new Promise((resolve) => {
            if (query) {
                if (count === "All") {
                    return this.db!
                        .collection("particles")
                        .updateMany(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, async (err, doc) => {
                            if (err) return resolve(new Exception(JSON.stringify(err)));
                            return resolve();
                        });
                } else {
                    return this.db!
                        .collection("particles")
                        .replaceOne(cessnalib.js.Class.toDotNotation(query), particle, { upsert: true }, (err, doc) => {
                            if (err) return resolve(new Exception(JSON.stringify(err)));
                            return resolve();
                        });
                }
            } else {
                return this.db!.collection("particles").insertOne(particle, (err: any) => {
                    if (err) return resolve(new Exception(JSON.stringify(err)));
                    return resolve();
                });
            }
        });
    }
    async saveAll(data: Particle[]): Promise<void | Exception> {
        return new Promise((resolve) => {
            this.db!.collection("particles").insertMany(data, async (err: any, result: any) => {
                if (err) return resolve(new Exception(JSON.stringify(err)));
                return resolve();
            });
        });
    }
    async remove(query: Partial<Particle>, count: number | "All" = 1): Promise<void | Exception> {
        return new Promise((resolve) => {
            if (count === "All") {
                this.db!.collection("particles").deleteMany(cessnalib.js.Class.toDotNotation(query), (err: any, doc: any) => {
                    if (err) return resolve(new Exception(JSON.stringify(err)));
                    return resolve();
                });
            } else {
                this.db!.collection("particles").deleteOne(cessnalib.js.Class.toDotNotation(query), (err: any, doc: any) => {
                    if (err) return resolve(new Exception(JSON.stringify(err)));
                    return resolve();
                });
            }
        });
    }
}
