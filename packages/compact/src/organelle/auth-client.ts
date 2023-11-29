import { Exception, isException, Token } from "../particle";
import { HttpClient } from "./http-client";

export type User = {
    "euglenaName": string,
    "roles": string[],
    "status": string,
    "info": {
        "type": "Human",
        "email": string,
        "name": string,
        "surname": string,
        "birthdate": number,
        "pictureUrl": string
    },
    "id": string
}

type GetEuglenaInfoResponse = {
    "meta": {
        "class": "Impulse"
    },
    "data": {
        "particle": {
            "meta": {
                "class": "Particles"
            },
            "data": [
                {
                    "meta": {
                        "class": "EuglenaInfo",
                        "version": string
                    },
                    "data": User
                }
            ]
        },
        "source": "auth"
    }
}

type ACKResponse = {
    "meta": {
        "class": "Impulse"
    },
    "data": {
        "particle": {
            "meta": {
                "class": "Particles"
            },
            "data": [
                {
                    "meta": {
                        "class": "ACK"
                    }
                }
            ]
        },
        "source": "auth"
    }
}

type ExceptionResponse = {
    "meta": {
        "class": "Impulse"
    },
    "data": {
        "particle": {
            "meta": {
                "class": "Particles"
            },
            "data": [
                {
                    "meta": {
                        "class": "Exception"
                    },
                    "data": {
                        "message": string
                    }
                }
            ]
        },
        "source": "auth"
    }
}

type LoginSuccessResponse = {
    "meta": {
        "class": "Impulse"
    },
    "data": {
        "particle": {
            "meta": {
                "class": "Particles"
            },
            "data": [
                {
                    "meta": {
                        "class": "Session"
                    },
                    "data": {
                        "decryptedToken": {
                            "euglenaName": string,
                            "createdAt": number,
                            "expireAt": number,
                            "type": string,
                            "roles": string[],
                            "status": string
                        },
                        "encryptedToken": string
                    }
                }
            ]
        },
        "source": "auth"
    }
}

export class AuthClient {
    private httpClient: HttpClient;
    constructor(
        /**
         * host:port pair
         */
        destination: string
    ) {
        this.httpClient = new HttpClient(destination);
    }
    async login(username: string, password: string): Promise<Token | Exception> {
        const resp = await this.httpClient.post("/", {
            "meta": {
                "class": "Impulse"
            },
            "data": {
                "particle": {
                    "meta": { "class": "Authenticate" },
                    "data": {
                        "euglenaName": username,
                        "password": password
                    }
                },
                "source": "Postman"
            }
        });
        if (isException(resp)) return resp;
        let {
            data: {
                particle: {
                    data: [token]
                }
            }
        } = resp as LoginSuccessResponse | ExceptionResponse;
        if (token.meta.class === "Exception") return new Exception(`login: Error returned from auth server : ${(token as ExceptionResponse["data"]["particle"]["data"][0]).data.message}`);
        token = token as LoginSuccessResponse["data"]["particle"]["data"][0];
        return new Token(token.data.encryptedToken, token.data.decryptedToken);
    }
    async logout(token: string, source?: string): Promise<void | Exception> {
        const resp = await this.httpClient.post("/", {
            "meta": {
                "class": "Impulse"
            },
            "data": {
                "particle": {
                    "meta": {
                        "class": "Unauthenticate"
                    }
                },
                "token": token,
                "source": source
            }
        });
        if (isException(resp)) return resp;
        const { data: { particle: { data: [ack] } } } = resp as ACKResponse | ExceptionResponse;
        if (ack.meta.class === "Exception") return new Exception(`logout: Error returned from auth server : ${(ack as ExceptionResponse["data"]["particle"]["data"][0]).data.message}`);
    }



    async getUser(token: string, source?: string): Promise<User | Exception> {
        const resp = await this.httpClient.post("/", {
            "meta": {
                "class": "Impulse"
            },
            "data": {
                "particle": {
                    "meta": {
                        "class": "GetEuglenaInfo"
                    }
                },
                "token": token,
                "source": source
            }
        });
        if (isException(resp)) return resp;
        const { data: { particle: { data: [euglenaInfo] } } } = resp as GetEuglenaInfoResponse | ExceptionResponse;
        if (euglenaInfo.meta.class === "Exception") return new Exception(`getUser: Error returned from auth server : ${(euglenaInfo as ExceptionResponse["data"]["particle"]["data"][0]).data.message}`);
        const user = (euglenaInfo as GetEuglenaInfoResponse["data"]["particle"]["data"][0]).data;
        return user;
    }
}