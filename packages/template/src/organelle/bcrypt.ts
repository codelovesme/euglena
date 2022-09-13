import { AllInteractions, Particle } from "@euglena/core";

export type Namespace = "Bcrypt";

export type Hash = Particle<"Hash", string, { namespace: Namespace }>;
export type Compare = Particle<
    "Compare",
    {
        plainPassword: string;
        hashedPassword: string;
    },
    { namespace: Namespace }
>;
export type HashedPassword = Particle<"HashedPassword", string, { namespace: Namespace }>;
export type CompareResult = Particle<"CompareResult", boolean, { namespace: Namespace }>;

export type Bcrypt = AllInteractions<{
    in: [[Hash, HashedPassword], [Compare, CompareResult]];
    out: [];
}>;
