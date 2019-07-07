import { OrganelleDefaultExport, CreateOrganelle } from "../../../organelle";
import { ParticleV3, Particle, MetaV3Optionals } from "../../../particle";
export declare type VacuoleDefaultExport = OrganelleDefaultExport<typeof organelleName, typeof createOrganelle, typeof createVacuoleParticle, typeof vacuoleParticles>;
export declare type Count = number | "all";
export declare namespace vacuoleParticles {
    const ReadParticle: "vacuole.ReadParticle";
    type ReadParticle = ParticleV3<typeof ReadParticle, {
        query: Partial<Particle>;
        count?: Count;
    }>;
    const SaveParticle: "vacuole.SaveParticle";
    type SaveParticle = ParticleV3<typeof SaveParticle, {
        particle: Particle;
        query?: Partial<Particle>;
        count?: Count;
    }>;
    const RemoveParticle: "vacuole.RemoveParticle";
    type RemoveParticle = ParticleV3<typeof RemoveParticle, {
        query: Partial<Particle>;
        count?: Count;
    }>;
    const Sap: "vacuole.Sap";
    type Sap = ParticleV3<typeof Sap, Particle[]>;
}
declare function createVacuoleParticle(name: typeof vacuoleParticles.SaveParticle, particle: Particle, query?: Partial<Particle>, count?: Count, optionals?: MetaV3Optionals): vacuoleParticles.SaveParticle;
declare function createVacuoleParticle(name: typeof vacuoleParticles.ReadParticle, query: Partial<Particle>, count?: Count, optionals?: MetaV3Optionals): vacuoleParticles.ReadParticle;
declare function createVacuoleParticle(name: typeof vacuoleParticles.RemoveParticle, query: Partial<Particle>, count: Count, optionals?: MetaV3Optionals): vacuoleParticles.RemoveParticle;
declare const organelleName: "vacuole";
declare const createOrganelle: CreateOrganelle;
declare const defaultExport: VacuoleDefaultExport;
export default defaultExport;
