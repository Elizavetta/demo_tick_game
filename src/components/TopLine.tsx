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
          <div className="TopLineTrackerTxt">
          {
              !this.props.paused &&
              <span> in progress | good luck </span>
            }
            {this.props.paused && this.props.finished &&
              <span>Crashed @ {this.props.tick}x</span>
            }
            {this.props.paused && !this.props.finished &&
              <span> Starting Game </span>
            }
          </div>
        </div>
        <div className="HistoryLine">
          <span className="HistoryLabel">Latest games:</span>
          <div className="HistoryList">
            {this.props.history.map(function(game: GameFinishData) {
              return <div className="HistoryLineItem green" key={game.current_millis}>{game.coef}x</div>;
            })}
          </div>
          <div className="HistoryLineIcon lnr-history" />
        </div>
      </div>
    );
  }
}
