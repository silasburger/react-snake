import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLost: false,
      highscore: null,
      currScore: 0,
    }
    this.toggleLost = this.toggleLost.bind(this);
    this.addScore = this.addScore.bind(this);
  }

  componentDidMount() {
    let highscore = localStorage.getItem('highscore');
    this.setState({highscore});
  }

  static defaultProps = {
    height: 300,
    width: 300,
  }

  toggleLost() {
    let highscore = this.state.highscore;
    let currScore = 0;
    if(this.state.hasLost === false) currScore = this.state.currScore;
    if(this.state.currScore >= this.state.highscore) {
      highscore = this.state.currScore;
      localStorage.setItem('highscore', highscore);
    }
    this.setState((st)=>({hasLost:!st.hasLost, highscore, currScore}));
  }
  
  addScore() {
    this.setState((st)=>({currScore: st.currScore + 10}))
  }

  render() {
    return (
      <div className="game-container" style={{height: this.props.height, width: this.props.width}}>
        <div className="high-score">Highscore: {this.state.highscore ? this.state.highscore : 0}</div>
        <div className="current-score">Current Score: {this.state.currScore}</div>
        {this.state.hasLost ? <button className="restart-button" onClick={this.toggleLost}>Restart</button> : <Board height={this.props.height} width={this.props.width} currScore={this.props.currScore} addScore={this.addScore} toggleLost={this.toggleLost} />}
      </div>
    );
  }
}

export default App;
