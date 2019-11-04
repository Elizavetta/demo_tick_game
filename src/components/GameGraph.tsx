import * as React from "react";
import AppState from "./../AppState";
import { observer } from "mobx-react";
import * as PIXI from "pixi.js";

import "./../styles.css";

@observer
export class GameGraph extends React.Component<any, any> {
  public app: PIXI.Application | null = null;
  public timestep: number = 1
  public tickstep: number = 0.5
  public margin: number = 50
  private txtTimings: PIXI.Text[] = []
  private txtY: PIXI.Text[] = []
  private graphPoints: PIXI.Point[] = []
  private maxPoints: number = 100;
  //public passedSec = 0;

  startPixiApp() {

    this.app = new PIXI.Application({ antialias: true, view: document.getElementById('GameApp') as HTMLCanvasElement});
    this.app.renderer.resize(1280, 720)
    const W = this.app.screen.width
    const H = this.app.screen.height

    const axis = new PIXI.Graphics()
    axis.lineStyle(1, 0xAAAAAA, 1)
    axis.moveTo(this.margin, this.margin)
    axis.lineTo(this.margin, H - this.margin)
    axis.lineTo(W - this.margin, H - this.margin)

    const timings = new PIXI.Graphics()
    const yLines = new PIXI.Graphics()
    const graph = new PIXI.Graphics()

    this.app.stage.addChild(axis)
    this.app.stage.addChild(timings)
    this.app.stage.addChild(yLines)
    this.app.stage.addChild(graph)

    this.drawGrid(timings, yLines)
    this.app.ticker.add(() => {
      this.drawGrid(timings, yLines)
      this.drawFunc(graph);
    });
  }

  drawGrid(timings: PIXI.Graphics, yLines: PIXI.Graphics) {

    if (!this.app ) return;
    const W = this.app.screen.width;
    const H = this.app.screen.height;
    let passed = 0;

    if (!this.props.started) {
      this.timestep = 1;
    }
    else {
      passed = (Date.now() - this.props.started)/1000
      if (this.props.started && this.props.stopped) {
        passed = (this.props.started - this.props.stopped)/1000
      }
      this.timestep = (passed < 10) ? 1 : (passed < 30 ? 2 : 5);
    }
    const nTimeLines: number = this.timestep === 1 ? 10 : ( Math.floor(passed/this.timestep));
    const xShrink = passed / this.timestep;
    //debugger

    //Y
    let nLines = 1;
    if (this.props.tick > 2) nLines = Math.floor((this.props.tick - 1) / this.tickstep);

    /*
    if (nLines > 2) {
      this.tickstep *= 2;
      nLines = Math.floor((this.props.tick - 1) / this.tickstep)
    }
    */

    const tstyle = new PIXI.TextStyle({
      fontFamily: 'Tahoma',
      fontSize: 16,
      fontWeight: 'normal',
      fill: '#aaaaaa',
    });

    timings.clear();
    timings.lineStyle(1, 0xAAAAAA, 1);
    if (this.txtTimings.length !== nTimeLines) {
      this.txtTimings.forEach((txt, ind)=>{
        if (ind >= nTimeLines) {
          timings.removeChild(txt);
        }
      });
      this.txtTimings = this.txtTimings.slice(0, nTimeLines);
    }

    for (let i = 0; i < nTimeLines; i++) {
      const posX = this.margin + i * ((W - this.margin * 2) / (this.timestep === 1 ? 10 : passed/this.timestep))
      timings.moveTo( posX, H - this.margin)
      timings.lineTo( posX, H - this.margin - 10)

      if (!this.txtTimings[i]) {
        this.txtTimings[i] = new PIXI.Text(i * this.timestep + 's', tstyle);
        this.txtTimings[i].x = posX;
        this.txtTimings[i].y = H - this.margin + 15;
        timings.addChild(this.txtTimings[i]);
      }
      else {
        this.txtTimings[i].text = i * this.timestep + 's'
        this.txtTimings[i].x = posX;
        this.txtTimings[i].y = H - this.margin + 15;
      }
    }

    yLines.clear();
    yLines.lineStyle(1, 0xAAAAAA, 1);

    if (this.txtY.length !== nLines) {
      this.txtY.forEach((txt, ind) => {
        if (ind >= nLines) {
          yLines.removeChild(txt);
        }
      });
      this.txtY = this.txtY.slice(0, nLines);
    }
    for (let i = 0; i < nLines; i++) {
      const posY = H - this.margin - (H - this.margin * 2) / (this.props.tick/this.tickstep);
      yLines.moveTo(this.margin, posY)
      yLines.lineTo(W - this.margin, posY)

      if (!this.txtY[i]) {
        this.txtY[i] = new PIXI.Text( 1 + i * this.tickstep + 'x', tstyle);
        this.txtY[i].x = 15;
        this.txtY[i].y = posY;
        yLines.addChild(this.txtY[i]);
      }
      else {
        this.txtY[i].text = 1 + i * this.tickstep + 'x';
        this.txtY[i].x = 15;
        this.txtY[i].y = posY;
      }
    }
  }

  drawFunc(graph: PIXI.Graphics) {

    if (!this.app || !this.props.started || this.props.stopped || !this.props.tick) return;
    const W = this.app.screen.width;
    const H = this.app.screen.height;
    let nPoints = this.props.tick < 2 ? Math.floor((this.props.tick - 1) * this.maxPoints): this.maxPoints;

    nPoints++;

    for (let i=0; i<nPoints; i++) {
      if (!this.graphPoints[i]) {
        this.graphPoints[i] = new PIXI.Point();
      }
      let xScreen = i * W / this.maxPoints;
      let scale = 1;
      let xGraph = xScreen * scale;

      this.graphPoints[i].x = xScreen;
      this.graphPoints[i].y = Math.pow(xScreen / 700, 1.2) * 350/ scale;
    }

    graph.clear();
    graph.lineStyle(6, 0x00FF00, 1);
    graph.drawPolygon(this.graphPoints);
    graph.lineStyle(0);
    graph.position.x = this.margin;
    graph.position.y = H - this.margin;
    graph.scale.y = -1;

  }

  componentDidMount() {
    this.startPixiApp()
  }

  render() {
    return (
      <div className="GameStage">
        <div className="GameGraphContainer">
          <div className="max-profit">
            <i className="clickable fa fa-line-chart" />
            Max profit: 10 000 000 coins
          </div>
          <canvas id="GameApp" width="800" height="600" />
          <div className="GameGraphText">
          {
            !this.props.paused &&
            <span className="GameGraphTick">tick {this.props.tick}</span>
          }
          { this.props.paused && !this.props.countdown &&
              <span className="GameGraphCrashed">Crashed {this.props.tick}x</span>
          }
          {this.props.paused && this.props.countdown &&
            < span className="GameGraphNext">Next round in {this.props.countdown}s</span>
          }
          </div>
        </div>
      </div>
    );
  }
}
