import { logger, nucleus, reticulum, timer, ui, vacuole } from "./organelles";

export default [
    ...reticulum.particles,
    ...logger.particles,
    ...nucleus.particles,
    ...vacuole.particles,
    ...timer.particles,
    ...ui.particles
];