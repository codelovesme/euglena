export interface Part {
    x: number;
    y: number;
    w: number;
    h: number;
}
export type Character = {
    parts: Part[];
    offset: number;
};
export declare const createE: (offset: number) => Character;
export declare const createU: (offset: number) => Character;
export declare const createG: (offset: number) => Character;
export declare const createL: (offset: number) => Character;
export declare const createN: (offset: number) => Character;
export declare const createA: (offset: number) => Character;
//# sourceMappingURL=characters.d.ts.map