import * as cessnalib from "cessnalib";
import { Particle, cp } from "@euglena/core";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";
import { ReadParticle, SaveParticle, Vacuole } from "../../store/vacuole";
import { EuglenaInfo } from "./euglena-info.par.h";
import { createException, isException } from "../../../../exception.par.u";
import { validatePassword, validateUsernameCharacters, validateUsernameDisallowedList } from "./signup.gene.u";
import { getFirstParticle } from "../../../../particles.par.u";
import { Encrypt, Encryptor } from "../../../crypt";
import { GenerateTokenTransmit, generateSession } from "./auth.u";
import { ACK } from "../../../../ack.par.h";
import { ConvertToHtml, HtmlConverter } from "../../../../text";
import { Mailer, SendMail } from "../mail";
import { Exception } from "../../../../exception.par.h";
import { Particles } from "../../../../particles.par.h";
import { EmailVerificationCodeMailTemplate } from "./email-verification-code-mail-template.par.h";



export type SignUp = Particle<"SignUp", {
    email: string;
    username: string;
    password: string;
    name?: string;
    surname?: string;
    birthdate?: number;
}>

type Organelles = {
    permanentVacuole: Vacuole;
    temporaryVacuole: Vacuole;
    bcrypt: Encryptor;
    jwt: Encryptor;
    htmlConverter: HtmlConverter;
    mailer: Mailer;
};

export const createGeneSignUp = dcg<
    Pulse<SignUp>,
    Organelles
>(
    "SignUp",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "SignUp" } } } },
    async ({ data: { particle: { data } } }, _, { t }) => {
        /**
         * Input validation
         */
        if (!cessnalib.sys.StaticTools.Email.validateEmail(data.email)) {
            return createException("Exception", new cessnalib.sys.Exception("Given email address is invalid."));
        }
        if (!validateUsernameCharacters(data.username)) {
            return createException("Exception", new cessnalib.sys.Exception("Username should be at least 4 character long, maximum 20 character long"));
        }
        if (!validateUsernameDisallowedList(data.username)) {
            return createException("Exception", new cessnalib.sys.Exception("There is already a registered user with given username"));
        }
        if (!validatePassword(data.password)) {
            return createException("Exception", new cessnalib.sys.Exception("Password must be at least 8 characters long. It must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."));
        }

        /**
         * Find user by email
         */
        const findUserByEmail = cp<ReadParticle>("ReadParticle", {
            count: 1,
            query: { data: { info: { email: data.email } } }
        });
        const result = await t(findUserByEmail, "permanentVacuole");
        if (isException(result)) return result;
        if (getFirstParticle(result)) {
            return createException("Exception", new cessnalib.sys.Exception("There is already a registered user with given email address"))
        }

        /**
         * findUserByUsername
         */
        const findUserByEuglenaName = cp<ReadParticle>("ReadParticle", {
            count: 1,
            query: { data: { euglenaName: data.username } }
        });
        const result2 = await t(findUserByEuglenaName, "permanentVacuole");
        if (isException(result2)) return result2;
        if (getFirstParticle(result2)) {
            return createException("Exception", new cessnalib.sys.Exception("There is already a registered user with given username"))
        }

        /**
         * Encrypt password
         */
        const encryptedPassword = await t(cp<Encrypt>("Encrypt", data.password), "bcrypt");

        /**
         * save user into db
         */
        const euglenaInfo = cp<EuglenaInfo>("EuglenaInfo", {
            euglenaName: data.username,
            password: encryptedPassword.data,
            roles: ["user"],
            status: "NeedsVerification",
            info: {
                type: "Human",
                email: data.email,
                birthdate: data.birthdate,
                name: data.name,
                surname: data.surname
            }
        });
        const saveUser = cp<SaveParticle>("SaveParticle", {
            count: 1,
            query: {},
            particle: euglenaInfo
        });
        const saveUserResponse = await t(saveUser, "permanentVacuole");
        if (isException(saveUserResponse)) return saveUserResponse;

        /**
        * generate session
        */
        type O = Omit<Organelles, "htmlConverter" | "mailer">;
        const session = await generateSession<O>(t as GenerateTokenTransmit<O>, euglenaInfo, "permanentVacuole", "jwt");
        if (isException(session)) return session;

        /**
         * get email html template from memory
         */
        const getMailTemplate = cp<ReadParticle>("ReadParticle", {
            count: 1,
            query: { meta: { class: "EmailVerificationCodeMailTemplate" } }
        });
        const mailTemplates = await t(getMailTemplate, "temporaryVacuole") as Exception | Particles<EmailVerificationCodeMailTemplate>;
        if (isException(mailTemplates)) return mailTemplates;
        const mailTemplate = getFirstParticle(mailTemplates);
        if (!mailTemplate) return createException("Exception", new cessnalib.sys.Exception("Email verification code mail template has not been loaded into vacuole"));

        /**
         * render email template to html
         */
        const convertToHtml = cp<ConvertToHtml>("ConvertToHtml", mailTemplate.data({
            userName: euglenaInfo.data.euglenaName,
            verificationLink: `http://localhost:3000/verification?code=${session.data.encryptedToken}`
        }));
        const html = await t(convertToHtml, "htmlConverter");

        /**
         * send verification email
        */
        const sendMail = cp<SendMail>("SendMail", {
            body: html.data,
            receiver: data.email,
            subject: "Email Verification"
        });
        const sendMailResult = await t(sendMail, "mailer");
        if (isException(sendMailResult)) return sendMailResult;

        return cp<ACK>("ACK");
    },
);