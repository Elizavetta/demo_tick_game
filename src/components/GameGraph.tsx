import * as React from "react";
import AppState from "./../AppState";
import { observer } from "mobx-react";
import Pixi from "pixi.js";

import "./../styles.css";

@observer
export class GameGraph extends React.Component<any, any> {
  startPixiApp() {}

  render() {
    return (
      <div className="GameStage">
        <div className="GameGraphContainer">
          <div className="max-profit">
            <i className="clickable fa fa-line-chart" />
            Max profit: 10 000 000 coins
          </div>
        </div>
        <canvas id="GameApp" />
      </div>
    );
  }
}
