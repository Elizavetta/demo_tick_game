import { observable, action, computed } from "mobx";
import { Connection } from "./ws/connect";
import { GamePlayer } from "./models/GamePlayer";
import { MovePlayerData, GameFinishData } from "./models/wsData";
import { GAME_HISTORY_LENGTH } from "./constants";

export class AppState {
  @observable gamehistory: GameFinishData[];
  @observable gameplayers: GamePlayer[];
  @observable paused: boolean = false;
  @observable nextRoundTick: number;
  @observable currentTick: number;
  @observable countDown: number;
  @observable startedAt: number = 0;
  @observable stoppedAt: number = 0;

  private _conn: Connection;
  private _cdint: any;

  constructor() {
    this.gamehistory = [];
    this.gameplayers = [];
    this.paused = true;
    this.nextRoundTick = 0;
    this.currentTick = 0;
    this.countDown = 0;

    this._conn = new Connection();
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
    if (this.paused) {
      this.gameStartPlayers();
    }
    this.gameplayers.push(player);
    //console.log('addGamePlayer', this.gameplayers.length);
    console.timeEnd('roundstart');
  };

  @action
  gamePlayerMove = (payload: MovePlayerData): void => {
    this.gameplayers = this.gameplayers.map(pl => {
      if (pl.id === payload.user.id) {
        pl.completed = true;
        pl.profit = payload.profit;
        pl.coef = payload.coef;
        //console.log('move player upd', payload.user.id);
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
    this.startedAt = Date.now();
    this.nextRoundTick = 0;
    clearInterval(this._cdint);
    this.countDown = 0;
  };

  @action
  gameStartPlayers = (): void => {
    this.clearAllPlayers();
    this.paused = false;
    this.startedAt = 0;
    this.stoppedAt = 0;
  }

  @action
  planGameStart = (): void => {
    //console.log('planGameStart', this.gamehistory.length, this.gameplayers.length, this.nextRoundTick - Date.now());
    console.time('roundstart');
    //!
    setTimeout(this.gameStart, this.nextRoundTick - Date.now());
    this.countDown = Math.floor((this.nextRoundTick - Date.now())/100)/10;
    this._cdint = setInterval(()=>{
      this.countDown = Math.floor((this.nextRoundTick - Date.now()) / 100) / 10;
    }, 100);
  };

  @action
  gameFinish = (payload: GameFinishData): void => {
    this.paused = true;
    this.stoppedAt = Date.now();
    this.gamehistory.push(payload);
    this.nextRoundTick = payload.next_round_millis;
    if (this.gamehistory.length > GAME_HISTORY_LENGTH) {
      this.gamehistory = this.gamehistory.slice(
        this.gamehistory.length - GAME_HISTORY_LENGTH,
        GAME_HISTORY_LENGTH
      );
    }
    this.setLost();
    this.planGameStart();
  };

  setLost = (): void => {
    this.gameplayers = this.gameplayers.map(pl=>{
      if (!pl.completed) pl.lost = true;
      return pl;
    })
  }
}

let state = new AppState();

(window as any).state = state;
export default state;
