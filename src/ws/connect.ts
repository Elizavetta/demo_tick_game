import { WS_SIGNAL_MAP } from "./connectMap";
import { MessageData } from "./../models/wsData";

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

  onopen(event: Event) {
    console.log(" connection opened ");
  }

  onmessage(msgEvent: MessageEvent) {
    const msgData: MessageData =
      typeof msgEvent.data === "string" ? JSON.parse(msgEvent.data) : null;
    if (!msgData) return;
    WS_SIGNAL_MAP[msgData.type](msgData.payload);
  }

  onerror(errEvent: Event) {
    console.error("err: ", errEvent);
  }

  onclose(event: CloseEvent) {
    if (event.wasClean) {
      // no drop
    } else {
      //dropped
      console.warn("connection dropped!");
    }
    //reconnect
  }
}
