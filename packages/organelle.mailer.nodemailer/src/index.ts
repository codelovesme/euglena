import * as cessnalib from "cessnalib";
import { dco } from "@euglena/core";
import { cell, createException, sys } from "@euglena/template";
import * as nodemailer from "nodemailer";

/**
 * host: smtp.yandex.ru
 * port: 465
 * from: '"CODELOVES.ME" <fedai@codeloves.me>'
 */
export type Sap = cell.organelle.Sap<
    {
        host: string;
        port: number;
        mail: { sender: string; };
        auth: {
            user: string
            password: string;
        }
    }
>;

let sapData: Sap["data"];

export default dco<sys.io.net.mail.Mailer, Sap>({
    Sap: async (_sap) => {
        sapData = _sap.data;
    },
    SendMail: async (p, { t, cp }) => {
        const { bcc, body, cc, receiver, subject } = p.data;
        try {
            let transporter = nodemailer.createTransport({
                host: sapData.host,
                port: sapData.port,
                secure: true,
                auth: {
                    user: sapData.auth.user,
                    pass: sapData.auth.password,
                },
            });

            let info = await transporter.sendMail({
                from: sapData.mail.sender,
                to: receiver,
                subject: subject,
                html: body,
                bcc: bcc,
                cc: cc
            });
            t(cp("Log", { level: "Info", message: `Message sent: ${info.messageId}` }));
            t(cp("Log", { level: "Info", message: `Preview URL: ${nodemailer.getTestMessageUrl(info)}` }));
            return cp("ACK");
        } catch (error: any) {
            return createException("Exception", new cessnalib.sys.Exception(`Error occurred while sending a mail. Error: ${error.message}`));
        }
    }
});
