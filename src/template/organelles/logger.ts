import { cp } from "../../core/particle";
import { com } from "../../core/organelle";
import { ccp } from "../common-particles";

export const logger = com(
  "Logger",
  {
    incoming: {
      LoggerLog: (message: string, level: "Error" | "Warning" | "Info") => cp("LoggerLog", { message, level })
    },
    outgoing: {
      ACK: ccp["ACK"],
      Exception: ccp["Exception"]
    }
  },
  add => {
    add("LoggerLog", async (particle, { r, cp }) => {
      console.log(`${new Date()} ${particle.data.message}`);
    });
  }
);
