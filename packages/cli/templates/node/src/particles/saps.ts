import { nucleusJs as nucleus } from "@euglena/core";
import vacuoleJs from "@euglena/organelle.vacuole.js";
import seeds from "../particles/seeds";

export default [
    nucleus.cs({
        path: __dirname + "/chromosome.js",
        type: "FileSystemPath"
    }),
    vacuoleJs.cs(
        {
            type: "InMemory",
            particles: seeds
        },
        { organelleName: "Vacuole" }
    )
];
