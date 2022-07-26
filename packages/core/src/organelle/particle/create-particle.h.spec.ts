import { Particle } from "../../particle";
import { AssertTrue, Equals } from "../utils";
import { CreateParticle } from "./create-particle.h";

type Abc = Particle<"Abc">;
type Def = Particle<"Def", boolean>;
type Klm = Particle<"Klm", boolean, { version: string }>;
type Xyz = Particle<"Xyz", undefined, { version: string }>;

export type Result = [
    AssertTrue<Equals<CreateParticle<Abc>, (class_: "Abc") => Abc>>,
    AssertTrue<Equals<CreateParticle<Def>, (class_: "Def", data: boolean) => Def>>,
    AssertTrue<Equals<CreateParticle<Klm>, (class_: "Klm", data: boolean, adds: { version: string }) => Klm>>,
    AssertTrue<Equals<CreateParticle<Xyz>, (class_: "Xyz", adds: { version: string }) => Xyz>>,
];