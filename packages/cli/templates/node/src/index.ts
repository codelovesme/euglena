import { endoplasmicReticulumJs, loggerConsole, nucleusJs, vacuoleJs } from "./organelles";

export default [
    ...endoplasmicReticulumJs.particles,
    ...loggerConsole.particles,
    ...nucleusJs.particles,
    ...vacuoleJs.particles
];
