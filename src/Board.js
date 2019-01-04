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
    }
    window.document.addEventListener('keydown', this.changeDirection);
  }

  static defaultProps = {
    height: 500,
    width: 500,
  }
  
  generateAppleCoords() {
    let x = Math.round((Math.random()*490)/10)*10;
    let y = Math.round((Math.random()*490)/10)*10;
    return [ y, x ];
  }

  generateSnakeCoords() {
    const x = Math.floor(this.props.height / 2);
    const y = Math.floor(this.props.width / 2);
    return [ [y, x], [y, (x - 10)], [y, (x - 20)] ];
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.move(this.state.direction);
    }, 100);    
  }

  /*
  The snake will pop off the tail.
  The a new head will be pushed onto the snake depending on the current direction held in state.
  */
 move(direction) {
    let appleCoords = this.state.appleCoords;
    let snakeCoords = this.state.snakeCoords;
    let head = snakeCoords[0];
    if(direction === 'N') {
      if(head[0] === 0) {
        snakeCoords.unshift([this.props.height - 10, head[1]]);
      } else {
        snakeCoords.unshift([head[0] - 10, head[1]]);
      }
    }
    if(direction === 'E') {
      if(head[1] === this.props.width - 10) {
        snakeCoords.unshift([head[0], 0]);
      } else {
        snakeCoords.unshift([head[0], head[1] + 10]);
      }
    }
    if(direction === 'S') {
      if(head[0] === this.props.height-10) {
        snakeCoords.unshift([0, head[1]]);
      } else {
        snakeCoords.unshift([head[0] + 10, head[1]]);
      }
    }
    if(direction === 'W') {
      if(head[1] === 0) {
        snakeCoords.unshift([head[0], this.props.width - 10]);
      } else {
        snakeCoords.unshift([head[0], head[1] - 10]);
      }
    }

    if(this.sameCoords(appleCoords, snakeCoords[0])) {
      this.setState({snakeCoords, appleCoords: this.generateAppleCoords()});
    } else {
      snakeCoords.pop();
      this.setState({snakeCoords});
    }

 
  }

  sameCoords(coords1, coords2) {
    const [y1, x1] = coords1;
    const [y2, x2] = coords2;
    if(x1 === x2 && y1 === y2) {
      return true;
    }
    return false;
  }

  changeDirection = (event) => {
    const key = event.keyCode;
    let direction;
    if(key === 37) direction = 'W';
    if(key === 38) direction = 'N';
    if(key === 39) direction = 'E';
    if(key === 40) direction = 'S';
    this.setState({direction});
  };


  render() {
    return (
      <div className="board" 
                  style={{height: `${this.props.height}px`, width: `${this.props.width}px`}}
                  tabIndex='0'
                  onKeyDown={this.changeDirection}>
        <Snake parts={this.state.snakeCoords} />
        <Apple coords={this.state.appleCoords} />
      </div>
    )
  }
}

export default Board;