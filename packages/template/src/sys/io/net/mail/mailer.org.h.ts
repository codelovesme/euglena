import { createOrganelleInteractions } from "@euglena/core";
import { Exception } from "../../../../exception.par.h";
import { SendMail } from "./send-mail.par.h";
import { ACK } from "../../../../ack.par.h";
import { Log } from "../../../../log";


export type Mailer = createOrganelleInteractions<{
    in: [[SendMail, ACK | Exception]];
    out: [Log];
}>;
