import { Equals } from "./equals.h";
import { AssertFalse, AssertTrue } from "./assert.h";

export type Result = [
    AssertTrue<Equals<{}, object>>,
    AssertTrue<Equals<object, {}>>,
    AssertTrue<Equals<{ a: 12 }, { a: 12 }>>,
    AssertFalse<Equals<12, number>>,
    AssertFalse<Equals<number, 12>>
];
