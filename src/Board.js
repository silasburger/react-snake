import React, { Component } from 'react';

//This class renders the board handles moving the snake
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snakeCoords: this.generateInitialCoords(),
      direction: 'E',
    }
  }

  static defaultProps = {
    height: 800,
    width: 800,
  }

  componentDidMount() {
    // this.timerId = setInterval(() => {
    //   this.move(this.state.direction);
    // }, 500);    
  }

  /*
  The snake will pop off the tail.
  The a new head will be pushed onto the snake depending on the current direction held in state.
  */
  move(direction) {
    console.log(direction);
    let snakeCoords = this.state.snakeCoords;
    let head = snakeCoords[0];
    snakeCoords.pop();
    if(direction === 'N') {
      if(head[0] === 0) {
        snakeCoords.unshift([this.props.ncols - 1, head[1]]);
      } else {
        snakeCoords.unshift([head[0] + 1, head[1]]);
      }
    }
    if(direction === 'E') {
      if(head[1] === this.props.ncols.length - 1) {
        snakeCoords.unshift([head[0], 0]);
      } else {
        snakeCoords.unshift([head[0], head[1] + 1]);
      }
    }
    if(direction === 'S') {
      if(head[0] === this.props.nrows.length - 1) {
        snakeCoords.unshift([0, head[1]]);
      } else {
        snakeCoords.unshift([head[0] - 1, head[1]]);
      }
    }
    if(direction === 'W') {
      if(head[1] === 0) {
        snakeCoords.unshift([head[0], this.props.ncols.length - 1]);
      } else {
        snakeCoords.unshift([head[0], head[1] - 1]);
      }
    }
    this.setState({snakeCoords})
  }

  generateInitialCoords() {
    const x = Math.floor(this.props.ncols / 2);
    const y = Math.floor(this.props.nrows / 2);
    return [[y, x]];
  }

  drawSnake() {
    let board = this.state.board;
    for(let i = 0; i < this.snakeCoords.length; i++) {
      board[this.snakeCoords[i][0]][this.snakeCoords[i][1]] = true;
    }
    this.setState({board});
  }

  render() {
    
    return <div className="board" style={{height: this.props.height, width: this.props.width}}>
      <snake></snake>
    </div>;
  }
}

export default Board;