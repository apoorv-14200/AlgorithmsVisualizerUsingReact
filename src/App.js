import React, { Component } from "react";
import Node from "./Node";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: [],
      gamestate: 0,
      source: -1,
      destination: -1,
      row: 20,
      col: 40,
      mousedown: false,
      queue: [],
      pathfound: false,
      pathprinted: false,
      parent: [],
      algorithm: "",
      over: false,
    };
  }
  componentDidMount() {
    let p = [];
    let q = [];
    const { row, col } = this.state;
    for (let i = 0; i < row * col; i++) {
      p.push(0);
      q.push(0);
    }
    this.setState({
      graph: p,
      parent: q,
    });
    document.addEventListener("mousedown", () => {
      this.setState({
        mousedown: true,
      });
    });
    document.addEventListener("mouseup", () => {
      this.setState({
        mousedown: false,
      });
    });
  }
  handleClick = (id) => {
    console.log(id);
    const { gamestate, source, destination } = this.state;
    let curgraph = this.state.graph;
    if (gamestate == 0) {
      if (curgraph[id] == 0) {
        curgraph[id] = -1;
      } else {
        curgraph[id] = 0;
      }
      this.setState({
        graph: curgraph,
      });
    } else if (gamestate == 2) {
      if (curgraph[id] == 0) {
        if (source == -1) {
          curgraph[id] = 1;
          this.setState({
            source: id,
            graph: curgraph,
          });
        } else {
          curgraph[source] = 0;
          curgraph[id] = 1;
          this.setState({
            source: id,
            graph: curgraph,
          });
        }
      }
    } else if (gamestate == 3) {
      if (curgraph[id] == 0) {
        if (destination == -1) {
          curgraph[id] = 2;
          this.setState({
            destination: id,
            graph: curgraph,
          });
        } else {
          curgraph[destination] = 0;
          curgraph[id] = 2;
          this.setState({
            destination: id,
            graph: curgraph,
          });
        }
      }
    }
    console.log(this.state.graph);
  };
  shownext = () => {
    const { gamestate, source, destination } = this.state;
    if (gamestate == 0) {
      return true;
    } else if (gamestate == 1) {
      return this.state.algorithm != "";
    } else if (gamestate == 2) {
      return source != -1;
    } else if (gamestate == 3) {
      return false;
    } else {
      return false;
    }
  };
  handleNext = () => {
    const curstate = this.state.gamestate;
    console.log(curstate);
    if (curstate == 3) {
      let q = [];
      q.push(this.state.source);
      let curgraph = this.state.graph;
      curgraph[this.state.source] = 3;
      this.setState({
        queue: q,
        graph: curgraph,
      });
      this.go();
      // this.playbfs();
    }
    this.setState({
      gamestate: curstate + 1,
    });
  };
  mabs = (a) => {
    if (a < 0) {
      return -a;
    } else {
      return a;
    }
  };
  go = async () => {
    const { algorithm } = this.state;
    if (algorithm == "DFS") {
      await this.dfs(this.state.source);
      this.setState({ over: true });
      const curgraph = this.state.graph;
      if (this.state.pathfound) {
        this.makepath();
      }
    } else {
      this.playbfs();
    }
  };
  reset = () => {
    window.location.reload();
  };
  check = (x, y, row, col) => {
    if (x >= 0 && x < row && y >= 0 && y < col) {
      return 1;
    } else {
      return 0;
    }
  };
  makepath = () => {
    let path = [];
    const { source, destination } = this.state;
    let cur = destination;
    let parent = this.state.parent;
    let cnt = 500;
    while (cnt > 0 && cur != source) {
      console.log(cur);
      path.push(cur);
      cur = parent[cur];
      cnt--;
    }
    path.push(cur);
    let idx = 0;
    let pathid = setInterval(() => {
      if (idx == path.length) {
        clearInterval(pathid);
        this.setState({
          pathprinted: true,
        });
      }
      let curgraph = this.state.graph;
      curgraph[path[idx]] = 4;
      this.setState({
        graph: curgraph,
      });
      idx++;
      console.log("making path");
    }, 10);
  };
  playbfs = () => {
    this.state.myid = setInterval(() => {
      const { source, destination, row, col, pathfound, pathprinted } =
        this.state;
      let q = this.state.queue;
      let curgraph = this.state.graph;
      let curparent = this.state.parent;
      if (q.length == 0 || pathfound) {
        clearInterval(this.state.myid);
        this.setState({
          over: true,
        });
        this.makepath();
      } else {
        let cur = q.shift();
        let currow = Math.floor(cur / col);
        let curcol = cur % col;
        let d = [-1, 0, 1];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let neighbour = (currow + d[i]) * col + (curcol + d[j]);
            if (
              this.mabs(d[i] - d[j]) == 1 &&
              this.check(currow + d[i], curcol + d[j], row, col) &&
              curgraph[neighbour] != -1 &&
              curgraph[neighbour] != 3
            ) {
              curparent[neighbour] = cur;
              curgraph[neighbour] = 3;
              q.push(neighbour);
            }
          }
        }
      }
      if (curgraph[destination] == 3) {
        this.setState({
          graph: curgraph,
          queue: q,
          pathfound: true,
          parent: curparent,
        });
      } else {
        this.setState({
          graph: curgraph,
          queue: q,
          parent: curparent,
        });
      }
    }, 1);
  };
  delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  dfs = async (src) => {
    if (src == this.state.destination) {
      this.setState({
        pathfound: true,
      });
    }
    const { pathfound } = this.state;
    if (pathfound) {
      return;
    }
    let curgraph = this.state.graph;
    curgraph[src] = 3;
    this.setState({
      graph: curgraph,
    });
    await this.delay(3);
    const { row, col } = this.state;
    let cur = src;
    let currow = Math.floor(cur / col);
    let curcol = cur % col;
    let curparent = this.state.parent;
    curgraph = this.state.graph;
    let d = [-1, 0, 1];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let neighbour = (currow + d[i]) * col + (curcol + d[j]);
        if (
          this.mabs(d[i] - d[j]) == 1 &&
          this.check(currow + d[i], curcol + d[j], row, col) &&
          curgraph[neighbour] != -1 &&
          curgraph[neighbour] != 3
        ) {
          curparent[neighbour] = cur;
          this.setState({
            parent: curparent,
          });
          await this.dfs(neighbour);
        }
      }
    }
    return;
  };
  algoselect = (algo) => {
    this.setState({
      algorithm: algo,
    });
  };
  render() {
    const { graph } = this.state;
    const { gamestate } = this.state;
    const { source, destination } = this.state;
    const { pathprinted, pathfound, over } = this.state;
    let show = this.shownext();
    const algo = this.state.algorithm;
    return (
      <div>
        <div className="heading">
          {gamestate == 0 && <h1>Please click On cells to block them</h1>}
          {gamestate == 1 && <h1>Please Select Algorithm to visualize</h1>}
          {gamestate == 2 && <h1>Please choose Source</h1>}
          {gamestate == 3 && destination == -1 && (
            <h1>Please Select Destination</h1>
          )}
          {algo.length != 0 && (
            <div className="algohead">Selected Algo : {algo}</div>
          )}
          {destination != -1 && gamestate == 3 && <h1>Please click start</h1>}
          {over == false && gamestate == 4 && <h1>Started</h1>}
          {over == true && pathfound && <h1>Path Found</h1>}
          {over == true && pathfound == false && <h1>Path Not Found</h1>}
          {over && <button onClick={this.reset}>Reset</button>}
          {show && <button onClick={this.handleNext}>Next</button>}
          {destination != -1 && source != -1 && gamestate == 3 && (
            <button onClick={this.handleNext}>Start</button>
          )}
          {gamestate == 1 && (
            <button onClick={() => this.algoselect("BFS")}>BFS</button>
          )}
          {gamestate == 1 && (
            <button onClick={() => this.algoselect("DFS")}>DFS</button>
          )}
        </div>
        <div className="graph">
          {graph.map((node, id) => {
            return (
              <Node
                key={id}
                handleClick={this.handleClick}
                source={this.state.source}
                destination={this.state.destination}
                val={node}
                id={id}
                mousedown={this.state.mousedown}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
