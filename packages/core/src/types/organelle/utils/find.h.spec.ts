import { Particle } from "../../particle.h";
import { AssertTrue } from "./assert.h";
import { Equals } from "./equals.h";
import { FindParticle } from "./find.h";


type result = FindParticle<Particle<"abc", boolean> | Particle<"def">, "abc">;

export type Result = [
    AssertTrue<Equals<result, Particle<"abc", boolean>>>,
];

