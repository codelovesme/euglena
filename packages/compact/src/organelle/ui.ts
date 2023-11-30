import { Particle} from "../particle";

export interface Nucleus {
    handleEvent(event: Particle): void;
}