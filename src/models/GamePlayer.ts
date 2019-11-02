import { observable } from "mobx";

type GamePlayerParams = {
  id: number;
  username: string;
  bet: number;
};

export class GamePlayer {
  readonly id: number;
  readonly username: string;

  @observable public activeGameBet: number;
  @observable public completed: boolean;

  constructor(params: GamePlayerParams) {
    this.id = params.id;
    this.username = params.username;
    this.completed = false;
    this.activeGameBet = params.bet;
  }
}

export default GamePlayer;
