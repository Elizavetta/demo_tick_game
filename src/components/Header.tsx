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
            <div className="MenuItem">
              <div className="MenuItemIcon lnr-home"></div>
              <div>HOME</div>
            </div>
            <div className="MenuItem active">
              <div className="MenuItemIcon lnr-home"></div>
              <div>Crash</div>
            </div>
            <div className="MenuItem">
              <div className="MenuItemIcon lnr-home"></div>
              <div>Roulette</div>
            </div>
            <div className="MenuItem">
              <div className="MenuItemIcon lnr-home"></div>
              <div>Джекпот</div>
            </div>
            <div className="MenuItem">
              <div className="MenuItemIcon lnr-home"></div>
              <div>TradeUp</div>
            </div>
            <div className="MenuItem">
              <div className="MenuItemIcon lnr-home"></div>
              <div>Hilo</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
