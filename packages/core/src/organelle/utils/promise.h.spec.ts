import { MakePromise } from "./promise.h";
import { AssertTrue } from "./assert.h";
import { Equals } from "./equals.h";

export type Result = [
    AssertTrue<Equals<MakePromise<void>, Promise<void>>>,
    AssertTrue<Equals<Promise<void>, MakePromise<void>>>,
    AssertTrue<Equals<Promise<false>, MakePromise<false>>>,
    AssertTrue<Equals<Promise<true>, MakePromise<true>>>,
    AssertTrue<Equals<Promise<string>, MakePromise<string>>>,
];
