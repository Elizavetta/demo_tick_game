import { WS_SIGNAL_MAP } from "./connectMap";

interface IConnection {
  online: Boolean;
  ws: WebSocket;
}

interface IMessageData {
  type: string;
  payload: object;
}

export class Connection implements IConnection {
  public online: Boolean;
  public ws: WebSocket;

  constructor() {
    this.online = false;
    this.ws = new WebSocket("wss://crash.heja.games/ws");
    this.ws.onopen = this.onopen;
    this.ws.onmessage = this.onmessage;
    this.ws.onerror = this.onerror;
    this.ws.onclose = this.onclose;
  }

  onopen(event) {
    console.log(" connection opened ");
  }

  onmessage(msgEvent: MessageEvent) {
    const msgData =
      typeof msgEvent.data === "string" ? JSON.parse(msgEvent.data) : null;
    if (!msgData) return;
    WS_SIGNAL_MAP[msgData.type](msgData.payload);
  }

  onerror(err: MessageEvent) {
    console.error("err: ", err);
  }

  onclose(event) {
    if (event.wasClear) {
      // no drop
    } else {
      //dropped
      console.warn("connection dropped!");
    }
    //reconnect
  }
}
