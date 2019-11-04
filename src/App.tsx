import * as React from "react";

import { observer } from "mobx-react";

import { Header } from "./components/Header";
import { TopLine } from "./components/TopLine";
import { Players } from "./components/Players";
import { GameGraph } from "./components/GameGraph";
import AppState from "./AppState";

import "./styles.css";

@observer
export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="gameContainer">
          <TopLine history={AppState.gamehistory} />
          <div>
            <div className="middle_panel">
              <GameGraph tick={AppState.currentTick} paused={AppState.paused} countdown={AppState.countDown} started={AppState.startedAt} stopped={AppState.stoppedAt}/>
            </div>
            <div className="right_panel">
              <Players players={AppState.gameplayers} paused={AppState.paused}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
