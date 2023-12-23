
export abstract class Particle<T extends string = string> {
    constructor(public _class: T) { }
}

export class Log extends Particle<"Log"> {
    constructor(public message: string, public level: "Info" | "Warning" | "Error") {
        super("Log");
    }
}

export class Exception extends Particle<"Exception"> {
    constructor(public message: string, public innerException?: Exception) {
        super("Exception");
    }
}

export const isException = (particle: unknown): particle is Exception => {
    return typeof particle === "object"
        && particle !== null
        && "_class" in particle
        && particle._class === "Exception";
};

export class ACK extends Particle<"ACK"> {
    constructor() {
        super("ACK");
    }
}

export class State extends Particle<"State"> {
    constructor() {
        super("State");
    }
}

export const getFirst = <T>(arr: Array<T>): T => {
    return arr[0];
}

export class Token extends Particle<"Token"> {
    constructor(public encryptedToken: string, public decryptedToken: {
        euglenaName: string,
        createdAt: number,
        expireAt: number,
        type: string,
        roles: string[],
        status: string
    }) { super("Token"); }
}

export class EuglenaName extends Particle<"EuglenaName"> {
    constructor(public euglenaName: string) {
        super("EuglenaName");
    }
}