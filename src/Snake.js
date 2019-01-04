import React, {Component} from 'react';

class Snake extends 
Component {
  render() {
    const parts = this.props.parts.map(coord => {
      const [y, x] = coord;
      return <div key={`${y}-${x}`} className="snake-part" style={{top:y, left:x}}/>
    });
    return parts;
  }
}

export default Snake;