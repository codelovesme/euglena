import { cp, MetaAdditions } from "@euglena/particle";
import { domc } from "@euglena/organelle";
import { ccp } from "@euglena/common";

export default domc("GPS", {
    incoming: {},
    outgoing: {
        Coordinate: (lat: number, lng: number, adds?: MetaAdditions) => cp("Coordinate", { lat, lng }, adds),
        Log: ccp.Log
    }
});
