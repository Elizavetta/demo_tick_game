import * as React from "react";
import State from "./../AppState";
import { observer } from "mobx-react";

import "./../styles.css";

export class Header extends React.Component<any, any> {
  render() {
    return (
      <div className="Header">
        <div className="MenuContainer">
          <div className="Menu">
            <div className="MenuItem">HOME</div>
            <div className="MenuItem active">Crash</div>
            <div className="MenuItem">Roulette</div>
            <div className="MenuItem">Джекпот</div>
            <div className="MenuItem">TradeUp</div>
            <div className="MenuItem">Hilo</div>
          </div>
        </div>
      </div>
    );
  }
}
