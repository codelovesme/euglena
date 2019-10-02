import { Particle, cp } from "@euglena/particle";
import { domc } from "@euglena/organelle";
import { ccp } from "@euglena/common";

export default domc("EndoplasmicReticulum", {
    incoming: {
        TransmitParticle: (particle: Particle, target: string) => cp("TransmitParticle", { target, particle }),
        OrganelleInfo: (
            name: string,
            location: {
                type: "FileSystemPath" | "NodeModules" | "Url";
                path: string;
            },
            nick?: string
        ) =>
            cp("OrganelleInfo", {
                name,
                location,
                nick
            })
    },
    outgoing: {
        Log: ccp.Log,
        TransmitResponse: (particle: Particle | void) => cp("TransmitResponse", particle),
        EuglenaHasBeenBorn: () => cp("EuglenaHasBeenBorn", undefined)
    }
});
