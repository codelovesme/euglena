import { FromP, P } from "./particles.h";
export declare type PMatter = P<Array<{
    pm: number;
    value: number;
    type: "Normal" | "Atmos" | "Count";
}>>;
export declare type Matter = FromP<"Matter", PMatter>;
declare const matter: {
    v1: any;
};
export { matter };
