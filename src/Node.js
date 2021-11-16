import React, { Component } from "react";

class Node extends Component {
  render() {
    const { val } = this.props;
    const { mousedown } = this.props;
    let c = "";
    if (val == -1) {
      c = "blocked";
    } else if (val == 1) {
      c = "source";
    } else if (val == 2) {
      c = "destination";
    } else if (val == 3) {
      c = "visited";
    } else if (val >= 40) {
      c = "path";
    }
    if (this.props.source == this.props.id) {
      c = "source";
    }
    if (this.props.destination == this.props.id) {
      c = "destination";
    }
    let pp = "";
    if (val > 40) {
      if (val % 10 == 1) {
        pp = "<";
      } else if (val % 10 == 2) {
        pp = ">";
      } else if (val % 10 == 3) {
        pp = "^";
      } else {
        pp = "v";
      }
    }
    return (
      <div
        className={"node " + c}
        onMouseOver={(e) => {
          if (mousedown) {
            this.props.handleClick(this.props.id);
          }
        }}
        onClick={() => {
          this.props.handleClick(this.props.id);
        }}
      >
        {pp}
      </div>
    );
  }
}

export default Node;
