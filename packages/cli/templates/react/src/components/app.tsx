import { State } from "../state";
import Banner from "./banner/banner";

import "./app.css";

const padIfUndefined = <T extends unknown>(value: T, callback: (value: Exclude<T, undefined>) => string, pad: string="-") =>
    value === undefined ? pad : callback(value as Exclude<T, undefined>);

export default (state: State) => {
    const time = padIfUndefined(
        state.data,
        (value) => {
            const hour = `${value.time.clock.hour}`.padStart(2, "0");
            const minute = `${value.time.clock.minute}`.padStart(2, "0");
            const second = `${value.time.clock.second}`.padStart(2, "0");
            return `${hour}:${minute}:${second}`;
        },
        "00:00:00"
    );

    return (
        <div className="center">
            <div className="banner-container">
                <Banner />
            </div>
            <div className="time-container">
                <span className="time">{time}</span>
            </div>
        </div>
    );
};
