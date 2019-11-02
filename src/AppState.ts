import { observable, action, computed } from "mobx";
import { Connection } from "./ws/connect";
import { GamePlayer } from "./models/GamePlayer";
import { MovePlayerData, GameFinishData } from "./models/wsData";
import { GAME_HISTORY_LENGTH } from "./constants";

export class AppState {
  @observable gamehistory: GameFinishData[];
  @observable gameplayers: GamePlayer[];
  @observable paused: boolean;
  @observable nextRoundTick: number;
  @observable currentTick: number;

  private _conn: Connection;

  constructor() {
    this.gamehistory = [];
    this.gameplayers = [];
    this.pause = true;
    this.nextRoundTick = 0;
    this.currentTick = 0;
    this.initConnection();
  }

  @computed get historyLastGames() {
    if (this.gamehistory.length <= 5) return this.gamehistory;
    return this.gamehistory.slice(this.gamehistory.length - 5, 5);
  }

  @action
  initConnection = (): void => {
    this._conn = new Connection();
  };

  @action
  addGamePlayer = (player: GamePlayer): void => {
    this.gameplayers.push(player);
  };

  @action
  gamePlayerMove = (payload: MovePlayerData): void => {
    this.gameplayers = this.gameplayers.map(pl => {
      if (pl.id === payload.user.id) {
        //upd result
        pl.completed = true;
        pl.profit = payload.profit;
      }
      return pl;
    });
  };

  @action
  deleteGamePlayer = (id: number): void => {
    this.gameplayers = this.gameplayers.filter(pl => pl.id !== id);
  };

  @action
  clearAllPlayers = (): void => {
    this.gameplayers = [];
  };

  @action
  setTick = (t: number): void => {
    this.currentTick = t;
  };

  @action
  gameStart = (): void => {
    this.clearAllPlayers();
    this.pause = false;
    this.nextRoundTick = 0;
    console.log("gamestart");
  };

  @action
  planGameStart = (): void => {
    setTimeout(this.gameStart, (this.nextRoundTick - Date.now() * 1000) / 1000);
  };

  @action
  gameFinish = (payload: GameFinishData): void => {
    this.pause = true;
    this.gamehistory.push(payload);
    this.nextRoundTick = payload.next_round_millis;
    if (this.gamehistory.length > GAME_HISTORY_LENGTH) {
      this.gamehistory = this.gamehistory.slice(
        this.gamehistory.length - GAME_HISTORY_LENGTH,
        GAME_HISTORY_LENGTH
      );
    }
    this.planGameStart();
  };
}

let state = new AppState();

(window as any).state = state;
export default state;
