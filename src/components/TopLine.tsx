import * as React from "react";
import State from "./../AppState";
import { observer } from "mobx-react";
import { GameFinishData } from "./../models/wsData";

import "./../styles.css";

export class TopLine extends React.Component<any, any> {
  render() {
    return (
      <div className="TopLineContainer">
        <div className="TopLineTracker">
          <div className="TopLineTrackerTxt">in progress | good luck</div>
        </div>
        <div className="HistoryLine">
          <span className="HistoryLabel">Latest games:</span>
          <div className="HistoryList">
            {this.props.history.map(function(game: GameFinishData) {
              return <div className="HistoryLineItem green" key={game.current_millis}>{game.coef}x</div>;
            })}
          </div>
          <div className="HistoryLineIcon" />
        </div>
      </div>
    );
  }
}
