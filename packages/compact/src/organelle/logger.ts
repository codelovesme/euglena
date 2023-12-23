import moment from "moment";
import { Log } from "../particle";

export class Logger {
    log(message: string, level: Log["level"] = "Info") {
        console.log(`${level} - ${moment().format("YYYY.MM.DD HH:mm:ss")} - ${message}`);
    }
    info(message: string) {
        this.log(message, "Info");
    }
    warning(message: string) {
        this.log(message, "Warning");
    }
    error(message: string) {
        this.log(message, "Error");
    }
}