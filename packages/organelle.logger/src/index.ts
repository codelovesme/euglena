import { cp } from "@euglena/particle";
import { domc } from "@euglena/organelle";
import { ccp } from "@euglena/common";

export default domc("Logger", {
  incoming: {
    Log: (message: string, level: "Error" | "Warning" | "Info") => cp("Log", { message, level })
  },
  outgoing: {
    ACK: ccp.ACK,
    Exception: ccp.Exception
  }
});
