import renderTime from "./instinct/render-time";
import ui from "../organelles/ui";

const organelles = {
    ui: ui.name
}

export default [
    renderTime(organelles)
];
