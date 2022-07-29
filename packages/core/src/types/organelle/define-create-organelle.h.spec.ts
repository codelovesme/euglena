import { sys } from "cessnalib";
import { dco, Exception } from "../../utils";
import { Particle } from "../particle.h";
import { AllInteractions } from "./all-interactions.h";
import { OrganelleTransmit } from "./organelle-receive.h";
import { AssertSuper, AssertTrue, Equals } from "./utils";

type Aoc = Particle<"Aoc", boolean>;
type Boc = Particle<"Boc">;
type Coc = Particle<"Coc", boolean, { version: string }>;
type Doc = Particle<"Doc">;
type CocResponse = Particle<"CocResponse", boolean>;
type AocResponse = Particle<"AocResponse", boolean>;

type COP = AllInteractions<{
    in: [[Aoc, AocResponse], [Boc]];
    out: [[Coc, CocResponse], [Doc]];
}>;

type SapInteraction = [Particle<"Sap", { a: string; b: number }>];

dco<COP, SapInteraction>({
    Sap: async (p) => {},
    Aoc: async (p, { t, cp }) => {
        true as unknown as [
            AssertTrue<Equals<typeof p, Aoc>>,
            AssertSuper<typeof t, OrganelleTransmit<Coc | Doc, CocResponse>>,
            AssertTrue<
                Equals<
                    typeof cp,
                    {
                        Coc: (
                            data: boolean,
                            adds: {
                                version: string;
                            }
                        ) => Coc;
                        Doc: () => Doc;
                    } & {
                        AocResponse: (data: boolean) => AocResponse;
                    }& {
                        Exception: (data: sys.type.Exception) => Exception;
                    }
                >
            >
        ];

        return "a" in t ? {} as AocResponse : {} as Exception;
    },
    Boc: async () => {}
});
