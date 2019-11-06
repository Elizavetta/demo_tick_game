import * as React from "react"
import { observer } from "mobx-react"
import { when,  reaction } from "mobx"
import * as PIXI from "pixi.js"

import "./../styles.css";

type PointsDataItem = {
  time: number;
  coef: number;
};


@observer
export class GameGraph extends React.Component<any, any> {

  public app: PIXI.Application | null = null;
  public timestep: number = 1
  public tickstep: number = 0.5
  public margin: number = 50
  private txtTimings: PIXI.Text[] = []
  private txtY: PIXI.Text[] = []
  private linesY: PIXI.Graphics[] = []
  private graphPoints: PIXI.Point[] = []
  //private maxPoints: number = 100
  private pointsPerSec = 10
  private pointsPer = 30
  private _pointsData: PointsDataItem[] = []
  private _pointsDataInt: any;
  private _currentXLength = 10
  private _currentYLength = 3
  private _startXPoint = 0
  private _startYPoint = 1.85
  private yLinesContainer: PIXI.Container = new PIXI.Container();
  private graphArrow: PIXI.Graphics = new PIXI.Graphics();
  //public passedSec = 0
  private tstyle = new PIXI.TextStyle({
    fontFamily: 'Tahoma',
    fontSize: 16,
    fontWeight: 'normal',
    fill: '#aaaaaa',
  });

  startPixiApp() {

    this.app = new PIXI.Application({
      antialias: true,
      view: document.getElementById('GameApp') as HTMLCanvasElement,
      backgroundColor: 0x232c31
    });
    this.app.renderer.resize(1280, 720)
    const W = this.app.screen.width
    const H = this.app.screen.height

    const axis = new PIXI.Graphics()
    axis.lineStyle(1, 0xAAAAAA, 1)
    axis.moveTo(this.margin, this.margin)
    axis.lineTo(this.margin, H - this.margin)
    axis.lineTo(W - this.margin, H - this.margin)

    const timings = new PIXI.Graphics()
    const yLines = this.yLinesContainer
    const graph = new PIXI.Graphics()

    const newLine = new PIXI.Graphics();
    newLine.lineStyle(1, 0xAAAAAA, 1);
    newLine.moveTo(this.margin, 0)
    newLine.lineTo(W - this.margin, 0)
    newLine.position.y = H/2;
    yLines.addChild(newLine);
    this.linesY.push(newLine);
    const txt_1x = new PIXI.Text('1.85x', this.tstyle);
    txt_1x.x = 15;
    txt_1x.y = H - this.margin - 16;
    yLines.addChild(txt_1x);


    this.linesY.push(newLine);

    this.app.stage.addChild(axis)
    this.app.stage.addChild(timings)
    this.app.stage.addChild(yLines)
    this.app.stage.addChild(graph)

    this.graphArrow.lineStyle(1, 0x00FF00, 1);

    this.graphArrow.beginFill(0x00FF00);
    this.graphArrow.moveTo(10, 0);
    this.graphArrow.lineTo(20, 35);
    this.graphArrow.lineTo(0, 35);
    this.graphArrow.lineTo(10, 0);
    this.graphArrow.endFill();
    this.graphArrow.pivot.set(10, 20);

    this.graphArrow.visible = false;
    this.app.stage.addChild(this.graphArrow);

    this.drawGrid(timings, yLines)
    this.app.ticker.add(() => {
      this.drawGrid(timings, yLines)
      this.drawFunc(graph);
    });
    this._pointsDataInt = setInterval(this.addPointsData.bind(this), 1000/this.pointsPerSec);

  }

  constructor(props:any) {
    super(props)

    reaction(
      () => this.props.started,
      started => {
        if (started) {
          this.initScale();
          this._pointsData = []
        }
      }
    )
  }

  addPointsData() {
    if ( this.props.paused && this.props.finished ) {
      this._pointsData = []
      return
    }
    if (!this.props.started) return
    this._pointsData.push({ time: (Date.now() - this.props.started) / 1000, coef: this.props.tick })

    const passed = ((Date.now() - this.props.started) / 1000);
    this._currentXLength = passed > 10 ? passed : 10;
    if (this._currentXLength > 10) {
      if (this._currentXLength < 30) this.timestep = 2
      else if (this._currentXLength < 60) this.timestep = 5
      else this.timestep = 10
    }
    const upTick = Math.ceil((this.props.tick - this._startYPoint) * this.tickstep) / this.tickstep;
    this._currentYLength = (this.props.tick - this._startYPoint < 1) ? 3 : (this.props.tick - this._startYPoint);
    if ( this._currentYLength > 1 ) {
      if (this._currentYLength <= 3) this.tickstep = 1
      else if (this._currentYLength <=6) this.tickstep = 2
      else this.tickstep = 4
    }
    //console.log('addPoints', this._pointsData.length, this.props.tick);
  }

