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

const createCharacterCreate = (parts: Part[]) => (
  offset: number
): Character => ({
  parts,
  offset,
});

export const createE = createCharacterCreate([
  { x: 10, y: 10, w: 40, h: 200 },
  { x: 50, y: 10, w: 120, h: 40 },
  { x: 50, y: 90, w: 80, h: 40 },
  { x: 50, y: 170, w: 120, h: 40 },
]);
export const createU = createCharacterCreate([
  { x: 10, y: 10, w: 40, h: 200 },
  { x: 50, y: 170, w: 120, h: 40 },
  { x: 170, y: 10, w: 40, h: 200 },
]);
export const createG = createCharacterCreate([
  { x: 10, y: 10, w: 40, h: 200 },
  { x: 50, y: 10, w: 160, h: 40 },
  { x: 50, y: 170, w: 120, h: 40 },
  { x: 170, y: 90, w: 40, h: 120 },
  { x: 90, y: 90, w: 80, h: 40 },
]);
export const createL = createCharacterCreate([
  { x: 10, y: 10, w: 40, h: 200 },
  { x: 50, y: 170, w: 130, h: 40 },
]);
export const createN = createCharacterCreate([
  { x: 10, y: 10, w: 40, h: 200 },
  { x: 170, y: 10, w: 40, h: 200 },
  { x: 50, y: 10, w: 40, h: 40 },
  { x: 50, y: 50, w: 60, h: 40 },
  { x: 70, y: 90, w: 80, h: 40 },
  { x: 110, y: 130, w: 60, h: 40 },
  { x: 130, y: 170, w: 40, h: 40 },
]);
export const createA = createCharacterCreate([
  { x: 10, y: 10, w: 40, h: 200 },
  { x: 150, y: 10, w: 40, h: 200 },
  { x: 50, y: 10, w: 100, h: 40 },
  { x: 50, y: 90, w: 100, h: 40 },
]);
