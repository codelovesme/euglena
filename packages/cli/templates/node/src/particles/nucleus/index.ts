import { nucleusJs } from "@euglena/template";
import genes from "./genes";

export const name = "Nucleus";
export const particles = [
  nucleusJs.cs({
    type: "InMemory",
    genes: genes,
  }),
];
