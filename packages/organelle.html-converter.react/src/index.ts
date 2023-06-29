import { cp, dco } from "@euglena/core";
import { cell, text } from "@euglena/template";
import { renderToString } from "react-dom/server";


export type Sap = cell.organelle.Sap<{}>;

export default dco<text.HtmlConverter, Sap>({
    Sap: async (_sap) => { },
    ConvertToHtml: async (p) => {
        /**
         * as React.Component
         */
        const component = p.data as any;
        /**
         * convert react component to string; means render to html
         */
        return cp<text.Html>("Html", renderToString(component));
    }
});
