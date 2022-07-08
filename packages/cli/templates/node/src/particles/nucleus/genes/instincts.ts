import { genes } from "@euglena/template";
import { name as vacuoleJsName } from "../../vacuole-js";
import { name as nucleusJsName } from "../../nucleus";

export default [
    genes.vacuoleGetAlive.createGene({
        organelles: {
            vacuole: vacuoleJsName,
            nucleus: nucleusJsName
        },
        parameters: {
            retry: false
        }
    })
];
