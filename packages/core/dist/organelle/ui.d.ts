import { P, FromP } from "./particles.h";
declare type PEvent = P;
export declare type Event = FromP<"Event", PEvent>;
declare const ui: {
    v1: any;
};
export { ui };
