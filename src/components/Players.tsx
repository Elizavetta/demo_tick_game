import * as React from "react";
import AppState from "./../AppState";
import { observer } from "mobx-react";

import "./../styles.css";

@observer
export class Players extends React.Component<any, any> {
  render() {
    return (
      <div className="PlayersContainer">
        <div className="PlayerTableHead">
          <div className="pl_count">
            <span className="icon icon-players">
              <span className="path1" />
              <span className="path2" />
            </span>
            <span className="pl_onli">3</span>
          </div>
          <div className="pl_count fr">
            <span className="icon icon-gammdom-symbol" />
            <span className="pl_onli">
              <span>14 282</span>
            </span>
          </div>
        </div>
        <div className="table_titles">
          <div className="pl_name">Имя пользователя</div>
          <div className="pl_name">@</div>
          <div className="pl_name">Ставка</div>
          <div className="pl_name">Прибыль</div>
        </div>

        <div className="pl_table_data">
          {this.props.players.map(function(pl) {
            return (
              <div className="pl_data" key={pl.id}>
                <div className="pl_name">
                  <a className="pl_link" href="/">
                    <span className="image_section">
                      <img
                        src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/5e/5ef357707e5ee1acf0bde23fc9a3497c07e44138.jpg"
                        className="user-logo"
                        alt="Dexter 21"
                      />
                    </span>
                    <span className="bet_levels">
                      <div className="bet_level_40">
                        <span className="bet_level_val">27</span>
                      </div>
                    </span>
                    <span className="pl_name_txt">{pl.username}</span>
                  </a>
                </div>
                <div className="pl_game">-</div>
                <div className="pl_bet">{pl.activeGameBet}</div>
                <div className="pl_profit">-</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
