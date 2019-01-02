import React, { Component } from 'react';
import Cell from './Cell';
import uuid from 'uuid/v4';


//This class renders the board handles moving the snake
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snakeCoords: this.generateInitialCoords(),
      board: this.createBoard(),
      direction: 'E',
    }
  }

  static defaultProps = {
    nrows: 20,
    ncols: 20,
  }

  componentDidMount() {
    const timerId = setInterval(() => {
      this.move(this.direction);
    }, 500);    
  }

  /*
  The snake will pop off the tail.
  The a new head will be pushed onto the snake depending on the current direction held in state.
  */
  move(direction) {
    let snakeCoords = this.snakeCoords;
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
        snakeCoords.push([head[0], 0]);
      } else {
        snakeCoords.unshift([head[0], head[1] + 1]);
      }
    }
    if(direction === 'S') {
      if(head[0] === this.props.nrows.length - 1) {
        snakeCoords.push([0, head[1]]);
      } else {
        snakeCoords.unshift([head[0] - 1, head[1]]);
      }
    }
    if(direction === 'W') {
      if(head[1] === 0) {
        snakeCoords.push([head[0], this.props.ncols.length - 1]);
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

  createBoard() {
    let board = [];
    let row;
    for(let i = 0; i < this.props.ncols; i++) {
      (row = []).length = this.props.nrows;
      board.push(row.fill(false))
    }
    return board;
  }

  drawSnake() {
    let board = this.state.board;
    for(let i = 0; i < this.snakeCoords.length; i++) {
      board[this.snakeCoords[i][0]][this.snakeCoords[i][1]] = true;
    }
    this.setState({board});
  }

  render() {
    let rows = this.state.board.map((row, y) => {
      return (<div key={uuid()} className="row">
        {row.map((cell, x) => {
          return <Cell key={uuid()} isSnake={cell} />
        })}
      </div>);
    });

    return <div className="board">{rows}</div>;
  }
}

export default Board;