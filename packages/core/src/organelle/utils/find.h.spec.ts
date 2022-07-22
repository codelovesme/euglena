import { FindParticle } from "./find.h";
import { Particle } from "../../particle";
import { Equals } from "./equals.h";
import { AssertTrue } from "./assert.h";

type result = FindParticle<Particle<"abc", boolean> | Particle<"def">, "abc">;

export type Result = [
    AssertTrue<Equals<result, Particle<"abc", boolean>>>,
];

