
export interface Particle {
    _class: string;
}

export class Log implements Particle {
    _class = "Log";
    constructor(public message: string, public level: "Info" | "Warning" | "Error") { }
}

export class Exception implements Particle {
    _class = "Exception";
    constructor(public message: string, public innerException?: Exception) { }
}

export const isException = (particle: any): particle is Exception => {
    return particle && particle._class === "Exception";
};

export class ACK implements Particle {
    _class = "ACK";
}

export class State implements Particle {
    _class = "State";
}

export const getFirst = <T>(arr: Array<T>): T => {
    return arr[0];
}

export class Token implements Particle {
    _class = "Token";
    constructor(public token: string) { }
}

export class EuglenaName implements Particle {
    _class = "EuglenaName";
    constructor(public euglenaName:string) {}
}