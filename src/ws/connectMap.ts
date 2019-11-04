import { WS_EVENT } from "./../constants";
import AppState from "./../AppState";
import { GamePlayer } from "./../models/GamePlayer";

export const WS_SIGNAL_MAP: { [index: string]:  (payload: any)=> void  }  = {
  [WS_EVENT.PLAYER_JOINED]: payload => {
    AppState.addGamePlayer(
      new GamePlayer({ ...payload.user, bet: payload.bet_amount })
    );
  },
  [WS_EVENT.PLAYER_LEAVED]: payload => {
    AppState.gamePlayerMove({ ...payload });
  },
  [WS_EVENT.GAME_TICK]: payload => {
    AppState.setTick(payload.coef)
  },
  [WS_EVENT.GAME_CRASH]: payload => {
    AppState.gameFinish(payload);
  }
};
