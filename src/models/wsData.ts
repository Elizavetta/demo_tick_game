export type MessageData = {
  type: string,
  payload: object
}

export type MovePlayerData = {
  user: {
    id: number;
    username: string;
  };
  bet_amount: number;
  profit: number;
  coef: number;
};

export type GameFinishData = {
  coef: number;
  current_millis: number;
  next_round_millis: number;
};
