import { WS_EVENT } from "./../constants";
import AppState from "./../AppState";
import { GamePlayer } from "./../models/GamePlayer";

export const WS_SIGNAL_MAP = {
  [WS_EVENT.PLAYER_JOINED]: payload => {
    //console.log("joined", payload);
    AppState.addGamePlayer(
      new GamePlayer({ ...payload.user, bet: payload.bet_amount })
    );
  },
  [WS_EVENT.PLAYER_LEAVED]: payload => {
    //console.log("leaved", payload);
    AppState.gamePlayerMove({ ...payload });
  },
  [WS_EVENT.GAME_TICK]: payload => {
    //console.log("tick", payload.coef);
    //AppState.setTick(payload.coef)
  },
  [WS_EVENT.GAME_CRASH]: payload => {
    console.log("crash", payload);
    AppState.gameFinish(payload);
  }
};
