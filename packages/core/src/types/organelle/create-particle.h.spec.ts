import { Particle } from "../particle.h";
import { CreateParticle, CreateParticleUnion } from "./create-particle.h";
import { AssertSuper, AssertTrue, Equals } from "./utils";

type Abc = Particle<"Abc">;
type Def = Particle<"Def", boolean>;
type Klm = Particle<"Klm", boolean, { version: string }>;
type Xyz = Particle<"Xyz", undefined, { version: string }>;

export type Result = [
    AssertTrue<Equals<CreateParticle<Abc>, (class_: "Abc") => Abc>>,
    AssertTrue<Equals<CreateParticle<Def>, (class_: "Def", data: boolean) => Def>>,
    AssertTrue<Equals<CreateParticle<Klm>, (class_: "Klm", data: boolean, adds: { version: string }) => Klm>>,
    AssertTrue<Equals<CreateParticle<Xyz>, (class_: "Xyz", data: undefined, adds: { version: string }) => Xyz>>,

    AssertSuper<CreateParticleUnion<Abc | Def>, CreateParticle<Abc> & CreateParticle<Def>>,
    AssertSuper<CreateParticle<Abc> & CreateParticle<Def>, CreateParticleUnion<Abc | Def>>
];