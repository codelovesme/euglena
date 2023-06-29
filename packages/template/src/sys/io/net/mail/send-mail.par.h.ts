import { Particle } from "@euglena/core";

export type SendMail = Particle<"SendMail", {
    receiver: string;
    subject: string;
    cc?: string[];
    bcc?:string[];
    body: string;
}>;