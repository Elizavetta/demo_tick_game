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
  @observable public completed: boolean = false;
  @observable public profit: number = 0;
  @observable public coef: number = 0;
  @observable public lost: boolean = false;

  constructor(params: GamePlayerParams) {
    this.id = params.id;
    this.username = params.username;
    this.activeGameBet = params.bet;
  }
}

export default GamePlayer;
