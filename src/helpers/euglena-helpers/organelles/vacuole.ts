import { OrganelleDefaultExport, CreateOrganelle } from "../../../organelle";
import { ParticleV3, Particle, MetaV3Optionals, Meta } from "../../../particle";
import { createParticle, commonParticles, createCommonParticle } from "../../particle-helpers";
import { createMetaV3 } from "../../particle-helpers";
import { js } from "cessnalib";
import { defO } from "../../organelle-helpers";

export type VacuoleDefaultExport = OrganelleDefaultExport<typeof organelleName, typeof createOrganelle, typeof createVacuoleParticle, typeof vacuoleParticles>;
export type Count = number | "all";

export namespace vacuoleParticles {
  export const ReadParticle: "vacuole.ReadParticle" = "vacuole.ReadParticle";
  export type ReadParticle = ParticleV3<typeof ReadParticle, { query: Partial<Particle>; count?: Count }>;

  export const SaveParticle: "vacuole.SaveParticle" = "vacuole.SaveParticle";
  export type SaveParticle = ParticleV3<typeof SaveParticle, { particle: Particle; query?: Partial<Particle>; count?: Count }>;

  export const RemoveParticle: "vacuole.RemoveParticle" = "vacuole.RemoveParticle";
  export type RemoveParticle = ParticleV3<typeof RemoveParticle, { query: Partial<Particle>; count?: Count }>;

  export const Sap: "vacuole.Sap" = "vacuole.Sap";
  export type Sap = ParticleV3<typeof Sap, Particle[]>;
}

function createVacuoleParticle(
  name: typeof vacuoleParticles.SaveParticle,
  createdBy: string,
  particle: Particle,
  query?: Partial<Particle>,
  count?: Count,
  optionals?: MetaV3Optionals
): vacuoleParticles.SaveParticle;
function createVacuoleParticle(
  name: typeof vacuoleParticles.ReadParticle,
  createdBy: string,
  query: Partial<Particle>,
  count?: Count,
  optionals?: MetaV3Optionals
): vacuoleParticles.ReadParticle;
function createVacuoleParticle(
  name: typeof vacuoleParticles.RemoveParticle,
  createdBy: string,
  query: Partial<Particle>,
  count: Count,
  optionals?: MetaV3Optionals
): vacuoleParticles.RemoveParticle;
function createVacuoleParticle(
  name: typeof vacuoleParticles[keyof typeof vacuoleParticles],
  createdBy: string,
  ...remains: any[]
): ParticleV3<typeof vacuoleParticles[keyof typeof vacuoleParticles], unknown> {
  switch (name) {
    case vacuoleParticles.SaveParticle:
      const [particle1, query1, count1, optionals1] = remains as [Particle, Partial<Particle>, Count, MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals1), {
        particle: particle1,
        createdBy,
        query: query1,
        count: count1
      });
    case vacuoleParticles.ReadParticle:
      const [query2, count2, optionals2] = remains as [Partial<Particle>, Count, MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals2), {
        createdBy,
        query: query2,
        count: count2
      });
    case vacuoleParticles.RemoveParticle:
      const [query3, count3, optionals3] = remains as [Partial<Particle>, Count, MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals3), {
        createdBy,
        query: query3,
        count: count3
      });
    case vacuoleParticles.Sap:
      const [particles, optionals4] = remains as [Particle[], MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals4), particles);
  }
}

const createOrganelle: CreateOrganelle = defO((addReaction, receive) => {
  let _particles: Particle[] = [];

  addReaction(vacuoleParticles.Sap, async (sap: vacuoleParticles.Sap) => {
    _particles = sap.data;
    return createCommonParticle(commonParticles.ACK, organelleName);
  });

  addReaction(vacuoleParticles.ReadParticle, async (particle: vacuoleParticles.ReadParticle) => {
    const { query, count } = particle.data;
    const retVal: Particle[] = [];
    for (let i = 0, len = 0; i < _particles.length && (count === "all" || len < count); i++) {
      if (js.Class.doesMongoCover(_particles[i], query)) {
        retVal.push(_particles[i]);
        len++;
      }
    }
    return createCommonParticle(commonParticles.Particles, organelleName, retVal);
  });
  addReaction(vacuoleParticles.SaveParticle, async (particle: vacuoleParticles.SaveParticle) => {
    const { query, count } = particle.data;
    const overridedParticles: Meta[] = [];
    if (query) {
      let overrideCount = 0;
      for (let i = 0; i < _particles.length && (count === "all" || overrideCount < count); i++) {
        if (js.Class.doesMongoCover(_particles[i], query)) {
          overridedParticles.push(_particles[i].meta);
          _particles[i] = particle;
          overrideCount++;
        }
      }
    } else {
      _particles.push(particle);
    }
    return createCommonParticle(commonParticles.Metas, organelleName, overridedParticles);
  });
  addReaction(vacuoleParticles.RemoveParticle, async (particle: vacuoleParticles.RemoveParticle) => {
    const { query, count } = particle.data;
    const removedParticles: Meta[] = [];
    if (query) {
      let removeCount = 0;
      for (let i = 0; i < _particles.length && (count === "all" || removeCount < count); i++) {
        if (js.Class.doesMongoCover(_particles[i], query)) {
          const removed = _particles.splice(i--, 1)[0];
          removedParticles.push(removed.meta);
          removeCount++;
        }
      }
    }
    return createCommonParticle(commonParticles.Metas, organelleName, removedParticles);
  });
});

const organelleName: "vacuole" = "vacuole";
const defaultExport: VacuoleDefaultExport = [organelleName, createOrganelle, createVacuoleParticle, vacuoleParticles];
export default defaultExport;
