import React, {Component} from 'react';

class Apple extends 
Component {
  render() {
    const [y, x] = this.props.coords;
    return <div key={`${x}-${y}`} className="apple" style={{top:y, left:x}}/>
  }
}


export default Apple;