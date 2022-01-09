import { State } from "../euglena/state";
import Banner from "./banner/banner";

import "./app.css";

export default (state: State) => {
  const hour = `${state.time.clock.hour}`.padStart(2, "0");
  const minute = `${state.time.clock.minute}`.padStart(2, "0");
  const second = `${state.time.clock.second}`.padStart(2, "0");
  let time: string = `${hour}:${minute}:${second}`;

  return (
    <div className="center">
      <div className="banner-container"><Banner /></div>
      <div className="time-container">
        <span className="time">{time}</span>
      </div>
    </div>
  );
};
