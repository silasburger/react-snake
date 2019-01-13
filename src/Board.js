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
      hasLost: false,
    }
    window.document.addEventListener('keydown', this.changeDirection);
  }

  static defaultProps = {
    height: 300,
    width: 300,
  }
  
  generateAppleCoords() {
    let x = Math.round((Math.random()*(this.props.height-10))/10)*10;
    let y = Math.round((Math.random()*(this.props.width-10))/10)*10;
    return [ y, x ];
  }

  generateSnakeCoords() {
    const x = Math.floor(this.props.height / 2);
    const y = Math.floor(this.props.width / 2);
    return [ [y, x], [y, (x - 10)], [y, (x - 20)] ];
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
    
    //Must be first set state to be called or else another set state (one in block below) will allow for duplicate keys upon losing game
    for(let i = 1; i < snakeCoords.length; i++) {
      if(this.sameCoords(snakeCoords[0], snakeCoords[i])) {
        this.setState({hasLost: true});
      }
    }
    
    //pops of the tail or leaves it if there is an apple at head coords
    //add additional squares to tails as score gets higher
    if(this.sameCoords(appleCoords, snakeCoords[0])) {
      this.setState({snakeCoords, appleCoords: this.generateAppleCoords()});
      this.props.addScore();
      this.increaseSpeed(this.props.currScore);
    } else {
      snakeCoords.pop();
      this.setState({snakeCoords});
    }
    
    if(this._nextDirection) {
      this.setState({direction: this._nextDirection});
      this._nextDirection = null;
    }

    // Must be at end to prevent calling setState on unmounted component
    if(this.state.hasLost) {
      this.props.toggleLost();
    }

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
    if(x1 === x2 && y1 === y2) {
      return true;
    }
    return false;
  }

  changeDirection = (event) => {
    const key = event.keyCode;
    let direction = this.state.direction;
    if(key === 37 && direction !== 'E') direction = 'W';
    if(key === 38 && direction !== 'S') direction = 'N';
    if(key === 39 && direction !== 'W') direction = 'E';
    if(key === 40 && direction !== 'N') direction = 'S';
    this._nextDirection = direction;
  };


  render() {
    const board = <div className="board" 
      style={{height: `${this.props.height}px`, width: `${this.props.width}px`}}>
        <>
          <Snake parts={this.state.snakeCoords} />
          <Apple coords={this.state.appleCoords} />
        </>
    </div>;

    return this.state.hasLost ? null : board;
  }
}

export default Board;