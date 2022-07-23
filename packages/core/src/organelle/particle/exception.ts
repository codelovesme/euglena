import {sys} from "cessnalib";
import { P, FromP } from "../particles.h";

export type PException = P<sys.type.Exception>;
export type Exception = FromP<"Exception", PException>;
