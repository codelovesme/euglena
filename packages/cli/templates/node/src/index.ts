import { particles as nucleusParticles } from "./particles/nucleus";
import { particles as vacuoleJsParticles } from "./particles/vacuole-js";
import { particles as loggerParticles } from "./particles/logger-console";

export default [
  ...nucleusParticles,
  ...vacuoleJsParticles,
  ...loggerParticles,
];
