import { P, FromP } from "../particles.h";

export type ACK = FromP<"ACK", PACK>;
export type PACK = P<undefined>;