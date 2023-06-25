import { Particle } from "@euglena/core";

export type EmailVerificationCodeMailTemplate =
    Particle<"EmailVerificationCodeMailTemplate",
        ({ userName, verificationLink }: { userName: string, verificationLink: string }) => unknown>;