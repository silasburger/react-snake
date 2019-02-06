import React, { Component } from 'react';
import Snake from './Snake';
import Apple from './Apple';

//This class renders the board handles moving the snake
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snakeCoords: this.generateSnakeCoords(),
      direction: 'E',
      appleCoords: this.generateAppleCoords(),
      hasLost: false
    };
    document.addEventListener('keydown', this.changeDirection);
  }

  static defaultProps = {
    height: 300,
    width: 300
  };

  generateAppleCoords() {
    let x = Math.round((Math.random() * (this.props.height - 10)) / 10) * 10;
    let y = Math.round((Math.random() * (this.props.width - 10)) / 10) * 10;
    return [y, x];
  }

  generateSnakeCoords() {
    const x = Math.floor(this.props.height / 2);
    const y = Math.floor(this.props.width / 2);
    return [[y, x], [y, x - 10], [y, x - 20]];
  }

  componentDidMount() {
    this._speed = 150;
    this._intervalId = setInterval(() => {
      this.move(this.state.direction);
    }, this._speed);
  }

  componentWillUnmount() {
    clearInterval(this._intervalId);
    window.removeEventListener('keydown', this.changeDirection);
  }

  /*
  The snake will pop off the tail.
  The a new head will be pushed onto the snake depending on the current direction held in state.
  */
  move(direction) {
    let appleCoords = this.state.appleCoords;
    let snakeCoords = this.state.snakeCoords;
    let head = snakeCoords[0];
    /**
     * This is the part where the new head is added to snake coords, depending on the direction
     */
    if (direction === 'N') {
      if (head[0] === 0) {
        snakeCoords.unshift([this.props.height - 10, head[1]]);
      } else {
        snakeCoords.unshift([head[0] - 10, head[1]]);
      }
    }
    if (direction === 'E') {
      if (head[1] === this.props.width - 10) {
        snakeCoords.unshift([head[0], 0]);
      } else {
        snakeCoords.unshift([head[0], head[1] + 10]);
      }
    }
    if (direction === 'S') {
      if (head[0] === this.props.height - 10) {
        snakeCoords.unshift([0, head[1]]);
      } else {
        snakeCoords.unshift([head[0] + 10, head[1]]);
      }
    }
    if (direction === 'W') {
      if (head[1] === 0) {
        snakeCoords.unshift([head[0], this.props.width - 10]);
      } else {
        snakeCoords.unshift([head[0], head[1] - 10]);
      }
    }

    /**
     * Sets new conditions for snake, game, and apple in a single setState
     * also adds score and increases speed
     */
    this.setConditions(
      snakeCoords,
      appleCoords,
      this.hasLost(snakeCoords),
      this._nextDirection
    );
  }

  setConditions(snakeCoords, appleCoords, hasLost, nextDirection) {
    /**
     * This conditional handles the business logic of snake movement
     * In the case that the apple and the head share coords, add to the score, increase speed, and don't pop off tail (this is how it grows)
     * Otherwise, pop off tail
     */
    if (this.sameCoords(appleCoords, snakeCoords[0])) {
      this.props.addScore();
      this.increaseSpeed(this.props.currScore);
      appleCoords = this.generateAppleCoords();
    } else {
      snakeCoords.pop();
    }
     /**
      * Sets new direction if one has been set and sets it to null
      */
    let direction = this.state.direction;
    if(nextDirection) {
      direction = nextDirection
      this._nextDirection = null;
    }

    this.setState({ snakeCoords, appleCoords, hasLost, direction });
    if (hasLost) {
      this.props.toggleLost();
    }
  }

  hasLost(snakeCoords) {
    for (let i = 1; i < snakeCoords.length; i++) {
      if (this.sameCoords(snakeCoords[0], snakeCoords[i])) {
        return true;
      }
    }
    return false;
  }

  increaseSpeed(score) {
    this._speed = this._speed - 4;
    clearInterval(this._intervalId);
    this._intervalId = setInterval(() => {
      this.move(this.state.direction);
    }, this._speed);
  }

  sameCoords(coords1, coords2) {
    const [y1, x1] = coords1;
    const [y2, x2] = coords2;
    if (x1 === x2 && y1 === y2) {
      return true;
    }
    return false;
  }

  changeDirection = event => {
    event.stopPropagation();
    event.preventDefault();
    const key = event.keyCode;
    let direction = this.state.direction;
    if (key === 37 && direction !== 'E') direction = 'W';
    if (key === 38 && direction !== 'S') {
      direction = 'N';
    }
    if (key === 39 && direction !== 'W') direction = 'E';
    if (key === 40 && direction !== 'N') direction = 'S';
    this._nextDirection = direction;
  };

  render() {
    const board = (
      <div
        className="board"
        style={{
          height: `${this.props.height}px`,
          width: `${this.props.width}px`
        }}
      >
        <>
          <Snake parts={this.state.snakeCoords} />
          <Apple coords={this.state.appleCoords} />
        </>
      </div>
    );

    return this.state.hasLost ? null : board;
  }
}

export default Board;
