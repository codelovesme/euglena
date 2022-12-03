import { reticulum, logger, nucleus, vacuole } from "./organelles";

export default [
    ...reticulum.particles,
    ...logger.particles,
    ...nucleus.particles,
    ...vacuole.particles
];
