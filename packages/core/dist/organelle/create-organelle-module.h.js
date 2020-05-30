"use strict";
// import { AllOrganelleParticles, InsertSapIntoParticles, InsertSingletonSapIntoParticles, Sap, P } from "./particles.h";
// import { BindOrganelleReactions } from "./bind-reaction.h";
// import { EndoplasmicReticulumModule, OrganelleModule, SingletonOrganelleModule } from "./organelle-module.h";
// import { SingletonOrganelleName } from "./singleton-organelle.h";
// import { BindSingletonOrganelleReactions } from "./bind-reaction.h";
// export type CreateOrganelleModule<
//     COP extends AllOrganelleParticles,
//     OrganelleName extends SingletonOrganelleName | undefined = undefined
// > = OrganelleName extends undefined
//     ? <S extends Sap>(
//           bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, S>>
//       ) => OrganelleModule<S, InsertSapIntoParticles<COP, S>>
//     : OrganelleName extends "EndoplasmicReticulum"
//     ? <S extends P>(
//           bindReactions: BindSingletonOrganelleReactions<OrganelleName, COP, S>
//       ) => EndoplasmicReticulumModule<S, InsertSingletonSapIntoParticles<COP, S>>
//     : <S extends P>(
//           bindReactions: BindSingletonOrganelleReactions<
//               Exclude<OrganelleName, undefined | "EndoplasmicReticulum">,
//               COP,
//               S
//           >
//       ) => SingletonOrganelleModule<S, InsertSingletonSapIntoParticles<COP, S>>;
//# sourceMappingURL=create-organelle-module.h.js.map