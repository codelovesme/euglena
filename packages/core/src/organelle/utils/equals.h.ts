/**
 * Can't use with union types
 * Union types are basicly type possibilities
 * And Result would be combination of all results
 */
export type Equals<T, K> = T extends K ? (K extends T ? true : false) : false;
