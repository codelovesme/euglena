export type Impulse = particle.Particle<
    "Impulse",
    {
        particle: Particle;
        source: string;
        token?: string;
    }
>;