  initScale() {
    if (!this.app) return

    const H = this.app.screen.height;
    this._currentXLength = 10
    this._currentYLength = 3
    this.timestep  = 1
    this.tickstep = 0.5

    this.linesY.forEach((line, ind)=>{
      if (ind > 0) this.yLinesContainer.removeChild(line)
    })
    this.linesY.length = 1;
    this.linesY[0].position.y = H / 2;

    this.txtY.forEach((text, ind)=>{
      if (ind > 0) this.yLinesContainer.removeChild(text)
    })
    this.txtY.length = 1;
    this.txtY[0].position.y = H / 2;
    this.txtY[0].text = '2.5x';

  }

  drawGrid(timings: PIXI.Graphics, yLines: PIXI.Container) {

    if (!this.app ) return;
    const W = this.app.screen.width;
    const H = this.app.screen.height;

    const nTimeLines: number = Math.floor(this._currentXLength / this.timestep);
    const nLines: number = Math.floor(this._currentYLength / this.tickstep);

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
      const posX = this.margin + i * ((W - this.margin * 2) / (this._currentXLength / this.timestep) );
      timings.moveTo( posX, H - this.margin)
      timings.lineTo( posX, H - this.margin - 10)

      if (!this.txtTimings[i]) {
        this.txtTimings[i] = new PIXI.Text(i * this.timestep + 's', this.tstyle);
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

    if (this.linesY.length < nLines) {
      const newLine = new PIXI.Graphics();
      newLine.lineStyle(1, 0xAAAAAA, 1, undefined, true);
      newLine.moveTo(this.margin, 0)
      newLine.lineTo(W - this.margin, 0)
      newLine.position.y = H/2;
      // (newLine as any).roundPixels = true;
      yLines.addChild(newLine);
      this.linesY.push(newLine);
    }
    /*
    else if (this.linesY.length > nLines) {
      this.linesY.forEach((line, ind)=>{
        //if (ind > nLines - 1) yLines.removeChild(line)
      })
      this.linesY.length = nLines;
    }
    */

    /*
    if (this.txtY.length > this.linesY.length) {
      this.txtY.forEach(txt => {
        yLines.removeChild(txt)
      })
      this.txtY.length = this.linesY.length;
    }
    */

    this.linesY.forEach((lineGraphics, ind)=>{
      const posY = H - ind * (H - this.margin * 2) / (this._currentYLength/this.tickstep) - this.margin;
      lineGraphics.position.y = posY;
      if (!this.txtY[ind]) {
        this.txtY[ind] = new PIXI.Text((this._startYPoint + ind * this.tickstep) + 'x', this.tstyle);
        this.txtY[ind].x = 15;
        this.txtY[ind].y = posY - 16;
        yLines.addChild(this.txtY[ind]);
      }
      else {
        this.txtY[ind].text = (this._startYPoint + ind * this.tickstep) + 'x';
        this.txtY[ind].x = 15;
        this.txtY[ind].y = posY - 16;
      }
    });


  }

  drawFunc(graph: PIXI.Graphics) {

    if (!this.app || !this.props.started || this.props.stopped || !this.props.tick) return;
    if (!this._pointsData.length) {
      graph.clear()
      this.graphPoints = [];
      return
    }

    const W = this.app.screen.width;
    const H = this.app.screen.height;

    for (let i=0; i < this._pointsData.length; i++) {
      if (!this.graphPoints[i]) {
        this.graphPoints[i] = new PIXI.Point();
      }
      let xScreen = this.margin + Math.floor(this._pointsData[i].time  * (( W - 2*this.margin )/this._currentXLength));
      let scale = 1;
      let xGraph = xScreen * scale;
      this.graphPoints[i].x = xScreen;

      //this.graphPoints[i].y = ((H - 2 * this.margin) / this._currentYLength) * (this._pointsData[i].coef - this._startYPoint);

      this.graphPoints[i].y = H - ((H - 2 * this.margin) / this._currentYLength) * (this._pointsData[i].coef - this._startYPoint) - this.margin;
      //this.graphPoints[i].y = Math.pow(xScreen / 700, 1.2) * 350/ scale;
    }

    graph.clear();
    graph.lineStyle(10, 0x00FF00, 1);
    graph.drawPolygon(this.graphPoints);

    // hack
    const data = (graph.geometry as any).graphicsData;
    data[data.length-1].shape.closeStroke = false;

    const lPoint = this.graphPoints[this.graphPoints.length - 1];
    const fPoint = this.graphPoints[0];
    const tgAngle = -(lPoint.x - fPoint.x)/(lPoint.y - fPoint.y);

    this.graphArrow.position.x = lPoint.x;
    this.graphArrow.position.y = lPoint.y;
    this.graphArrow.rotation = Math.atan(tgAngle);
    if (!this.graphArrow.visible) this.graphArrow.visible = true;

    //graph.lineStyle(0);
    //graph.position.x = 0;
    //graph.position.y = H;
    //graph.scale.y = -1;

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
            <span className="GameGraphTick"> {this.props.tick.toFixed(2)} </span>
          }
          { this.props.paused && this.props.finished &&
              <span className="GameGraphCrashed">Crashed @ {this.props.tick}x</span>
          }
            {this.props.paused && !this.props.finished &&
            < span className="GameGraphNext">Next round in {this.props.countdown}s</span>
          }
          </div>
        </div>
      </div>
    );
  }
}
