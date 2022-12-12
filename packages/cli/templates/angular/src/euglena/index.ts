import { ce } from '@euglena/template';
import { logger, nucleus, reticulum, timer, ui, vacuole } from "./organelles";

const particles = [
    ...reticulum,
    ...logger,
    ...nucleus,
    ...vacuole,
    ...timer,
    ...ui
];

ce(particles);
