import { ce } from '@euglena/template';
import { logger, nucleus, reticulum, timer, ui, vacuole } from "./organelles";

const particles = [
    ...reticulum.particles,
    ...logger.particles,
    ...nucleus.particles,
    ...vacuole.particles,
    ...timer.particles,
    ...ui.particles
];

ce(particles);
